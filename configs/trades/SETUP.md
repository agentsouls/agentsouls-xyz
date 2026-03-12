# TradeClaw — Quick-Start Setup Guide

## What is TradeClaw?

TradeClaw is an AI virtual dispatcher for HVAC, plumbing, electrical, and trades service businesses. It handles:

- **Emergency detection and routing** — Gas leaks, flooding, no heat, CO alarms get escalated immediately to your on-call tech
- **Service request capture** — Collects customer info, verifies service area, captures the issue
- **Quote responses** — Provides pricing ranges from your rate sheet
- **Appointment scheduling** — Checks availability and books service calls
- **Seasonal campaigns** — Automated AC tune-up and furnace check promotions
- **Maintenance plan upsells** — Natural, non-pushy plan mentions at the right moments
- **Review requests** — Post-service follow-up for Google reviews
- **Multi-platform lead capture** — Google LSA, Thumbtack, SMS, web chat, voice

---

## Choose Your Tier

| Feature | Starter ($497) | Pro ($997) | Agency ($1,497) |
|---|---|---|---|
| Emergency classification + routing | Yes | Yes | Yes |
| SMS channel (Twilio) | Yes | Yes | Yes |
| Web chat widget | Yes | Yes | Yes |
| ServiceTitan integration (read-only) | Yes | Read-write | Full two-way sync |
| Housecall Pro integration | - | Yes | Yes |
| Google LSA auto-response | - | Yes | Yes |
| Thumbtack lead capture | - | - | Yes |
| Seasonal campaigns | Manual | Automated | Automated |
| Voice AI | - | Yes | Yes |
| Multi-location support | - | - | Yes |
| Harness options | Hermes | Hermes, NanoClaw | All (Hermes, NanoClaw, OpenClaw) |

---

## Choose Your Harness

| Harness | Best For | Complexity | Infrastructure |
|---|---|---|---|
| **Hermes Agent** (recommended) | Most deployments | Medium | Docker, Redis, Qdrant |
| **NanoClaw** | Fast setup, minimal infra | Low | Just an API server |
| **OpenClaw** | Deep integrations, webhooks | High | Docker, Redis, Qdrant, PostgreSQL |

**If you're not sure, use Hermes.**

---

## Quick Start (30 Minutes)

### 1. Clone and Configure (5 min)

```bash
git clone https://github.com/clawbuilt/tradeclaw.git
cd tradeclaw
cp configs/trades/.env.example .env
```

Open `.env` and fill in:
- `ANTHROPIC_API_KEY` — Get from console.anthropic.com
- `COMPANY_NAME` — The client's business name
- `COMPANY_PHONE` — Main phone number
- `EMERGENCY_PHONE` — After-hours emergency line
- `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` — From twilio.com/console
- `TWILIO_PHONE_NUMBER` — The Twilio number for SMS

### 2. Populate Knowledge Base (15 min)

```bash
cp -r configs/trades/knowledge/scaffold/ knowledge/client/
```

Fill in these files with the client's actual data:

| File | What to fill in | Time |
|---|---|---|
| `services.md` | Services offered, descriptions, price ranges | 5 min |
| `service-area.md` | Every zip code they serve | 3 min |
| `pricing.md` | Diagnostic fee, repair ranges, install ranges | 3 min |
| `maintenance-plans.md` | Plan tiers, pricing, included services | 2 min |
| `warranty-info.md` | Labor warranty terms, brands serviced | 1 min |
| `emergency-protocols.md` | On-call rotation, escalation contacts | 1 min |

**The service area and emergency protocols are the most critical.** Get these right.

### 3. Deploy (5 min)

#### Hermes (recommended):
```bash
docker compose -f docker-compose.hermes.yml up -d
docker exec tradeclaw-agent python scripts/ingest_knowledge.py --source knowledge/client/
```

#### NanoClaw (lightweight):
```bash
pip install anthropic twilio flask
python app.py
```

### 4. Connect Twilio (3 min)

1. Go to twilio.com/console > Phone Numbers > your number
2. Set SMS webhook: `https://your-domain.com/webhooks/twilio/sms` (POST)
3. Save

### 5. Test (2 min)

Send these test messages to the Twilio number:

```
"I smell gas in my kitchen"
→ Should trigger emergency response + escalation

"I need a quote for AC repair"
→ Should respond with pricing range from knowledge base

"Do you service 75001?"
→ Should check service area and confirm or decline
```

---

## Post-Launch Checklist

- [ ] Emergency classification tested with all trigger phrases
- [ ] On-call tech confirmed they receive escalation alerts
- [ ] Service area zip codes verified (no missing zips)
- [ ] Pricing ranges reviewed and approved by client
- [ ] Client's website has chat widget installed (if applicable)
- [ ] Seasonal campaign templates reviewed
- [ ] Review link tested and working
- [ ] Monitoring/alerting configured

---

## File Structure

```
configs/trades/
├── SETUP.md                          ← You are here
├── .env.example                      ← Environment template
├── skills/
│   ├── SKILL.md                      ← Agent skill definition
│   ├── system_prompt.md              ← Core system prompt (emergency classification lives here)
│   └── persona.md                    ← Brand voice guide
├── harness/
│   ├── hermes/
│   │   ├── hermes-config.yaml        ← Hermes Agent config
│   │   ├── memory-config.yaml        ← Memory/retention config
│   │   └── DEPLOY.md                 ← Hermes deployment guide
│   ├── nanoclaw/
│   │   ├── CLAUDE.md                 ← NanoClaw Claude config
│   │   └── DEPLOY.md                 ← NanoClaw deployment guide
│   └── openclaw/
│       ├── openclaw.yaml             ← OpenClaw config
│       ├── routing.yaml              ← Model routing config
│       └── DEPLOY.md                 ← OpenClaw deployment guide
├── integrations/
│   ├── servicetitan.md               ← ServiceTitan setup
│   ├── housecall-pro.md              ← Housecall Pro setup
│   ├── google-lsa.md                 ← Google LSA setup
│   └── thumbtack.md                  ← Thumbtack setup
├── security/
│   ├── hardening-checklist.md        ← Security checklist (complete before go-live)
│   └── composio-setup.md             ← Composio OAuth broker setup
└── knowledge/
    └── scaffold/
        ├── services.md               ← Template: services offered
        ├── service-area.md           ← Template: zip codes and coverage
        ├── pricing.md                ← Template: pricing ranges
        ├── maintenance-plans.md      ← Template: service plan details
        ├── warranty-info.md          ← Template: warranty info
        └── emergency-protocols.md    ← Template: emergency procedures
```

---

## Support

- Documentation: All files in this directory
- Issues: github.com/clawbuilt/tradeclaw/issues
- Email: support@clawbuilt.ai

---

## The One Thing That Matters Most

Emergency classification. If the agent correctly detects "I smell gas" as an emergency and routes it to the on-call tech in under a minute, you've delivered massive value. Everything else is gravy.

Test it. Test it again. Then test it one more time.
