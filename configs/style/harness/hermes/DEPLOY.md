# StyleClaw — Hermes Agent Deployment Guide

> Deploy StyleClaw on the Hermes Agent harness with Docker sandboxing.

---

## Overview

Hermes Agent is the default harness for StyleClaw. It provides:

- Docker-sandboxed execution with network egress controls
- Web chat widget + SMS (Twilio) channel support
- Cron-based appointment reminders
- Persistent memory with configurable retention
- Composio-managed OAuth for booking platform integrations

**Recommended for:** Web chat deployments, SMS-enabled salons, multi-channel setups (excluding Instagram DM, which uses OpenClaw).

---

## Prerequisites

| Requirement          | Details                                                    |
|----------------------|------------------------------------------------------------|
| Docker               | v24+ with compose v2                                       |
| OpenRouter API key   | For LLM access (claude-haiku + sonnet fallback)            |
| Domain + SSL         | For widget embed and webhook endpoints                     |
| Twilio account       | If SMS channel enabled (Pro/Agency)                        |
| Booking platform API | Vagaro, Square, Booksy, or Boulevard credentials           |
| Composio account     | For OAuth connection management                            |

---

## Step 1: Clone and Configure

```bash
# Clone the config repo (or copy configs into your Hermes project)
git clone https://github.com/clawbuilt-ai/styleclaw.git
cd styleclaw

# Copy environment template
cp configs/style/.env.example .env
```

Edit `.env` with your salon's details. See `.env.example` for all required and optional variables.

**Critical variables:**

```bash
# LLM
OPENROUTER_API_KEY=sk-or-...

# Salon identity
SALON_NAME="Your Salon Name"
SALON_PHONE="(555) 123-4567"
BOOKING_URL="https://yoursalon.vagaro.com"
BOOKING_PLATFORM="vagaro"

# Booking API
BOOKING_API_KEY=your_api_key
BOOKING_LOCATION_ID=your_location_id
```

## Step 2: Populate Knowledge Base

Copy the scaffold templates and fill them with your salon's information:

```bash
mkdir -p data/knowledge

# Copy templates
cp configs/style/knowledge/scaffold/*.md data/knowledge/

# Edit each file with your salon's real data
# - services.md    → Your full service menu
# - team.md        → Stylist/barber bios
# - policies.md    → Cancellation, no-show, payment policies
# - products.md    → Retail products you carry
# - parking-access.md → Location, parking, accessibility info
```

**This is the most important step.** The agent's quality is directly proportional to the quality of your knowledge base. Be thorough — include every service, every stylist, every policy.

## Step 3: Configure Persona

Edit `hermes-config.yaml` to set your persona:

```yaml
persona:
  preset: "luxury_salon_concierge"  # or "neighborhood_barbershop_host" or "custom"
  calibration:
    formality: 4
    warmth: 4
    verbosity: 3
    playfulness: 2
```

See `skills/persona.md` for detailed calibration guidance and examples by salon type.

## Step 4: Build and Launch

```bash
# Build the Docker image
docker compose build

# Start the agent
docker compose up -d

# Verify it's running
docker compose ps
docker compose logs -f styleclaw-agent
```

### Docker Compose Reference

Create `docker-compose.yaml` in your project root:

```yaml
version: "3.8"

services:
  styleclaw-agent:
    image: clawbuilt/hermes-base:latest
    container_name: styleclaw-agent
    restart: unless-stopped
    env_file: .env
    ports:
      - "3100:3100"    # Chat widget API
      - "3101:3101"    # Webhook receiver
    volumes:
      - ./configs/style/harness/hermes/hermes-config.yaml:/app/config/hermes-config.yaml:ro
      - ./configs/style/harness/hermes/memory-config.yaml:/app/config/memory-config.yaml:ro
      - ./configs/style/skills/system_prompt.md:/app/config/system_prompt.md:ro
      - ./data/knowledge:/data/knowledge:ro
      - ./data/memory:/data/memory
      - ./data/logs:/data/logs
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: "0.5"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3100/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## Step 5: Embed the Chat Widget

Add the widget script to your salon's website, just before `</body>`:

```html
<script
  src="https://your-domain.com:3100/widget.js"
  data-agent-id="styleclaw"
  data-primary-color="#2D2D2D"
  data-greeting="Hi! Welcome to Your Salon. How can I help?"
  data-position="bottom-right"
  async>
</script>
```

**Widget customization options:**

| Attribute              | Description                        | Default          |
|------------------------|------------------------------------|------------------|
| `data-primary-color`   | Brand color (hex)                  | `#2D2D2D`        |
| `data-greeting`        | Initial greeting message           | From config      |
| `data-position`        | `bottom-right` or `bottom-left`    | `bottom-right`   |
| `data-avatar`          | URL to agent avatar image          | Default icon     |
| `data-launcher-text`   | Text on collapsed launcher button  | `Chat with us`   |

## Step 6: Enable SMS (Pro/Agency)

1. Set up a Twilio account and purchase a phone number.
2. Add Twilio credentials to `.env`:

```bash
SMS_ENABLED=true
TWILIO_ACCOUNT_SID=ACxxxx
TWILIO_AUTH_TOKEN=xxxx
TWILIO_PHONE_NUMBER=+15551234567
```

3. Configure the Twilio webhook to point to your agent:

```
POST https://your-domain.com:3101/webhooks/twilio/sms
```

4. Restart the agent: `docker compose restart styleclaw-agent`

## Step 7: Configure Appointment Reminders

Appointment reminders are enabled by default in `hermes-config.yaml`. They require:

1. A working booking platform integration (Step 8).
2. SMS channel enabled (Step 6) — reminders are sent via SMS.
3. The cron scheduler running inside the container.

**Default reminder schedule:**
- 24 hours before appointment
- 2 hours before appointment

Customize in `hermes-config.yaml` under `cron_jobs.appointment_reminders`.

## Step 8: Connect Booking Platform

### Via Composio (Recommended)

1. Log into your Composio dashboard.
2. Create a new connection for your booking platform (Vagaro, Square, Booksy, or Boulevard).
3. Complete the OAuth flow.
4. Copy the connection credentials to `.env`.

See `integrations/` for platform-specific setup guides:

- `integrations/vagaro.md` — Vagaro (Starter tier)
- `integrations/square-appointments.md` — Square (Pro tier)
- `integrations/booksy.md` — Booksy (Pro tier)
- `integrations/boulevard.md` — Boulevard (Agency tier)

### Direct API (Alternative)

If not using Composio, set the API key directly:

```bash
COMPOSIO_ENABLED=false
BOOKING_API_KEY=your_direct_api_key
```

## Step 9: Security Hardening

Before going live, run through the security checklist:

```bash
# Review the checklist
cat configs/style/security/hardening-checklist.md
```

Key items:
- Ensure `.env` is in `.gitignore` and never committed.
- Verify Docker network egress allowlist is correct.
- Enable PII masking in memory config.
- Set up SSL/TLS for all endpoints.
- Configure rate limiting.

See `security/hardening-checklist.md` for the full checklist.

---

## Operations

### Logs

```bash
# View live logs
docker compose logs -f styleclaw-agent

# View last 100 lines
docker compose logs --tail 100 styleclaw-agent
```

### Updating Knowledge Base

When you update services, pricing, team members, or policies:

```bash
# Edit the relevant file in data/knowledge/
# The agent will pick up changes within 60 minutes (knowledge cache TTL)

# To force immediate reload:
docker compose restart styleclaw-agent
```

### Updating the Agent

```bash
# Pull latest image
docker compose pull

# Restart with new image
docker compose up -d
```

### Backup

```bash
# Backup memory database
cp data/memory/styleclaw.db data/memory/styleclaw.db.backup.$(date +%Y%m%d)

# Backup knowledge base
tar czf knowledge-backup-$(date +%Y%m%d).tar.gz data/knowledge/
```

---

## Monitoring

### Health Check

```bash
curl http://localhost:3100/health
# Expected: {"status": "ok", "version": "1.0.0", "uptime": "..."}
```

### Metrics

The agent exposes Prometheus-compatible metrics at `/metrics`:

| Metric                              | Description                        |
|-------------------------------------|------------------------------------|
| `styleclaw_messages_total`          | Total messages processed           |
| `styleclaw_conversations_active`    | Currently active conversations     |
| `styleclaw_llm_latency_seconds`    | LLM response time histogram        |
| `styleclaw_llm_cost_usd`           | Estimated LLM cost                 |
| `styleclaw_reminders_sent_total`   | Appointment reminders sent         |
| `styleclaw_waitlist_entries_total` | Waitlist sign-ups                  |
| `styleclaw_escalations_total`      | Human escalation triggers          |

---

## Troubleshooting

| Issue                                | Solution                                                              |
|--------------------------------------|-----------------------------------------------------------------------|
| Agent not responding                 | Check `docker compose ps` — ensure container is running and healthy   |
| "Model not found" error             | Verify `OPENROUTER_API_KEY` is valid and has credits                  |
| Widget not loading                   | Check CORS settings — your salon domain must be in the allowlist      |
| SMS not sending                      | Verify Twilio credentials and webhook URL                             |
| Reminders not firing                 | Check cron is enabled and booking platform integration is connected   |
| Stale knowledge                      | Restart agent or wait for cache TTL (60 min)                          |
| High latency                         | Check if requests are routing to fallback model unnecessarily         |
| Memory errors                        | Increase Docker memory limit from 512Mi                               |

---

## Cost Estimates

| Component              | Monthly Estimate (Starter)  | Monthly Estimate (Pro)     |
|------------------------|-----------------------------|----------------------------|
| LLM (Haiku primary)   | $5-15 (500-1500 convos)     | $15-40 (1500-4000 convos)  |
| LLM (Sonnet fallback) | $2-5                        | $5-15                      |
| Twilio SMS             | N/A                         | $10-30                     |
| Hosting (VPS)          | $10-20                      | $20-40                     |
| **Total**              | **$17-40/mo**               | **$50-125/mo**             |

These are operational costs only, separate from the StyleClaw license fee.
