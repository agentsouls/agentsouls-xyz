# StyleClaw — Quick-Start Setup Guide

> Get your salon's AI assistant running in under an hour.

---

## What is StyleClaw?

StyleClaw is an AI-powered virtual assistant for salons and barbershops. It handles client questions about services, pricing, stylist availability, product recommendations, and booking — across web chat, SMS, Instagram DMs, and voice.

**Tiers:**

| Tier            | Price   | Channels                        | Key Features                          |
|-----------------|---------|----------------------------------|---------------------------------------|
| Starter         | $497    | Web chat                         | Service menu, pricing, stylist bios, waitlist, product recs |
| Pro             | $997    | Web chat + SMS + Instagram DM    | + Appointment reminders, Square/Booksy integration |
| Agency          | $1,497  | All channels + Voice             | + Multi-location, custom persona, Boulevard, Vapi voice |

---

## Quick-Start (30-60 Minutes)

### Step 1: Choose Your Harness

| Your Goal                        | Harness        | Config Directory         |
|----------------------------------|----------------|--------------------------|
| Web chat + SMS                   | Hermes Agent   | `harness/hermes/`        |
| Instagram DM                    | OpenClaw       | `harness/openclaw/`      |
| Voice agent                     | NanoClaw       | `harness/nanoclaw/`      |
| Web chat + SMS + Instagram DM   | Hermes + OpenClaw (both) | Both directories |

Most salons start with **Hermes Agent** for web chat.

### Step 2: Set Up Environment

```bash
# Navigate to the StyleClaw config directory
cd configs/style/

# Copy the environment template
cp .env.example .env

# Open .env and fill in your salon's details
# At minimum, you need:
# - OPENROUTER_API_KEY
# - SALON_NAME, SALON_PHONE, BOOKING_URL
# - BOOKING_PLATFORM and BOOKING_LOCATION_ID
```

**Get an OpenRouter API key:** https://openrouter.ai/keys (takes 2 minutes)

### Step 3: Fill Out Your Knowledge Base

This is the most important step. Copy the scaffold templates and fill them with your real data:

```bash
mkdir -p data/knowledge
cp knowledge/scaffold/*.md data/knowledge/
```

**Edit each file:**

| File                 | What to Fill In                                         | Time Estimate |
|----------------------|---------------------------------------------------------|---------------|
| `services.md`        | Every service, price, duration, description             | 15-20 min     |
| `team.md`            | Every stylist/barber bio, specialties, availability     | 10-15 min     |
| `policies.md`        | Cancellation, no-show, late, payment policies           | 10 min        |
| `products.md`        | Retail product lines and items you carry                | 10-15 min     |
| `parking-access.md`  | Address, parking, directions, accessibility             | 5 min         |

**Tip:** The more detailed your knowledge base, the better the agent performs. If a service isn't listed, the agent can't talk about it. If a price is wrong, the agent will give wrong prices.

### Step 4: Choose Your Persona

Edit the persona section in your harness config:

**Luxury salon?**
```yaml
persona:
  preset: "luxury_salon_concierge"
  calibration:
    formality: 4
    warmth: 4
    verbosity: 3
    playfulness: 2
```

**Barbershop?**
```yaml
persona:
  preset: "neighborhood_barbershop_host"
  calibration:
    formality: 2
    warmth: 5
    verbosity: 2
    playfulness: 4
```

See `skills/persona.md` for more presets and customization options.

### Step 5: Deploy

Follow the deployment guide for your chosen harness:

| Harness        | Guide                           |
|----------------|---------------------------------|
| Hermes Agent   | `harness/hermes/DEPLOY.md`      |
| OpenClaw       | `harness/openclaw/DEPLOY.md`    |
| NanoClaw       | `harness/nanoclaw/DEPLOY.md`    |

**Quickest path (Hermes):**

```bash
# Build and start
docker compose build
docker compose up -d

# Verify
curl http://localhost:3100/health
```

### Step 6: Test

Before going live, test these scenarios:

| Test                              | What to Check                                  |
|-----------------------------------|------------------------------------------------|
| "Hi"                              | Agent greets with salon name and persona voice |
| "How much is a haircut?"          | Correct price from knowledge base               |
| "I want to book"                  | Shares booking link, doesn't try to book        |
| "Who should I see for balayage?"  | Recommends correct stylist(s)                    |
| "What products do you recommend?" | Asks clarifying questions, then recommends       |
| "I'm not happy with my service"   | Empathizes and escalates to human               |
| "What's your cancellation policy?"| Correct policy from knowledge base               |
| "Where do I park?"                | Correct parking info                             |

### Step 7: Embed the Widget

Add to your salon's website (before `</body>`):

```html
<script
  src="https://your-domain.com:3100/widget.js"
  data-agent-id="styleclaw"
  data-primary-color="#2D2D2D"
  async>
</script>
```

### Step 8: Security Check

Before going live, run through the hardening checklist:

```bash
cat security/hardening-checklist.md
```

At minimum:
- [ ] `.env` is in `.gitignore`
- [ ] `.env` permissions set to 600
- [ ] HTTPS enabled
- [ ] PII masking enabled
- [ ] LLM budget cap set

---

## Adding Channels

### Add SMS (Pro)

1. Get a Twilio account and phone number
2. Add credentials to `.env`
3. Set `SMS_ENABLED=true`
4. Configure Twilio webhook
5. See `harness/hermes/DEPLOY.md` Step 6

### Add Instagram DM (Pro)

1. Deploy OpenClaw alongside Hermes
2. Set up Meta developer app
3. Configure Instagram webhook
4. See `harness/openclaw/DEPLOY.md` and `integrations/instagram.md`

### Add Voice (Agency)

1. Set up Vapi account
2. Deploy NanoClaw
3. Configure phone number
4. See `harness/nanoclaw/DEPLOY.md`

---

## Connecting Your Booking Platform

| Platform    | Tier     | Guide                                  |
|-------------|----------|----------------------------------------|
| Vagaro      | Starter  | `integrations/vagaro.md`               |
| Square      | Pro      | `integrations/square-appointments.md`  |
| Booksy      | Pro      | `integrations/booksy.md`              |
| Boulevard   | Agency   | `integrations/boulevard.md`            |

We recommend using **Composio** for OAuth management. See `security/composio-setup.md`.

---

## File Reference

```
configs/style/
├── .env.example                 ← Environment template (START HERE)
├── SETUP.md                     ← This file
├── skills/
│   ├── SKILL.md                 ← Agent skill manifest
│   ├── system_prompt.md         ← System prompt (the brain)
│   └── persona.md               ← Brand voice configuration
├── harness/
│   ├── hermes/                  ← Web chat + SMS harness
│   │   ├── hermes-config.yaml
│   │   ├── memory-config.yaml
│   │   └── DEPLOY.md
│   ├── nanoclaw/                ← Voice harness
│   │   ├── CLAUDE.md
│   │   └── DEPLOY.md
│   └── openclaw/                ← Instagram DM harness
│       ├── openclaw.yaml
│       ├── routing.yaml
│       └── DEPLOY.md
├── integrations/                ← Booking platform guides
│   ├── vagaro.md
│   ├── square-appointments.md
│   ├── booksy.md
│   ├── boulevard.md
│   └── instagram.md
├── security/
│   ├── hardening-checklist.md
│   └── composio-setup.md
└── knowledge/
    └── scaffold/                ← Knowledge base templates
        ├── services.md
        ├── team.md
        ├── policies.md
        ├── products.md
        └── parking-access.md
```

---

## Support

- **Documentation:** All files in this directory
- **ClawBuilt Support:** support@clawbuilt.ai
- **Agency tier:** Includes a dedicated onboarding call

---

## Common Questions

**Q: How much does it cost to run per month (beyond the license)?**
A: Typical operational costs are $17-40/month for Starter (LLM + hosting) and $50-125/month for Pro (LLM + hosting + SMS). See the cost estimates in each DEPLOY.md.

**Q: Can the agent actually book appointments?**
A: No, by design. The agent directs clients to your booking platform link. This avoids booking errors and liability.

**Q: What if a client asks something the agent doesn't know?**
A: The agent will honestly say it doesn't have that information and suggest calling the salon or visiting the website.

**Q: Can I change the persona later?**
A: Yes. Edit the persona config and restart the agent. Changes take effect immediately.

**Q: How do I update pricing or services?**
A: Edit the relevant knowledge base file in `data/knowledge/`. The agent picks up changes within 60 minutes (or restart for immediate effect).

**Q: Is client data secure?**
A: Yes. PII is masked in logs, memory is encrypted at rest, and the agent runs in a sandboxed container with restricted network access. See `security/hardening-checklist.md`.
