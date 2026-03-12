# TradeClaw — Hermes Agent Deployment Guide

## Overview

This guide covers deploying TradeClaw on the Hermes Agent harness. Hermes is the default and recommended harness for most trades deployments. It provides Docker sandboxing, subagent delegation for emergency classification, and cron job support for seasonal campaigns.

---

## Prerequisites

- Docker Engine 24+ and Docker Compose v2
- Redis 7+ (for memory/session storage)
- Qdrant (for knowledge vector store) — or compatible vector DB
- Anthropic API key with access to claude-sonnet-4-20250514
- Twilio account (for SMS/voice channels)
- Domain with SSL certificate (for webhook endpoints)
- Node.js 20+ (for Hermes Agent runtime)

---

## Step 1: Clone and Configure

```bash
git clone https://github.com/clawbuilt/tradeclaw.git
cd tradeclaw

# Copy environment template and fill in values
cp configs/trades/.env.example .env
```

Edit `.env` with your specific values. See `.env.example` for all required variables.

**Critical variables to set first:**
- `ANTHROPIC_API_KEY` — Your Anthropic API key
- `COMPANY_NAME` — Client's business name
- `COMPANY_PHONE` — Main business phone number
- `EMERGENCY_PHONE` — After-hours emergency line
- `EMERGENCY_CALLBACK_SLA` — Minutes (recommend: 15)
- `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` — For SMS/voice

---

## Step 2: Populate Knowledge Base

Copy the scaffold templates and fill in client-specific data:

```bash
cp -r configs/trades/knowledge/scaffold/ knowledge/client/

# Edit each file with the client's actual data:
# - knowledge/client/services.md
# - knowledge/client/service-area.md
# - knowledge/client/pricing.md
# - knowledge/client/maintenance-plans.md
# - knowledge/client/warranty-info.md
# - knowledge/client/emergency-protocols.md
```

**Service area is critical.** Every zip code the client serves must be listed. Missing a zip code means the agent will tell a valid customer they are out of the service area.

**Pricing ranges must be accurate.** The agent uses these for quote responses. Inaccurate ranges erode customer trust and create problems for technicians.

---

## Step 3: Build and Deploy

```bash
# Build the Docker image
docker build -t tradeclaw:1.0.0 -f Dockerfile.hermes .

# Start with Docker Compose
docker compose -f docker-compose.hermes.yml up -d
```

The compose file starts:
- **tradeclaw-agent** — Main agent container
- **tradeclaw-redis** — Session/memory storage
- **tradeclaw-qdrant** — Vector store for knowledge retrieval

---

## Step 4: Ingest Knowledge Base

After the containers are running, ingest the knowledge documents into the vector store:

```bash
# Run the knowledge ingestion script
docker exec tradeclaw-agent python scripts/ingest_knowledge.py \
  --source knowledge/client/ \
  --collection tradeclaw_knowledge
```

Verify ingestion:

```bash
docker exec tradeclaw-agent python scripts/verify_knowledge.py \
  --query "What is the service call fee?" \
  --collection tradeclaw_knowledge
```

---

## Step 5: Configure Channels

### SMS (Twilio)

1. In Twilio console, configure your phone number's webhook:
   - SMS webhook: `https://your-domain.com/webhooks/twilio/sms` (POST)
   - Voice webhook: `https://your-domain.com/webhooks/twilio/voice` (POST)
2. Verify webhook is receiving messages in logs:
   ```bash
   docker logs -f tradeclaw-agent | grep "twilio"
   ```

### Web Chat Widget

1. Add the ClawBuilt chat widget script to the client's website:
   ```html
   <script src="https://cdn.clawbuilt.ai/chat-widget.js"
     data-agent-id="{{AGENT_ID}}"
     data-company="{{COMPANY_NAME}}"
     data-theme="trades">
   </script>
   ```
2. The widget connects to `wss://your-domain.com/webhooks/chat`

### Google LSA (Pro tier)

See `integrations/google-lsa.md` for setup.

### Thumbtack (Agency tier)

See `integrations/thumbtack.md` for setup.

---

## Step 6: Test Emergency Classification

**This is the most important test.** Run the emergency classification test suite before going live:

```bash
docker exec tradeclaw-agent python scripts/test_emergency_classification.py
```

This script sends test messages covering all emergency triggers and verifies correct classification. **All emergency tests must pass. Zero tolerance for false negatives.**

Manual test cases to verify:

| Message | Expected Classification |
|---|---|
| "My furnace stopped working and it's 20 degrees outside" | EMERGENCY |
| "I smell gas in my kitchen" | EMERGENCY |
| "Water is pouring from my ceiling" | EMERGENCY |
| "My CO detector is going off" | EMERGENCY |
| "I need a quote for a new water heater" | STANDARD |
| "Can you come tune up my AC next week?" | STANDARD |
| "My faucet is dripping" | STANDARD |

---

## Step 7: Configure Integrations

### ServiceTitan (if applicable)

See `integrations/servicetitan.md`. Requires:
- ServiceTitan API credentials (client ID, client secret)
- Tenant ID
- API access enabled for the client's ServiceTitan account

### Housecall Pro (if applicable)

See `integrations/housecall-pro.md`. Requires:
- Housecall Pro API key
- Composio OAuth connection

---

## Step 8: Security Hardening

Before going live, complete the security hardening checklist:

```bash
# Run the security audit script
docker exec tradeclaw-agent python scripts/security_audit.py
```

See `security/hardening-checklist.md` for the full checklist.

Key items:
- [ ] All API keys in environment variables, not config files
- [ ] Redis password set and TLS enabled
- [ ] Webhook endpoints validate signatures
- [ ] Rate limiting configured
- [ ] Docker container running as non-root
- [ ] Read-only root filesystem enabled
- [ ] Network policies restrict egress to required endpoints only

---

## Step 9: Go Live Checklist

- [ ] Knowledge base ingested and verified
- [ ] Emergency classification tests all passing
- [ ] SMS channel tested (send/receive)
- [ ] Web chat widget tested on client's site
- [ ] After-hours routing tested
- [ ] Service area verification tested (in-area and out-of-area)
- [ ] Pricing ranges verified with client
- [ ] Emergency escalation chain confirmed with client
- [ ] Seasonal campaign templates reviewed and approved by client
- [ ] Monitoring and alerting configured
- [ ] Client has reviewed and approved the agent's responses
- [ ] Backup on-call escalation path documented

---

## Monitoring

### Logs

```bash
# Main agent logs
docker logs -f tradeclaw-agent

# Emergency-specific logs
docker logs tradeclaw-agent | grep "EMERGENCY"
```

### Metrics (Prometheus)

Metrics endpoint: `http://localhost:9090/metrics`

Key metrics to watch:
- `tradeclaw_emergency_classifications_total` — Emergency vs standard split
- `tradeclaw_response_latency_seconds` — Response time distribution
- `tradeclaw_emergency_response_time_seconds` — Time from emergency detection to escalation
- `tradeclaw_service_area_rejections_total` — Out-of-area requests

### Alerts

Configure alerts for:
- Emergency classifier errors (any error = critical)
- Response latency > 5 seconds (warning)
- Reclassification events (a standard request later identified as emergency = critical)
- Channel delivery failures (SMS not sent = high)

---

## Updating

### Knowledge Base Updates

When the client changes pricing, services, or service area:

```bash
# Re-ingest knowledge
docker exec tradeclaw-agent python scripts/ingest_knowledge.py \
  --source knowledge/client/ \
  --collection tradeclaw_knowledge \
  --replace
```

### Agent Updates

```bash
# Pull latest image
docker pull clawbuilt/tradeclaw:latest

# Restart with new image
docker compose -f docker-compose.hermes.yml up -d --force-recreate tradeclaw-agent
```

---

## Troubleshooting

| Issue | Check |
|---|---|
| Agent not responding to SMS | Twilio webhook URL correct? SSL cert valid? Firewall open on 443? |
| Wrong emergency classification | Review emergency classifier prompt. Check temperature (should be 0.1). Test with `test_emergency_classification.py`. |
| Out-of-area false negatives | Verify all zip codes are in `service-area.md`. Check for typos. |
| Slow responses | Check Redis connection. Check Anthropic API latency. Check vector store query time. |
| Seasonal campaigns not sending | Check cron job configuration. Verify Twilio SMS send permissions. Check campaign tracking in Redis (dedup may be blocking). |
