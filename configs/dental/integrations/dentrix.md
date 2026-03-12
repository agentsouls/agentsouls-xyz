# DentalClaw — Dentrix Integration Guide

Connect DentalClaw to Dentrix for read-only calendar access and appointment
status checks. This integration allows the agent to view available slots and
confirm existing appointments without modifying clinical or financial data.

---

## Overview

| Feature | Access Level | Notes |
|---------|-------------|-------|
| View appointment slots | Read-only | Available times for scheduling |
| Check appointment status | Read-only | Confirmed, pending, completed |
| View provider schedules | Read-only | Which providers are available when |
| Patient lookup (by phone) | Read-only | Name + appointment history only |
| Create/modify appointments | Not available | Requires explicit upgrade |
| Clinical data | Blocked | Never accessed |
| Financial data | Blocked | Never accessed |

---

## Prerequisites

- Dentrix G7 or later with the Dentrix Developer API enabled
- A Dentrix API key (obtained from your Dentrix administrator or Henry Schein)
- Network connectivity from the DentalClaw server to the Dentrix API endpoint
- Dentrix location ID for multi-location practices

---

## Step 1: Enable the Dentrix Developer API

1. Contact Henry Schein / Dentrix support to request Developer API access for
   your practice.
2. You will receive:
   - API endpoint URL (e.g., `https://api.dentrix.com/v1` or a local endpoint)
   - API key
   - Location ID
3. Note: Dentrix API access may require an additional subscription fee. Confirm
   pricing with Henry Schein.

---

## Step 2: Configure Credentials

Add the following to your `.env` file:

```bash
# Dentrix Integration
DENTRIX_API_URL=https://api.dentrix.com/v1
DENTRIX_API_KEY=your-dentrix-api-key-here
DENTRIX_LOCATION_ID=your-location-id
DENTRIX_API_HOST=api.dentrix.com
```

Ensure `.env` has restricted permissions:

```bash
chmod 600 /opt/dentalclaw/.env
```

---

## Step 3: Configure DentalClaw

In your harness configuration (e.g., `hermes-config.yaml`), set the calendar
provider to Dentrix:

```yaml
tools:
  calendar:
    enabled: true
    provider: dentrix
    mode: read_only
```

If using OpenClaw, set:

```bash
CALENDAR_PROVIDER=dentrix
```

---

## Step 4: Network Configuration

The DentalClaw container must be able to reach the Dentrix API endpoint. Add
the Dentrix host to the network allowlist:

```yaml
# In hermes-config.yaml -> security -> sandbox -> network
network:
  allowed_hosts:
    - "api.dentrix.com"        # Or your on-premise Dentrix server
    - "${DENTRIX_API_HOST}"
```

For on-premise Dentrix servers:
- Ensure the DentalClaw server can reach the Dentrix server on the local network
- You may need to configure VPN or SSH tunnel for remote deployments
- Whitelist the DentalClaw server's IP address in Dentrix firewall rules

---

## Step 5: Test the Connection

```bash
# Test API connectivity from the DentalClaw container
docker compose exec dentalclaw curl -s \
  -H "Authorization: Bearer ${DENTRIX_API_KEY}" \
  "${DENTRIX_API_URL}/appointments?date=$(date +%Y-%m-%d)" | head -20
```

Expected response: JSON array of today's appointments (or empty array if none).

---

## Step 6: Data Mapping

DentalClaw maps Dentrix data to its internal format:

| Dentrix Field | DentalClaw Field | Used For |
|---------------|-----------------|----------|
| `appointment.date` | `slot.date` | Availability display |
| `appointment.time` | `slot.time` | Availability display |
| `appointment.duration` | `slot.duration_minutes` | Slot sizing |
| `appointment.status` | `appointment.status` | Status checks |
| `appointment.provider_id` | `provider.id` | Provider filtering |
| `provider.name` | `provider.display_name` | "Dr. Smith is available..." |
| `patient.first_name` | `patient.first_name` | Greeting returning patients |
| `patient.phone` | `patient.phone` | Patient lookup key |

**Blocked fields (never accessed):**
- `patient.ssn`
- `patient.dob`
- `patient.medical_history`
- `patient.treatment_plan`
- `patient.ledger`
- `patient.insurance_details` (beyond plan name)
- Any clinical notes or charting data

---

## Step 7: Appointment Status Values

| Dentrix Status | DentalClaw Display | Agent Behavior |
|----------------|-------------------|----------------|
| Scheduled | "You have an appointment scheduled" | Confirm details |
| Confirmed | "Your appointment is confirmed" | Confirm details |
| Checked In | "It looks like you're already checked in" | — |
| In Progress | "Your appointment is currently in progress" | — |
| Completed | "Your last appointment has been completed" | Offer to schedule next |
| Cancelled | "That appointment was cancelled" | Offer to reschedule |
| No Show | (Not disclosed to patient) | Offer to schedule new |
| Broken | (Not disclosed to patient) | Offer to schedule new |

---

## Step 8: Sync Frequency

- **Real-time:** DentalClaw queries the Dentrix API on each scheduling request.
  No local caching of appointment data.
- **Rate limiting:** Queries are rate-limited to 1 request per 5 seconds per
  conversation to avoid overwhelming the Dentrix server.
- **Timeout:** API calls timeout after 10 seconds. On timeout, the agent
  apologizes and offers to take a message.

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "Calendar unavailable" | API key invalid or expired | Verify `DENTRIX_API_KEY` in .env |
| Timeout errors | Dentrix server unreachable | Check network connectivity, VPN |
| Empty availability | Wrong location ID | Verify `DENTRIX_LOCATION_ID` |
| "Unauthorized" response | IP not whitelisted | Add DentalClaw server IP to Dentrix allowlist |
| Missing providers | API scope limited | Contact Henry Schein to expand API access |

---

## Security Notes

- The Dentrix API key grants read access to scheduling data. Store it securely.
- Never log full API responses (they may contain patient identifiers).
- The DentalClaw PHI filter scrubs any clinical data that may appear in API
  responses before it reaches the conversation context.
- Rotate the API key annually or whenever staff with access depart.
- Audit Dentrix API access logs quarterly.

---

## Upgrading to Read-Write Access

To enable direct appointment booking through DentalClaw:

1. Request write-scope API access from Henry Schein.
2. Change `mode: read_only` to `mode: read_write` in the harness config.
3. The agent will then confirm bookings directly rather than relaying requests.
4. **Important:** Enable appointment confirmation notifications (email/SMS to
   patient and office) when using write mode.

This is a significant operational change. Test thoroughly in a staging
environment before enabling in production.

---

*DentalClaw v1.0.0 — Dentrix Integration*
*ClawBuilt — https://clawbuilt.ai*
