# TradeClaw — AI Agent for Trades Service Businesses

## Skill Metadata (agentskills.io)

```yaml
name: TradeClaw
description: >
  AI agent for HVAC, plumbing, electrical, and general trades service businesses.
  Handles emergency classification and routing, quote request capture, appointment scheduling,
  service area verification, seasonal campaign triggers, maintenance plan upselling,
  and post-service review requests. Built for high-stakes environments where emergency
  detection accuracy is non-negotiable.
version: 1.0.0
author: ClawBuilt
license: proprietary
homepage: https://clawbuilt.ai/tradeclaw
tags:
  - hvac
  - plumbing
  - trades
  - emergency
  - dispatch
  - service
  - scheduling
  - maintenance
  - field-service
category: vertical-agent
harness_compatibility:
  - hermes-agent
  - nanoclaw
  - openclaw
tier: starter | pro | agency
```

## Capabilities

| Capability | Description | Tier |
|---|---|---|
| Emergency Classification | Detect and route emergencies (no heat, gas leak, flooding, CO, burst pipe, no AC in extreme heat) with immediate escalation | Starter |
| Quote Request Capture | Collect service details, photos, property info for accurate quoting | Starter |
| Service Area Verification | Validate customer zip codes against configured coverage zones | Starter |
| Appointment Scheduling | Coordinate available time slots and confirm bookings | Starter |
| Seasonal Campaigns | Trigger AC tune-up (spring/summer) and furnace check (fall/winter) promos automatically | Pro |
| Maintenance Plan Upsell | Identify upsell moments and present plan options naturally | Pro |
| Review Requests | Post-service follow-up to solicit Google/Yelp reviews | Pro |
| Multi-Platform Lead Capture | Ingest leads from Google LSA, Thumbtack, Angi, HomeAdvisor | Agency |
| ServiceTitan / Housecall Pro Sync | Two-way sync with field service management platforms | Pro / Agency |
| Dispatch Board Integration | Real-time technician availability and job assignment | Agency |

## Emergency Keywords (Critical)

The following phrases MUST trigger emergency routing. This list is non-exhaustive but covers the primary triggers:

- "no heat" / "heater not working" / "furnace won't turn on" (when outdoor temp < 40F)
- "gas smell" / "smell gas" / "gas leak"
- "flooding" / "water everywhere" / "burst pipe" / "pipe burst"
- "carbon monoxide" / "CO detector" / "CO alarm"
- "no AC" / "air conditioner not working" (when outdoor temp > 95F)
- "sewer backup" / "sewage"
- "no hot water" (with vulnerable occupants: elderly, infants)
- "electrical fire" / "sparking" / "burning smell from outlet"

## Knowledge Requirements

TradeClaw requires the following knowledge documents populated per-client:

1. `services.md` — Services offered with pricing ranges
2. `service-area.md` — Zip codes, coverage map, drive-time limits
3. `pricing.md` — Service call fees, common repair ranges, install ranges
4. `maintenance-plans.md` — Plan tiers, pricing, included services
5. `warranty-info.md` — Manufacturer warranties, labor guarantees
6. `emergency-protocols.md` — On-call rotation, escalation chain, response SLAs

## Integration Points

- **ServiceTitan** — Job creation, customer lookup, dispatch board (Starter+)
- **Housecall Pro** — Scheduling, invoicing, customer management (Pro)
- **Google Local Services Ads** — Lead ingestion, booking confirmation (Pro)
- **Thumbtack** — Lead capture, auto-response, qualification (Agency)
- **Composio** — OAuth broker for all third-party connections
- **Twilio / Vonage** — SMS/voice channel delivery
- **Google Business Profile** — Review solicitation

## Deployment

See `harness/` directory for harness-specific deployment guides:

- `harness/hermes/` — Hermes Agent (recommended default)
- `harness/nanoclaw/` — NanoClaw (Pro/Agency)
- `harness/openclaw/` — OpenClaw (deep integrations)
