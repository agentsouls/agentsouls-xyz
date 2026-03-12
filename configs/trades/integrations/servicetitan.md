# TradeClaw — ServiceTitan Integration Guide

## Overview

ServiceTitan is the leading field service management platform for HVAC, plumbing, and electrical contractors. This integration enables TradeClaw to create jobs, look up customers, and read the dispatch board — turning the AI agent into a front-office extension of ServiceTitan.

**Tier:** Starter (read-only) / Pro (read-write) / Agency (full two-way sync)

---

## What This Integration Does

| Action | Direction | Tier | Description |
|---|---|---|---|
| Customer lookup | Agent → ST | Starter | Search for existing customers by phone, name, or address |
| Job creation | Agent → ST | Pro | Create new jobs from qualified service requests |
| Dispatch board read | Agent → ST | Pro | Check technician availability for scheduling |
| Job status updates | ST → Agent | Agency | Receive webhooks when jobs are updated, completed, or cancelled |
| Customer sync | ST → Agent | Agency | Keep customer records in sync |
| Invoice/estimate read | Agent → ST | Agency | Reference past invoices for context |

---

## Prerequisites

1. **ServiceTitan account** with API access enabled (contact your ServiceTitan rep)
2. **API credentials:**
   - Client ID
   - Client Secret
   - Tenant ID
3. **Webhook configuration** (Agency tier — requires ServiceTitan to enable for your account)
4. **Composio OAuth connection** (recommended for token management — see `security/composio-setup.md`)

---

## Setup

### Step 1: Obtain API Credentials

1. Log into ServiceTitan as an admin
2. Navigate to Settings > Integrations > API Application
3. Create a new application (or use existing)
4. Note the Client ID and Client Secret
5. Your Tenant ID is in your ServiceTitan URL: `go.servicetitan.com/tenant/{TENANT_ID}/...`

### Step 2: Configure Environment

Add to your `.env`:

```bash
SERVICETITAN_ENABLED=true
SERVICETITAN_CLIENT_ID=your-client-id
SERVICETITAN_CLIENT_SECRET=your-client-secret
SERVICETITAN_TENANT_ID=your-tenant-id
SERVICETITAN_API_URL=https://api.servicetitan.io/v2
SERVICETITAN_TOKEN_URL=https://auth.servicetitan.io/connect/token
```

### Step 3: Authenticate

ServiceTitan uses OAuth 2.0 client credentials flow:

```bash
curl -X POST https://auth.servicetitan.io/connect/token \
  -d "grant_type=client_credentials" \
  -d "client_id=$SERVICETITAN_CLIENT_ID" \
  -d "client_secret=$SERVICETITAN_CLIENT_SECRET"
```

The agent handles token refresh automatically. Tokens expire after 1 hour.

### Step 4: Configure Webhooks (Agency Tier)

In ServiceTitan admin:
1. Navigate to Settings > Integrations > Webhooks
2. Add endpoint: `https://your-domain.com/webhooks/servicetitan/job`
3. Select events: Job Created, Job Updated, Job Completed, Job Cancelled
4. Set shared secret and add to `.env` as `SERVICETITAN_WEBHOOK_SECRET`

---

## Agent Capabilities with ServiceTitan

### Customer Lookup

When a customer calls, the agent searches ServiceTitan by phone number:

```
Agent receives call from +1-555-123-4567
→ Searches ServiceTitan: GET /customers?phone=5551234567
→ Finds: "John Smith, 123 Main St, last service: AC Repair on 06/15/2025"
→ Agent: "Hi John, I see we were out at Main Street back in June for your AC. What can we help with today?"
```

This recognition builds trust and saves time on repeat calls.

### Job Creation

When the agent qualifies a standard service request:

```
Agent collects: name, phone, address, issue, preferred time
→ Checks service area ✓
→ Creates job in ServiceTitan: POST /jobs
  {
    "customerId": 12345,
    "type": "Service",
    "summary": "AC not cooling — customer reports warm air from vents",
    "priority": "Normal",
    "businessUnit": "HVAC",
    "scheduledDate": "2025-07-15",
    "scheduledWindow": "AM"
  }
→ Agent: "You're all set. We have you on the schedule for Tuesday morning. Our tech will call 30 minutes before arrival."
```

### Dispatch Board Read

For scheduling, the agent checks technician availability:

```
Agent: "Let me check availability..."
→ GET /dispatch/available-slots?date=2025-07-15&businessUnit=HVAC
→ Returns: AM slot open, PM slot open for Thursday; AM only for Friday
→ Agent: "We have Thursday morning or afternoon, or Friday morning. Which works best?"
```

---

## API Endpoints Used

| Endpoint | Method | Purpose |
|---|---|---|
| `/crm/v2/tenant/{id}/customers` | GET | Customer lookup |
| `/crm/v2/tenant/{id}/customers` | POST | Create new customer |
| `/jpm/v2/tenant/{id}/jobs` | GET | Look up existing jobs |
| `/jpm/v2/tenant/{id}/jobs` | POST | Create new job |
| `/dispatch/v2/tenant/{id}/appointments` | GET | Check availability |
| `/memberships/v2/tenant/{id}/memberships` | GET | Check maintenance plan status |

---

## Data Mapping

| TradeClaw Field | ServiceTitan Field |
|---|---|
| customer_name | customer.name |
| phone | customer.phoneNumbers[0].number |
| service_address | location.address |
| issue_description | job.summary |
| priority (emergency/standard) | job.priority (Urgent/Normal) |
| service_type | job.businessUnit + job.type |
| preferred_window | appointment.arrivalWindowStart/End |
| maintenance_plan | membership.status |

---

## Error Handling

| Error | Handling |
|---|---|
| Customer not found | Agent creates new customer record |
| API timeout | Retry once, then fall back to manual capture (agent logs request for office to enter) |
| Auth failure | Refresh token, retry. If still failing, alert admin. |
| Rate limit (429) | Back off and retry. Queue request if during peak. |
| Job creation failure | Log error, inform customer the request is captured, escalate to office |

**Critical:** Never let an API error prevent the agent from capturing the customer's information. If ServiceTitan is down, the agent captures everything and logs it for manual entry.

---

## Testing

```bash
# Test customer lookup
python scripts/test_servicetitan.py --action customer_lookup --phone 5551234567

# Test job creation
python scripts/test_servicetitan.py --action create_job --test

# Test webhook reception
curl -X POST http://localhost:8000/webhooks/servicetitan/job \
  -H "Content-Type: application/json" \
  -H "X-ServiceTitan-Signature: <hmac>" \
  -d '{"eventType": "job.completed", "jobId": 12345}'
```

---

## Gotchas

- ServiceTitan rate limits are relatively low. Cache customer lookups in Redis (TTL: 1 hour).
- Job creation requires a valid customer ID. Always look up or create the customer first.
- ServiceTitan's API documentation can be outdated. Test all endpoints in sandbox before production.
- Webhook delivery is not guaranteed. Implement a reconciliation job that polls for missed updates (Agency tier).
- Some ServiceTitan features require specific add-on subscriptions (e.g., Marketing Pro for lead attribution).
