# TradeClaw — OpenClaw Deployment Guide

## Overview

OpenClaw is the most powerful harness option for TradeClaw. It provides a full webhook pipeline, deep two-way integrations with field service platforms (ServiceTitan, Housecall Pro), multi-platform lead ingestion (Google LSA, Thumbtack), and model routing for cost optimization.

Use OpenClaw when the client needs:
- Deep ServiceTitan or Housecall Pro integration (two-way sync, not just data push)
- Multi-platform lead capture with SLA-driven auto-response
- Custom webhook pipelines for their specific tech stack
- Fine-grained model routing and cost controls

---

## Prerequisites

- Docker Engine 24+ and Docker Compose v2
- Redis 7+ with TLS
- Qdrant vector database
- PostgreSQL 15+ (for event log and audit trail)
- Anthropic API key
- Twilio account
- Nginx or Caddy (reverse proxy with SSL)
- ServiceTitan API access (if applicable)
- Housecall Pro API access (if applicable)
- Google LSA partner access (if applicable)
- Thumbtack Pro API access (if applicable)

---

## Step 1: Environment and Configuration

```bash
git clone https://github.com/clawbuilt/tradeclaw.git
cd tradeclaw

cp configs/trades/.env.example .env
# Fill in ALL values — OpenClaw uses more env vars than other harnesses
```

OpenClaw-specific environment variables:

```bash
# PostgreSQL (event log)
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=tradeclaw
POSTGRES_USER=tradeclaw
POSTGRES_PASSWORD=<strong-password>

# ServiceTitan
SERVICETITAN_CLIENT_ID=<from ServiceTitan developer portal>
SERVICETITAN_CLIENT_SECRET=<from ServiceTitan developer portal>
SERVICETITAN_TENANT_ID=<client's tenant ID>
SERVICETITAN_API_URL=https://api.servicetitan.io/v2
SERVICETITAN_WEBHOOK_SECRET=<generated shared secret>

# OpenTelemetry (optional but recommended)
OTEL_ENDPOINT=https://your-otel-collector:4317
```

---

## Step 2: Deploy Infrastructure

```bash
# Start all services
docker compose -f docker-compose.openclaw.yml up -d
```

This starts:
- **tradeclaw-agent** — Main OpenClaw agent
- **tradeclaw-redis** — Session/memory store
- **tradeclaw-qdrant** — Vector store
- **tradeclaw-postgres** — Event log and audit trail
- **tradeclaw-nginx** — Reverse proxy with SSL termination

---

## Step 3: Database Migration

```bash
docker exec tradeclaw-agent python scripts/migrate.py
```

This creates the event log, webhook audit, and customer sync tables in PostgreSQL.

---

## Step 4: Configure Webhook Endpoints

### ServiceTitan Webhooks

1. Log into ServiceTitan as an admin
2. Navigate to Settings > Integrations > Webhooks
3. Add webhooks:
   - **Job Update:** `https://your-domain.com/webhooks/servicetitan/job`
   - **Customer Update:** `https://your-domain.com/webhooks/servicetitan/customer`
4. Set the shared secret to match `SERVICETITAN_WEBHOOK_SECRET`

### Google LSA

1. Work with your Google LSA partner rep to configure the lead webhook
2. Webhook URL: `https://your-domain.com/webhooks/google-lsa/lead`
3. Configure OAuth credentials per Google's requirements

### Thumbtack

1. Register as a Thumbtack Pro API partner
2. Configure webhook URL: `https://your-domain.com/webhooks/thumbtack/lead`
3. Set bearer token to match `THUMBTACK_WEBHOOK_TOKEN`

### Twilio

Same as Hermes deployment — set SMS/voice webhooks to your domain.

---

## Step 5: Knowledge Base and Testing

Same as Hermes deployment:
1. Populate knowledge from scaffold templates
2. Ingest into vector store
3. Run emergency classification tests

---

## Step 6: Security Hardening

OpenClaw has a larger attack surface due to multiple webhook endpoints. Complete the full hardening checklist at `security/hardening-checklist.md`.

**Additional OpenClaw-specific hardening:**

- [ ] All webhook endpoints validate authentication (HMAC, bearer token, OAuth)
- [ ] Webhook replay protection enabled (check timestamps, reject old events)
- [ ] PostgreSQL connection uses TLS
- [ ] Database credentials rotated on deployment
- [ ] Outbound webhook retry limits prevent infinite loops
- [ ] Rate limiting per webhook endpoint configured
- [ ] Input validation on all webhook payloads (max body size, schema validation)
- [ ] ServiceTitan API credentials scoped to minimum required permissions
- [ ] Audit trail enabled for all webhook events

---

## Step 7: Integration Verification

### ServiceTitan Two-Way Sync Test

```bash
# Verify inbound: create a test job in ServiceTitan, confirm webhook received
docker logs tradeclaw-agent | grep "servicetitan.job_update"

# Verify outbound: trigger a job creation from the agent
docker exec tradeclaw-agent python scripts/test_servicetitan.py --action create_job
```

### Google LSA Lead Response Test

```bash
# Simulate a Google LSA lead
curl -X POST https://your-domain.com/webhooks/google-lsa/lead \
  -H "Content-Type: application/json" \
  -d '{"lead_id": "test-001", "customer_name": "Test Customer", "phone": "+15551234567", "service": "AC Repair", "zip": "75001"}'

# Verify response was sent within 5 minutes
docker logs tradeclaw-agent | grep "google_lsa.new_lead"
```

---

## Monitoring

### Event Dashboard

OpenClaw logs all webhook events to PostgreSQL. Query the event log:

```sql
-- Recent emergency events
SELECT * FROM events
WHERE classification = 'EMERGENCY'
ORDER BY created_at DESC
LIMIT 20;

-- Lead response times (should be < 300 seconds)
SELECT
  source,
  AVG(response_time_seconds) as avg_response_time,
  MAX(response_time_seconds) as max_response_time,
  COUNT(*) as lead_count
FROM lead_events
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY source;

-- Webhook delivery failures
SELECT * FROM webhook_outbound
WHERE status = 'failed'
ORDER BY created_at DESC;
```

### Metrics and Tracing

- Prometheus metrics: `http://localhost:9090/metrics`
- OpenTelemetry traces: routed to your configured collector
- Key trace spans: `emergency_classify`, `webhook_process`, `lead_response`, `servicetitan_sync`

### Alerts

| Alert | Condition | Severity |
|---|---|---|
| Emergency handler failure | Any error in emergency pipeline | Critical (PagerDuty) |
| Lead response SLA breach | Response time > 5 min | High (Slack) |
| Webhook delivery failure | Outbound failure rate > 5% | High (Slack) |
| ServiceTitan sync failure | Sync error count > 0 | Medium (Slack) |
| Cost budget approaching | Daily spend > 80% of budget | Low (Email) |

---

## Scaling

OpenClaw can scale horizontally:

```bash
# Scale agent containers
docker compose -f docker-compose.openclaw.yml up -d --scale tradeclaw-agent=3
```

Ensure Redis and PostgreSQL can handle the additional connections. For high-volume deployments (100+ leads/day), consider:
- Redis Cluster or Redis Sentinel
- PostgreSQL read replicas for event queries
- Qdrant replicated deployment
- Load balancer in front of agent containers
