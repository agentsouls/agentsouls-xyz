# TradeClaw — Google Local Services Ads Integration Guide

## Overview

Google Local Services Ads (LSA) generate high-intent leads for trades businesses. When a homeowner searches "plumber near me" or "AC repair" and clicks a Google Guaranteed ad, the lead comes directly to the business. TradeClaw auto-responds to these leads to maximize conversion.

**Tier:** Pro

**Why this matters:** LSA leads are expensive ($25-$75+ per lead depending on trade and market). Response speed directly correlates with conversion rate. Businesses that respond within 5 minutes convert 3-5x better than those that respond in 30+ minutes. TradeClaw responds in under 60 seconds.

---

## What This Integration Does

| Action | Description |
|---|---|
| Lead ingestion | Receive new leads via webhook or API polling |
| Auto-response | Respond to leads within 60 seconds via SMS or the LSA messaging platform |
| Lead qualification | Classify as emergency or standard, verify service area, capture details |
| Booking conversion | Move qualified leads to appointment scheduling |
| Lead status update | Mark leads as booked, not serviceable, or disputed in Google LSA |

---

## Prerequisites

1. Active Google Local Services Ads account (Google Guaranteed or Google Screened)
2. Google LSA API access (requires application through Google)
3. Verified business profile
4. Connected phone number (Twilio number or call forwarding)

---

## Setup

### Option A: Webhook-Based (Preferred)

Some Google LSA management platforms support webhooks for new leads. If your client uses a platform like:
- **Hatch** — Supports webhooks
- **Callrail** — Supports webhooks
- **Custom LSA API integration**

Configure the webhook to: `https://your-domain.com/webhooks/google-lsa/lead`

### Option B: API Polling

If webhooks are not available, poll the Google LSA API:

```bash
GOOGLE_LSA_ENABLED=true
GOOGLE_LSA_POLL_INTERVAL=60  # seconds
GOOGLE_LSA_ACCOUNT_ID=your-account-id
GOOGLE_LSA_API_KEY=your-api-key
```

The agent polls every 60 seconds for new leads. This introduces up to 60 seconds of latency, which is still within the competitive window.

### Option C: Email-to-Webhook Bridge

Google LSA sends lead notifications via email. Use a service like Zapier or Make to parse the email and forward as a webhook:

```
Google LSA Email → Gmail → Zapier → Webhook → TradeClaw
```

This is the simplest setup but adds 1-3 minutes of latency.

---

## Lead Processing Flow

```
1. Lead arrives (webhook/poll/email bridge)
2. Agent classifies: EMERGENCY or STANDARD
3. Agent verifies zip code against service area
4. If emergency → Emergency protocol (immediate escalation)
5. If standard + in service area → Auto-respond with:
   - Acknowledgment: "Thanks for reaching out to {COMPANY_NAME}!"
   - Qualification question: confirm the service needed
   - Scheduling offer: "We can get someone out as early as [next available]"
6. If out of service area → Polite decline with referral offer
7. Agent creates service request in CRM (ServiceTitan/Housecall Pro)
8. Follow up if no response within 2 hours
```

---

## Auto-Response Templates

### Standard Lead Response (SMS)

```
Hi {{CUSTOMER_NAME}}, this is {{COMPANY_NAME}}. We got your request for {{SERVICE_TYPE}}.

We have availability {{NEXT_AVAILABLE}}. Would that work for you?

Our diagnostic fee is ${{DIAGNOSTIC_FEE}}, applied toward the repair if you go with us.

Reply or call us at {{COMPANY_PHONE}}.
```

### Emergency Lead Response (SMS)

```
{{CUSTOMER_NAME}}, this is {{COMPANY_NAME}}. That sounds like it needs immediate attention.

Our on-call technician will call you at {{CUSTOMER_PHONE}} within {{EMERGENCY_CALLBACK_SLA}} minutes.

If you smell gas or feel unsafe, please leave the building and call 911.
```

---

## Lead Attribution

Track LSA lead performance:

- **Source tag:** All leads from LSA are tagged `source:google_lsa`
- **Cost tracking:** If the client shares cost-per-lead data, track ROI per lead
- **Conversion tracking:** Mark leads as converted when a job is booked
- **Dispute tracking:** If a lead is invalid (wrong area, spam), dispute it in Google LSA for credit

---

## Configuration

```bash
GOOGLE_LSA_ENABLED=true
GOOGLE_LSA_ACCOUNT_ID=your-lsa-account-id
GOOGLE_LSA_API_KEY=your-api-key
GOOGLE_LSA_RESPONSE_CHANNEL=sms  # sms or lsa_messaging
GOOGLE_LSA_AUTO_RESPOND=true
GOOGLE_LSA_MAX_RESPONSE_TIME_SECONDS=300
```

---

## Monitoring

Track these metrics:
- **Lead response time** — Target: < 60 seconds. Alert if > 300 seconds.
- **Lead qualification rate** — What % of leads are serviceable and in-area?
- **Lead-to-booking conversion rate** — Target: 40%+ for LSA leads (they are high intent).
- **Cost per booked job** — Track against the client's target CAC.

---

## Gotchas

- Google LSA leads include the customer's phone number. Always call/text that number, not the Google forwarding number.
- Lead volume spikes during extreme weather events (heatwaves, cold snaps). Ensure the agent can handle burst traffic.
- Google LSA has a "message" feature where customers can chat. If enabled, the agent should monitor that channel too.
- Disputed leads must be submitted within 30 days. Track and flag disputable leads (wrong service, wrong area, spam).
