# DentalClaw — Birdeye Integration Guide

Connect DentalClaw to Birdeye to trigger review requests after positive patient
interactions. The agent invites satisfied patients to leave a Google or Facebook
review through Birdeye's review generation platform.

---

## Overview

| Feature | Access Level | Notes |
|---------|-------------|-------|
| Generate review request link | Read | Personalized review URL |
| Send review request via Birdeye | Write | SMS/email review invitation |
| View review status | Read | Check if review was submitted |
| Respond to reviews | Not available | Office team handles responses |

---

## Prerequisites

- Active Birdeye account with the Reviews module enabled
- Birdeye API key (from Birdeye dashboard > Settings > API)
- Birdeye Business ID
- Review landing page URL configured in Birdeye

---

## Step 1: Obtain API Credentials

1. Log in to [Birdeye Dashboard](https://dashboard.birdeye.com/).
2. Navigate to **Settings > API & Integrations > API Keys**.
3. Generate a new API key with the following permissions:
   - `reviews:generate`
   - `contacts:read`
4. Note your **Business ID** from the dashboard URL or Settings page.

---

## Step 2: Configure Environment

```bash
# In .env
BIRDEYE_API_KEY=your-birdeye-api-key
BIRDEYE_BUSINESS_ID=your-business-id
REVIEW_LINK=https://birdeye.com/review/yourpractice
```

---

## Step 3: Configure DentalClaw

```yaml
tools:
  reviews:
    enabled: true
    provider: birdeye
    api_key: "${BIRDEYE_API_KEY}"
    business_id: "${BIRDEYE_BUSINESS_ID}"
    review_link: "${REVIEW_LINK}"
```

Add Birdeye to the network allowlist:

```yaml
security:
  sandbox:
    network:
      allowed_hosts:
        - "api.birdeye.com"
```

---

## Step 4: Review Request Trigger Rules

DentalClaw only sends review requests when ALL of the following are true:

1. **Positive interaction detected.** The patient expressed satisfaction,
   gratitude, or positive sentiment during the conversation.
2. **Not an escalation.** The conversation did not involve a complaint, clinical
   concern, or escalation to human staff.
3. **Not after-hours emergency.** Review requests are never sent during
   emergency or urgent interactions.
4. **Not a repeat.** The patient has not been asked for a review in the
   current conversation.
5. **Opt-in confirmed.** The agent asks if the patient would like to leave a
   review before sending the link. It does not send unsolicited review SMS/email.

### Trigger Flow

```
Patient says something positive (e.g., "Thank you so much!")
  │
  ├─ Was this an escalation or complaint? → YES → Do not request
  │
  ├─ Was this an emergency? → YES → Do not request
  │
  ├─ Already requested in this conversation? → YES → Do not request
  │
  └─ All clear → Offer review opportunity
       │
       ├─ Patient declines → "No problem at all! Have a great day."
       │
       └─ Patient accepts → Share review link (and optionally send via Birdeye)
```

---

## Step 5: Review Request Methods

### Method A: Share Link in Conversation (Default)

The agent simply shares the review link in the chat/SMS:

```
"We're so glad we could help! If you have a moment, the team would love a
review — it helps other patients find us. Here's the link: [Review Link].
No pressure at all!"
```

This requires no API call — just the `REVIEW_LINK` from `.env`.

### Method B: Trigger Birdeye Review Request (Optional)

For a more polished experience, DentalClaw can trigger Birdeye to send a
branded review request via SMS or email:

```bash
POST https://api.birdeye.com/resources/v1/review/invitation
Headers:
  Authorization: Bearer {BIRDEYE_API_KEY}
Body:
{
  "businessId": "{BIRDEYE_BUSINESS_ID}",
  "contact": {
    "firstName": "Jane",
    "lastName": "Doe",
    "phoneNumber": "+15551234567",
    "emailId": "jane@example.com"
  },
  "sendMethod": "sms",           # or "email" or "both"
  "templateId": "{optional}"     # Use default if not specified
}
```

**Important:** Only trigger this if the patient explicitly agrees to receive
the review request. This sends an actual SMS/email from Birdeye.

---

## Step 6: Agent Response Templates

### Offering a Review

```
"We're glad we could help! If you have a moment, the team would really
appreciate a review — it helps other patients find us. Would you like me
to send you a quick link?"
```

### After Patient Accepts

```
"Here's the link to leave a review: [Review Link]. Thank you so much for
choosing [Practice Name]! We appreciate you."
```

### Patient Declines

```
"No problem at all! We're just happy we could help. Have a wonderful day!"
```

### Already Asked (Do Not Repeat)

If the patient circles back positively later in the same conversation, do
not ask again.

---

## Step 7: Reporting

Birdeye provides review analytics in its dashboard. DentalClaw logs review
request events in the audit log:

```json
{
  "event": "review_request",
  "timestamp": "2026-03-15T14:30:00Z",
  "method": "link_shared",
  "patient_first_name": "Jane",
  "channel": "web_chat",
  "accepted": true
}
```

No patient contact information is stored in DentalClaw logs — only the event
metadata.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| API 401 | Verify `BIRDEYE_API_KEY` and permissions |
| SMS not delivered | Check phone number format (E.164: +1XXXXXXXXXX) |
| Wrong business | Verify `BIRDEYE_BUSINESS_ID` |
| Review link 404 | Confirm review page is active in Birdeye dashboard |
| Too many requests | Birdeye has rate limits — DentalClaw respects them |

---

## Best Practices

- **Timing:** Request reviews immediately after a positive interaction, not
  days later. Strike while the sentiment is warm.
- **Frequency:** Do not request reviews from the same patient more than once
  per month. Birdeye may enforce this at the platform level.
- **Channels:** SMS review requests have higher completion rates than email.
- **No incentives:** Do not offer discounts, gifts, or incentives for reviews.
  This violates Google and Birdeye policies.
- **Handle negative sentiment:** If a patient expresses dissatisfaction, never
  request a review. Escalate to the office manager instead.

---

*DentalClaw v1.0.0 — Birdeye Integration*
*ClawBuilt — https://clawbuilt.ai*
