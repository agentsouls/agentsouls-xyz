# TradeClaw — Housecall Pro Integration Guide

## Overview

Housecall Pro is a popular field service management platform for small to mid-size trades businesses. This integration enables TradeClaw to create jobs, manage schedules, and sync customer data with Housecall Pro.

**Tier:** Pro

---

## What This Integration Does

| Action | Direction | Description |
|---|---|---|
| Customer lookup | Agent → HCP | Search existing customers by phone or name |
| Job creation | Agent → HCP | Create new service jobs from qualified requests |
| Schedule check | Agent → HCP | View available appointment slots |
| Job status sync | HCP → Agent | Receive updates on job completion for review follow-up |
| Estimate creation | Agent → HCP | Create estimates for larger projects |

---

## Prerequisites

1. Housecall Pro account (Pro plan or higher for API access)
2. Housecall Pro API key
3. Composio OAuth connection (recommended — see `security/composio-setup.md`)

---

## Setup

### Step 1: Obtain API Key

1. Log into Housecall Pro
2. Navigate to Settings > Integrations > API
3. Generate an API key
4. Note: Housecall Pro uses bearer token authentication

### Step 2: Configure Environment

```bash
HOUSECALL_PRO_ENABLED=true
HOUSECALL_PRO_API_KEY=your-api-key
HOUSECALL_PRO_API_URL=https://api.housecallpro.com/v1
HOUSECALL_PRO_WEBHOOK_TOKEN=your-webhook-secret
```

### Step 3: Configure Webhooks

In Housecall Pro settings:
1. Navigate to Settings > Notifications > Webhooks
2. Add webhook URL: `https://your-domain.com/webhooks/housecallpro/job`
3. Select events: Job Created, Job Completed, Job Cancelled
4. Set authentication token

---

## Agent Capabilities

### Customer Lookup

```
Customer calls → Agent searches HCP by phone
→ GET /customers?phone=5551234567
→ Found: "Jane Doe, 456 Oak Ave, last service: Drain Cleaning"
→ Agent: "Hi Jane, I see we helped with a drain issue at Oak Ave. What's going on today?"
```

### Job Creation

```
Agent qualifies request → Creates job in HCP
→ POST /jobs
  {
    "customer_id": "abc123",
    "description": "Kitchen faucet leaking — customer reports steady drip",
    "scheduled_start": "2025-07-16T09:00:00",
    "scheduled_end": "2025-07-16T11:00:00",
    "tags": ["plumbing", "faucet", "leak"]
  }
→ Agent confirms appointment with customer
```

### Schedule Check

```
Agent: "Let me check what we have open..."
→ GET /schedule/available?date=2025-07-16&duration=120
→ Agent: "We can do Wednesday morning 9-11 or Thursday afternoon 1-3."
```

---

## API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/v1/customers` | GET | Customer search |
| `/v1/customers` | POST | Create customer |
| `/v1/jobs` | POST | Create job |
| `/v1/jobs/{id}` | GET | Job details |
| `/v1/estimates` | POST | Create estimate |
| `/v1/schedule/available` | GET | Check availability |

---

## Data Mapping

| TradeClaw Field | Housecall Pro Field |
|---|---|
| customer_name | customer.first_name + customer.last_name |
| phone | customer.mobile_number |
| service_address | customer.addresses[0] |
| issue_description | job.description |
| preferred_window | job.scheduled_start / scheduled_end |
| service_type | job.tags |

---

## Error Handling

Same principles as ServiceTitan: never lose the customer's information due to an API error. If Housecall Pro is unreachable, capture all details and queue for manual entry.

---

## Differences from ServiceTitan

| Feature | ServiceTitan | Housecall Pro |
|---|---|---|
| Dispatch board | Full real-time board | Basic schedule view |
| Membership tracking | Built-in memberships | Limited — use tags |
| API maturity | More endpoints, better docs | Simpler but less comprehensive |
| Webhook reliability | Good with HMAC | Basic bearer token |
| Price point | Higher (enterprise) | Lower (SMB-focused) |

Most small plumbing and HVAC shops use Housecall Pro. Larger operations tend toward ServiceTitan. The agent's behavior is the same regardless — only the API calls differ.
