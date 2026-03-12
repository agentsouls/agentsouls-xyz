# StyleClaw — Skill Manifest

> agentskills.io format v1.0

## Metadata

| Field       | Value                                              |
|-------------|----------------------------------------------------|
| name        | StyleClaw                                          |
| version     | 1.0.0                                              |
| author      | ClawBuilt                                          |
| license     | Proprietary — ClawBuilt Commercial License         |
| homepage    | https://clawbuilt.ai/verticals/style               |
| repository  | https://github.com/clawbuilt-ai/styleclaw          |
| updated     | 2026-03-11                                         |

## Description

StyleClaw is an AI agent skill pack designed for salons, barbershops, and beauty studios. It enables automated client engagement across web chat, SMS, Instagram DMs, and voice channels. StyleClaw handles appointment inquiries, service menu navigation, stylist matching, product recommendations, waitlist capture, and promotional campaigns — all while maintaining the unique brand voice of each establishment.

## Tags

```yaml
tags:
  - salon
  - barbershop
  - beauty
  - booking
  - styling
  - retail
  - appointments
  - client-engagement
  - wellness
```

## Capabilities

### Core Capabilities

| Capability              | Description                                                                                      |
|-------------------------|--------------------------------------------------------------------------------------------------|
| Booking Assistance      | Guide clients through available services, answer scheduling questions, redirect to booking platform |
| Service Menu            | Present services with descriptions, pricing tiers, durations, and add-on options                 |
| Stylist Bios            | Share stylist/barber profiles, specialties, certifications, and portfolio highlights              |
| Product Recommendations | Suggest retail products based on service type, hair/skin type, or client preferences             |
| Waitlist Capture        | Collect client info for cancellation openings and preferred time slots                           |
| Pricing Transparency    | Answer pricing questions including tier breakdowns, package deals, and membership options         |

### Extended Capabilities

| Capability              | Description                                                                                      |
|-------------------------|--------------------------------------------------------------------------------------------------|
| Promotions & Offers     | Share current deals, seasonal specials, referral programs, and loyalty rewards                    |
| New Client Onboarding   | Walk first-time clients through what to expect, consultation process, and preparation tips        |
| Aftercare Guidance      | Provide post-service care instructions for treatments, color, extensions, etc.                    |
| FAQ Resolution          | Handle common questions about policies, parking, accessibility, payment methods                   |
| Review Nudge            | Gently encourage satisfied clients to leave reviews on Google or Yelp after service               |
| Appointment Reminders   | Send proactive reminders via SMS/chat at configurable intervals before appointments               |

## Supported Channels

| Channel        | Harness       | Status       |
|----------------|---------------|--------------|
| Web Chat       | Hermes Agent  | Production   |
| SMS (Twilio)   | Hermes Agent  | Production   |
| Instagram DM   | OpenClaw      | Production   |
| Voice (Vapi)   | NanoClaw      | Beta         |
| WhatsApp       | Hermes Agent  | Planned      |
| Facebook MSG   | OpenClaw      | Planned      |

## Supported Integrations

| Platform             | Tier     | Method              |
|----------------------|----------|---------------------|
| Vagaro               | Starter  | API + Composio      |
| Square Appointments  | Pro      | API + Composio      |
| Booksy               | Pro      | API + Composio      |
| Boulevard            | Agency   | API + Composio      |
| Instagram Graph API  | Pro      | OpenClaw native     |
| Google Business      | Starter  | API                 |
| Stripe               | All      | Payment links only  |

## Tier Availability

| Feature                    | Starter ($497) | Pro ($997) | Agency ($1,497) |
|----------------------------|:--------------:|:----------:|:---------------:|
| Web chat agent             | Yes            | Yes        | Yes             |
| Service menu + pricing     | Yes            | Yes        | Yes             |
| Stylist bios               | Yes            | Yes        | Yes             |
| Product recommendations    | Yes            | Yes        | Yes             |
| Waitlist capture           | Yes            | Yes        | Yes             |
| SMS channel                | —              | Yes        | Yes             |
| Instagram DM               | —              | Yes        | Yes             |
| Appointment reminders      | —              | Yes        | Yes             |
| Multi-location support     | —              | —          | Yes             |
| Custom persona tuning      | —              | —          | Yes             |
| Voice agent (Vapi)         | —              | —          | Yes             |
| White-label branding       | —              | —          | Yes             |
| Boulevard integration      | —              | —          | Yes             |
| Dedicated onboarding call  | —              | —          | Yes             |

## Runtime Requirements

- **LLM**: anthropic/claude-haiku-4-5-20251001 (via OpenRouter) for standard queries; claude-sonnet for complex routing
- **Memory**: Persistent conversation context with 90-day client interaction retention
- **Sandbox**: Docker container (Hermes) or edge function (NanoClaw)
- **Secrets**: Composio OAuth tokens, booking platform API keys, Twilio credentials (if SMS enabled)

## File Structure

```
configs/style/
├── skills/
│   ├── SKILL.md              # This manifest
│   ├── system_prompt.md      # Agent system prompt
│   └── persona.md            # Brand voice configuration
├── harness/
│   ├── hermes/               # Hermes Agent configs
│   ├── nanoclaw/             # NanoClaw configs
│   └── openclaw/             # OpenClaw configs
├── integrations/             # Booking platform guides
├── security/                 # Hardening & OAuth setup
├── knowledge/
│   └── scaffold/             # Knowledge base templates
├── .env.example              # Environment template
└── SETUP.md                  # Quick-start guide
```
