# TradeClaw — NanoClaw Deployment Guide

## Overview

NanoClaw is the lightweight deployment option for TradeClaw. No Docker, no Redis, no vector database required for basic deployments. It runs as a single application that calls the Anthropic API with the TradeClaw system prompt and tools.

Best for: Trades businesses that want to get up and running fast with minimal infrastructure overhead.

---

## Prerequisites

- Python 3.11+ or Node.js 20+
- Anthropic API key
- Twilio account (for SMS/voice)
- A server or cloud function platform (Railway, Render, Vercel, AWS Lambda)

---

## Step 1: Environment Setup

```bash
# Clone the repo
git clone https://github.com/clawbuilt/tradeclaw.git
cd tradeclaw

# Copy env template
cp configs/trades/.env.example .env

# Install dependencies (Python)
pip install anthropic twilio flask

# Or (Node.js)
npm install @anthropic-ai/sdk twilio express
```

Fill in `.env` with your values. At minimum you need:

```
ANTHROPIC_API_KEY=sk-ant-...
COMPANY_NAME=Your Company Name
COMPANY_PHONE=+15551234567
EMERGENCY_PHONE=+15559876543
EMERGENCY_CALLBACK_SLA=15
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+15551112222
```

---

## Step 2: Populate Knowledge Base

NanoClaw injects knowledge directly into the system prompt context (no vector store).

```bash
cp -r configs/trades/knowledge/scaffold/ knowledge/client/
```

Edit each file under `knowledge/client/` with the client's real data. NanoClaw concatenates these files and appends them to the system prompt as a `<knowledge>` block.

**Important:** Because knowledge is injected into the prompt, keep documents concise. Total knowledge should be under 15,000 tokens for optimal performance. If you need more, use Hermes with a vector store.

---

## Step 3: Deploy

### Option A: Railway / Render (Recommended for simplicity)

1. Push your configured repo to GitHub
2. Connect Railway or Render to your repo
3. Set environment variables in the platform's dashboard
4. Deploy — the platform handles SSL and domain routing

### Option B: AWS Lambda + API Gateway

```bash
# Package for Lambda
zip -r tradeclaw-nanoclaw.zip . -x ".git/*" "node_modules/*"

# Deploy via AWS CLI or SAM
sam deploy --template-file template.yaml --stack-name tradeclaw
```

### Option C: VPS (DigitalOcean, Linode, etc.)

```bash
# On your server
git clone https://github.com/clawbuilt/tradeclaw.git
cd tradeclaw
pip install -r requirements.txt

# Run with gunicorn behind nginx
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

Set up nginx as reverse proxy with SSL (Let's Encrypt).

---

## Step 4: Configure Twilio Webhooks

1. Log into Twilio Console
2. Navigate to your phone number configuration
3. Set webhooks:
   - **SMS:** `https://your-domain.com/webhooks/sms` (HTTP POST)
   - **Voice:** `https://your-domain.com/webhooks/voice` (HTTP POST)
4. Save

Test by sending an SMS to the Twilio number.

---

## Step 5: Test Emergency Classification

Send these test messages via SMS and verify correct behavior:

| Send This | Expected Behavior |
|---|---|
| "I smell gas in my house" | Emergency response + escalation sent |
| "No heat and it's freezing" | Emergency response + escalation sent |
| "Water is flooding my basement" | Emergency response + escalation sent |
| "CO detector going off" | Emergency response + safety instruction + escalation |
| "Need a quote for new AC" | Standard response with pricing range |
| "Can I schedule a tune-up?" | Standard scheduling response |

**All emergency tests must trigger escalation. Verify the on-call tech receives the alert.**

---

## Step 6: Web Chat (Optional)

Add the chat widget to the client's website:

```html
<script src="https://cdn.clawbuilt.ai/chat-widget.js"
  data-endpoint="https://your-domain.com/webhooks/chat"
  data-company="{{COMPANY_NAME}}"
  data-theme="trades">
</script>
```

---

## Step 7: External Cron Setup (for Seasonal Campaigns)

NanoClaw does not have built-in cron. Set up external triggers:

### GitHub Actions

```yaml
# .github/workflows/seasonal-campaign.yml
name: Seasonal Campaign
on:
  schedule:
    - cron: '0 14 1 3,4,5,9,10,11 *'  # 1st of spring/fall months at 2pm UTC
jobs:
  trigger:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -X POST https://your-domain.com/api/campaigns/trigger \
            -H "Authorization: Bearer ${{ secrets.API_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{"campaign": "seasonal"}'
```

### AWS EventBridge

Create a rule targeting your Lambda or API endpoint on the same schedule.

---

## Monitoring

NanoClaw logging is simpler than Hermes:

```bash
# Application logs
tail -f logs/tradeclaw.log

# Filter for emergencies
grep "EMERGENCY" logs/tradeclaw.log

# Filter for errors
grep "ERROR" logs/tradeclaw.log
```

Set up log forwarding to your preferred platform (Datadog, Papertrail, CloudWatch).

**Critical alert:** Set up an alert for any emergency classification that does not result in a successful escalation delivery. This is a P0 issue.

---

## Upgrading to Hermes

If the client outgrows NanoClaw (needs vector store, subagents, built-in cron, multi-channel), migrating to Hermes is straightforward:

1. Knowledge base files transfer directly
2. System prompt is the same
3. Environment variables are compatible
4. Main work is setting up Docker, Redis, and Qdrant

See `harness/hermes/DEPLOY.md` for the Hermes deployment guide.
