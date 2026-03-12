# TradeClaw — Thumbtack Lead Integration Guide

## Overview

Thumbtack is a lead generation marketplace for home services. Homeowners post project requests and pros respond with quotes. TradeClaw automates the response to Thumbtack leads, qualifying them quickly and moving viable leads to scheduling.

**Tier:** Agency

---

## What This Integration Does

| Action | Description |
|---|---|
| Lead ingestion | Receive Thumbtack leads via webhook |
| Auto-qualification | Classify lead, verify service area, check service match |
| Auto-response | Send initial response within 60 seconds |
| Quote range delivery | Provide pricing range based on knowledge base |
| Follow-up | Automated follow-up if lead does not respond within 2 hours |
| Lead decline | Auto-decline leads outside service area or outside scope |

---

## Prerequisites

1. Thumbtack Pro account with API access
2. Thumbtack Partner API credentials
3. Composio OAuth connection (recommended)

---

## Setup

### Step 1: API Access

Contact Thumbtack's partner team to get API access. You need:
- API key
- Webhook endpoint configuration
- Account ID

### Step 2: Configure Environment

```bash
THUMBTACK_ENABLED=true
THUMBTACK_API_KEY=your-api-key
THUMBTACK_ACCOUNT_ID=your-account-id
THUMBTACK_WEBHOOK_TOKEN=your-webhook-secret
THUMBTACK_AUTO_RESPOND=true
THUMBTACK_AUTO_DECLINE_OUT_OF_AREA=true
```

### Step 3: Configure Webhook

Register webhook URL: `https://your-domain.com/webhooks/thumbtack/lead`

---

## Lead Processing Flow

```
1. Thumbtack lead arrives via webhook
2. Agent extracts: service type, zip code, project details, customer info
3. Service area check:
   - In area → Continue
   - Out of area → Auto-decline (saves the Thumbtack credit)
4. Service match check:
   - Service offered → Continue
   - Service not offered → Auto-decline
5. Emergency check (rare on Thumbtack, but possible)
6. Generate response with pricing range and availability
7. Send via Thumbtack messaging API
8. If no response in 2 hours → Follow-up message
9. If no response in 24 hours → Close lead
```

---

## Auto-Response Template

```
Hi {{CUSTOMER_NAME}}, thanks for your {{SERVICE_TYPE}} request on Thumbtack!

Based on what you described, a typical {{SERVICE_TYPE}} ranges from ${{LOW}} to ${{HIGH}},
depending on the specifics. We'd need to take a look to give you an exact price.

We have availability {{NEXT_AVAILABLE}}. Want to set up a time?

— {{COMPANY_NAME}} | {{COMPANY_PHONE}}
```

---

## Cost Management

Thumbtack charges per lead (typically $15-$60+ depending on trade and market). Auto-declining bad leads saves money:

- **Out-of-area leads:** Auto-decline immediately (no charge if declined fast enough on some plans)
- **Wrong service leads:** Auto-decline
- **Spam/duplicate leads:** Flag and decline
- **Budget limit:** Set a daily lead budget to prevent overspend

```bash
THUMBTACK_DAILY_LEAD_BUDGET=20  # Max leads to accept per day
THUMBTACK_AUTO_DECLINE_UNMATCHED=true
```

---

## Data Mapping

| Thumbtack Field | TradeClaw Field |
|---|---|
| request.customer.name | customer_name |
| request.customer.phone | phone |
| request.location.zipCode | zip_code |
| request.category | service_type |
| request.details | issue_description |
| request.schedule | preferred_window |

---

## Monitoring

- **Lead response time** — Target: < 60 seconds
- **Lead acceptance rate** — What % of leads are in-area and serviceable?
- **Cost per lead** — Track Thumbtack spend vs booked jobs
- **Conversion rate** — Target: 20-30% for Thumbtack leads (lower intent than LSA)
- **Auto-decline rate** — If too high, review Thumbtack targeting settings

---

## Gotchas

- Thumbtack leads are lower intent than Google LSA. Expect lower conversion rates.
- Response speed still matters — first responder advantage is real.
- Thumbtack's pricing model changes frequently. Monitor cost-per-lead trends.
- Some customers on Thumbtack are price shopping aggressively. The agent should lead with value, not just price.
- Thumbtack reviews matter for ranking. Include review solicitation in the post-service flow.
