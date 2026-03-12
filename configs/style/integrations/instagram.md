# StyleClaw — Instagram DM Integration Guide

> **Tier:** Pro ($997) and above
> **Harness:** OpenClaw (required)
> **Integration type:** Meta Graph API / Instagram Messaging API

---

## Overview

Instagram is the number-one discovery platform for salons and barbershops. Potential clients find you through posts, Reels, and stories — then DM you to ask about services, pricing, and booking. This integration turns your Instagram DMs into an automated client engagement channel powered by StyleClaw.

**What this integration enables:**
- Auto-respond to Instagram DMs with your StyleClaw agent
- Answer service, pricing, and availability questions 24/7
- Share booking links and redirect clients to schedule
- Handle inspiration photo messages ("I want this look")
- Auto-respond to story mentions with a thank-you message
- Capture leads from DM conversations

**What this integration does NOT do:**
- Post content to your feed or stories
- Respond to comments on posts
- Access follower analytics
- Process payments

---

## Why OpenClaw?

Instagram DM integration requires the OpenClaw harness specifically because:

1. **Webhook architecture** — Instagram sends DMs via webhooks to a public HTTPS endpoint. OpenClaw is built for this pattern.
2. **Meta API compliance** — OpenClaw handles signature verification, token management, and rate limiting required by Meta's platform policies.
3. **Social-native persona** — OpenClaw includes DM-specific persona adjustments (shorter messages, emoji support, photo handling).

If you're running Hermes for web chat/SMS, you'll run OpenClaw alongside it for Instagram.

---

## Architecture

```
Client sends DM on Instagram
        │
        ▼
Meta Graph API (webhook)
        │
        ▼
OpenClaw (your server)
   ├─ Validates webhook signature
   ├─ Extracts message content
   ├─ Checks rate limits & spam
   ├─ Routes to Claude via OpenRouter
   ├─ Generates response with salon persona
   └─ Sends reply via Graph API
        │
        ▼
Client receives DM reply
```

---

## Setup

### Step 1: Instagram Business Account

Your Instagram account must be a **Business** or **Creator** account connected to a Facebook Page.

1. Open Instagram > Settings > Account > Switch to Professional Account
2. Choose **Business**
3. Connect to your Facebook Page (create one if needed)

### Step 2: Meta Developer App

Follow the detailed steps in the OpenClaw deployment guide (`harness/openclaw/DEPLOY.md`), specifically:

- Create a Meta App
- Add Instagram Messaging product
- Generate Page Access Token
- Get Instagram Business Account ID
- Configure webhook endpoint

### Step 3: Deploy OpenClaw

See `harness/openclaw/DEPLOY.md` for full deployment instructions. The key Instagram-specific config is in `openclaw.yaml`:

```yaml
channels:
  instagram:
    enabled: true
    credentials:
      app_id: "${INSTAGRAM_APP_ID}"
      app_secret: "${INSTAGRAM_APP_SECRET}"
      page_access_token: "${INSTAGRAM_PAGE_ACCESS_TOKEN}"
      instagram_business_account_id: "${INSTAGRAM_BUSINESS_ACCOUNT_ID}"
    webhook:
      verify_token: "${INSTAGRAM_WEBHOOK_VERIFY_TOKEN}"
      endpoint: "/webhooks/instagram"
```

### Step 4: Set Up Webhook

1. In Meta App Dashboard > Messenger > Settings > Webhooks
2. **Callback URL:** `https://your-openclaw-domain.com/webhooks/instagram`
3. **Verify Token:** Your `INSTAGRAM_WEBHOOK_VERIFY_TOKEN` value
4. Subscribe to: `messages`, `messaging_postbacks`

### Step 5: Test

Send a DM to your salon's Instagram account from a different account. Verify the agent responds.

---

## DM Behavior Configuration

### Active Hours

Configure when the agent auto-responds vs. sends an away message:

```yaml
active_hours:
  timezone: "America/Chicago"
  start: "08:00"
  end: "21:00"
away_message: |
  Thanks for reaching out! We're currently away but will get back
  to you during business hours. For immediate help, call us at
  (555) 123-4567 or book online at yoursalon.vagaro.com
```

### Response Delay

A small delay makes the response feel more natural (not robotic):

```yaml
reply_delay_seconds: 3  # Wait 3 seconds before responding
```

### Conversation Limits

Prevent excessively long DM threads:

```yaml
max_dm_turns: 15  # After 15 messages, suggest phone/email
```

After the limit: "I want to make sure you get exactly what you need! For anything more, our team is available at (555) 123-4567 or hello@yoursalon.com"

---

## Handling Photos

Clients frequently send inspiration photos via DM. The agent handles these gracefully:

```yaml
content:
  accept_images: true
  image_response: |
    Love this inspo! I'll note this for your stylist. When you book,
    mention you shared a reference photo in DMs and they'll pull it up.
```

**Important:** StyleClaw does not analyze image content (no vision model calls for DMs). The agent acknowledges the photo and encourages the client to reference it at their appointment.

For Agency tier, you can enable vision analysis:

```yaml
content:
  accept_images: true
  vision_analysis:
    enabled: true   # Agency only
    model: "anthropic/claude-haiku-4-5-20251001"
    prompt: "Describe this hairstyle inspiration photo briefly — color, length, style, and any notable details."
```

---

## Quick Replies

Instagram supports interactive quick reply buttons. These appear as tappable options below the agent's message:

```yaml
quick_replies:
  enabled: true
  default_options:
    - title: "Book Now"
      payload: "BOOK_NOW"
    - title: "Services & Pricing"
      payload: "VIEW_SERVICES"
    - title: "Talk to a Human"
      payload: "HUMAN_ESCALATION"
```

Quick replies improve engagement and reduce friction — clients tap instead of typing.

---

## Story Mention Auto-Reply

When someone mentions your salon in their Instagram story, the agent can auto-reply via DM:

```yaml
story_mentions:
  enabled: true
  auto_reply: true
  reply_template: |
    Thanks for the shoutout! We love seeing our work out in the world.
    Hope you're loving your look!
```

This turns social engagement into a conversation starter. The client can then ask questions, and the agent handles it from there.

---

## Lead Capture

DM conversations are a rich source of leads. Configure lead capture for clients who express booking intent but don't follow through:

```yaml
lead_capture:
  enabled: true
  trigger_intents:
    - "booking_request"
    - "service_inquiry"
    - "pricing"
  # If a booking-intent conversation ends without a booking link click,
  # flag the conversation for follow-up
  follow_up:
    enabled: true
    delay_hours: 24
    message: |
      Hey! Just following up — were you still interested in booking
      that [service]? Happy to help if you have any more questions!
    max_follow_ups: 1  # Only one follow-up per conversation
```

---

## Compliance & Best Practices

### Meta Platform Policies

1. **Response window:** You have 24 hours to respond to a DM after the client's last message. After 24 hours, you can only send messages if the client initiates again.
2. **No promotional spam:** Don't send unsolicited promotional messages via DM. The agent should only respond to incoming messages.
3. **Opt-out:** If a client says "stop" or "unsubscribe," the agent must stop responding.
4. **Transparency:** The agent should not pretend to be human. If asked directly, it should acknowledge being an AI assistant.

### Privacy

- Never collect sensitive PII over Instagram DMs (phone, email, address)
- Redirect to booking link for all data collection
- DM conversations may be screenshotted — the agent should never say anything you wouldn't want shared publicly
- Mask Instagram user IDs in logs

### Content Safety

- The agent should not engage with inappropriate or harassing messages
- Block patterns are configured in `openclaw.yaml` under `spam_detection`
- For persistent harassment, the agent should stop responding and the salon should handle via Instagram's built-in blocking tools

---

## Metrics to Track

| Metric                    | What It Tells You                                      |
|---------------------------|--------------------------------------------------------|
| DMs received per day      | Demand for DM-based engagement                         |
| Response rate             | Are all DMs getting answered?                          |
| Avg response time         | How fast the agent replies                             |
| Booking link click-through| Are DMs converting to bookings?                        |
| Escalation rate           | How often clients need a human                         |
| Conversation length       | Are queries being resolved efficiently?                |
| Story mention volume      | Social engagement health                               |

---

## Troubleshooting

| Issue                                | Solution                                                      |
|--------------------------------------|---------------------------------------------------------------|
| Agent not responding to DMs          | Check webhook config; verify Page Access Token; check logs    |
| "Message failed to send" errors      | Token may be expired; check 24-hour response window           |
| Agent responding to wrong account    | Verify `INSTAGRAM_BUSINESS_ACCOUNT_ID` is correct             |
| Photos not acknowledged              | Check `accept_images: true` in config                         |
| Quick replies not showing            | Ensure client is on updated Instagram app                     |
| Story mention replies not working    | Check `story_mentions.enabled: true`; verify webhook fields   |
| Duplicate responses                  | Enable dedup in rate limiting config                          |
| Agent responding too formally for IG | Adjust persona formality/playfulness; check social overrides  |
