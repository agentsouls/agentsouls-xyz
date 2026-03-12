# DentalClaw — NexHealth Integration Guide

Connect DentalClaw to NexHealth for online booking, appointment status, and
patient messaging. NexHealth acts as a middleware layer that connects to your
practice management system (Dentrix, Eaglesoft, Open Dental, etc.) and exposes
a modern REST API.

---

## Overview

| Feature | Access Level | Notes |
|---------|-------------|-------|
| Online booking | Read-write | Book appointments directly |
| Appointment status | Read-only | View upcoming/past appointments |
| Available slots | Read-only | Query openings by provider/type |
| Patient messaging | Write | Send confirmations and reminders |
| Patient lookup | Read-only | By phone or email |
| Forms & intake | Read-only | Check form completion status |
| Clinical data | Blocked | Not accessed via NexHealth |
| Billing/payments | Blocked | Not accessed |

---

## Prerequisites

- Active NexHealth account connected to your PMS
- NexHealth API key (from NexHealth dashboard > Developer > API Keys)
- NexHealth subdomain (your practice's NexHealth subdomain)
- Location ID (for multi-location practices)

---

## Step 1: Obtain API Credentials

1. Log in to your NexHealth dashboard at `https://[subdomain].nexhealth.com`.
2. Navigate to **Settings > Developer > API Keys**.
3. Create a new API key with the following scopes:
   - `appointments:read`
   - `appointments:write` (if enabling direct booking)
   - `availabilities:read`
   - `patients:read`
   - `messages:write` (if enabling patient messaging)
4. Copy the API key and subdomain.

---

## Step 2: Configure Credentials

Add to your `.env` file:

```bash
# NexHealth Integration
NEXHEALTH_API_KEY=your-nexhealth-api-key
NEXHEALTH_SUBDOMAIN=yourpractice
NEXHEALTH_LOCATION_ID=your-location-id
CALENDAR_PROVIDER=nexhealth
```

---

## Step 3: Configure DentalClaw

In your harness configuration:

```yaml
tools:
  calendar:
    enabled: true
    provider: nexhealth
    mode: read_write       # NexHealth supports direct booking
    providers:
      nexhealth:
        api_url: "https://nexhealth.info/api/v1"
        api_key: "${NEXHEALTH_API_KEY}"
        subdomain: "${NEXHEALTH_SUBDOMAIN}"
        location_id: "${NEXHEALTH_LOCATION_ID}"
```

---

## Step 4: Network Configuration

Add NexHealth to the network allowlist:

```yaml
security:
  sandbox:
    network:
      allowed_hosts:
        - "nexhealth.info"
```

---

## Step 5: Appointment Type Mapping

Map your NexHealth appointment types to patient-friendly names. Create or
update the knowledge base:

```markdown
<!-- In knowledge/scaffold/services.md -->

| Service | NexHealth Appointment Type ID | Duration |
|---------|-------------------------------|----------|
| New Patient Exam | apt_type_001 | 60 min |
| Cleaning (Prophylaxis) | apt_type_002 | 45 min |
| Emergency Visit | apt_type_003 | 30 min |
| Crown Prep | apt_type_004 | 90 min |
| ...
```

The agent uses these mappings to translate between patient language ("I need a
cleaning") and NexHealth appointment type IDs.

---

## Step 6: Online Booking Flow

When direct booking is enabled (`mode: read_write`), the agent follows this flow:

1. **Identify appointment type** — Ask what the patient needs.
2. **Query availability** — `GET /availabilities?location_id=X&appointment_type_id=Y&start_date=Z`
3. **Present options** — Offer 2-3 available slots.
4. **Collect patient info** — Name, phone, email (minimum for booking).
5. **Create appointment** — `POST /appointments` with slot + patient details.
6. **Confirm** — Share confirmation with date, time, provider, and any prep instructions.

### API Calls

```bash
# Check availability
GET https://nexhealth.info/api/v1/availabilities
  ?subdomain={subdomain}
  &location_id={location_id}
  &appointment_type_id={type_id}
  &start_date=2026-03-15
  &end_date=2026-03-20
  &provider_id={provider_id}    # Optional

# Create appointment
POST https://nexhealth.info/api/v1/appointments
{
  "subdomain": "{subdomain}",
  "appointment": {
    "location_id": "{location_id}",
    "provider_id": "{provider_id}",
    "appointment_type_id": "{type_id}",
    "start_time": "2026-03-16T10:00:00-04:00",
    "patient": {
      "first_name": "Jane",
      "last_name": "Doe",
      "phone": "5551234567",
      "email": "jane@example.com"
    }
  }
}

# Check appointment status
GET https://nexhealth.info/api/v1/appointments/{appointment_id}
  ?subdomain={subdomain}
```

---

## Step 7: Patient Messaging

If messaging is enabled, DentalClaw can send appointment confirmations and
reminders through NexHealth:

```bash
POST https://nexhealth.info/api/v1/messages
{
  "subdomain": "{subdomain}",
  "message": {
    "patient_id": "{patient_id}",
    "type": "sms",
    "body": "Hi Jane! Your appointment at [Practice Name] is confirmed for March 16 at 10:00 AM. See you then!"
  }
}
```

**Rules for automated messages:**
- Only send confirmations for appointments the agent just booked.
- Recall reminders must be triggered by the recall system, not ad hoc.
- Never include clinical information in messages.
- Respect patient opt-out preferences (check `patient.communication_preferences`).

---

## Step 8: Patient Lookup

When a returning patient contacts the agent, look them up by phone:

```bash
GET https://nexhealth.info/api/v1/patients
  ?subdomain={subdomain}
  &phone={phone_number}
```

**Allowed fields from response:**
- `first_name`, `last_name`
- `phone`, `email`
- `upcoming_appointments` (date, time, type — no clinical notes)
- `insurance_plan_name`

**Blocked fields (never accessed even if returned):**
- `date_of_birth`
- `ssn`
- `medical_history`
- `treatment_notes`
- `balance`

---

## Step 9: Webhook Configuration (Optional)

NexHealth can send webhooks to DentalClaw for real-time updates:

1. In NexHealth dashboard, go to **Settings > Webhooks**.
2. Add a webhook URL: `https://chat.yourpractice.com/webhooks/nexhealth`
3. Subscribe to events:
   - `appointment.confirmed`
   - `appointment.cancelled`
   - `appointment.rescheduled`
4. Set the webhook secret and add it to `.env`:

```bash
NEXHEALTH_WEBHOOK_SECRET=your-webhook-secret
```

---

## Testing

```bash
# Test API connectivity
curl -s -H "Authorization: Bearer ${NEXHEALTH_API_KEY}" \
  "https://nexhealth.info/api/v1/locations?subdomain=${NEXHEALTH_SUBDOMAIN}" | jq .

# Test availability query
curl -s -H "Authorization: Bearer ${NEXHEALTH_API_KEY}" \
  "https://nexhealth.info/api/v1/availabilities?subdomain=${NEXHEALTH_SUBDOMAIN}&location_id=${NEXHEALTH_LOCATION_ID}&start_date=$(date +%Y-%m-%d)&end_date=$(date -d '+7 days' +%Y-%m-%d)" | jq .
```

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | API key invalid | Regenerate in NexHealth dashboard |
| No availability returned | Appointment types not configured | Set up types in NexHealth |
| Booking fails | Missing required patient fields | Ensure name + phone collected |
| Wrong location | Multi-location mismatch | Verify `NEXHEALTH_LOCATION_ID` |
| Message not delivered | Patient opted out of SMS | Check communication preferences |

---

## Security Notes

- NexHealth API key should be rotated every 90 days.
- Use HTTPS exclusively — NexHealth enforces TLS.
- Webhook payloads are signed — always verify the signature.
- DentalClaw's PHI filter runs on all NexHealth API responses before they
  enter the conversation context.
- Log API calls for audit purposes but redact patient identifiers from logs.

---

*DentalClaw v1.0.0 — NexHealth Integration*
*ClawBuilt — https://clawbuilt.ai*
