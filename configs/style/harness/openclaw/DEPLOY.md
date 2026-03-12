# StyleClaw — OpenClaw Deployment Guide

> Deploy StyleClaw on the OpenClaw harness for Instagram DM and social channel automation.

---

## Overview

OpenClaw is the social-first harness for StyleClaw. It connects your salon's AI assistant to Instagram Direct Messages (and future social channels) through the Meta Graph API.

**Primary use case:** Respond to Instagram DMs automatically — answer service questions, share pricing, redirect to booking, and capture leads from social interactions.

**Tier requirement:** Pro ($997) or Agency ($1,497)

---

## Prerequisites

| Requirement                | Details                                                    |
|----------------------------|------------------------------------------------------------|
| Instagram Business Account | Must be connected to a Facebook Page                       |
| Meta Developer Account     | https://developers.facebook.com                            |
| Meta App                   | With Instagram Messaging permissions                       |
| Public HTTPS endpoint      | For webhook verification (Instagram requires HTTPS)        |
| Docker v24+                | For container deployment                                   |
| Domain + SSL certificate   | Required for Meta webhook verification                     |
| OpenRouter API key         | For LLM access                                             |

---

## Step 1: Meta App Setup

### 1a. Create a Meta App

1. Go to https://developers.facebook.com/apps/
2. Click **Create App** > **Business** > **Next**
3. App name: `StyleClaw - {Your Salon Name}`
4. Select your Business Portfolio
5. Click **Create App**

### 1b. Add Instagram Messaging Product

1. In your app dashboard, click **Add Product**
2. Select **Instagram** > **Set Up**
3. Navigate to **Instagram** > **Basic Display** in the sidebar

### 1c. Configure Instagram Messaging

1. Go to **Messenger** > **Settings** in the app dashboard
2. Under **Webhooks**, you'll configure this in Step 4 (after deployment)
3. Under **Access Tokens**, generate a Page Access Token:
   - Select your Facebook Page (connected to your Instagram Business Account)
   - Click **Generate Token**
   - Copy and save this token securely — it goes in your `.env`

### 1d. Get Instagram Business Account ID

```bash
# Using the Page Access Token from above:
curl -s "https://graph.facebook.com/v19.0/me/instagram_business_account?access_token=YOUR_PAGE_ACCESS_TOKEN" | jq .
```

Save the `instagram_business_account.id` value.

### 1e. Required Permissions

Your app needs these permissions approved:

| Permission                    | Purpose                      | Review Required |
|-------------------------------|------------------------------|:---------------:|
| `instagram_manage_messages`   | Read and send DMs            | Yes             |
| `instagram_basic`             | Access account info          | Yes             |
| `pages_messaging`             | Facebook Messenger (future)  | Yes             |
| `pages_manage_metadata`       | Webhook subscriptions        | Yes             |

**Note:** For development/testing, you can use these permissions without review. For production, submit for App Review.

---

## Step 2: Configure Environment

```bash
# Copy environment template
cp configs/style/.env.example .env
```

Add these Instagram-specific variables to `.env`:

```bash
# Instagram / Meta
INSTAGRAM_APP_ID=your_app_id
INSTAGRAM_APP_SECRET=your_app_secret
INSTAGRAM_PAGE_ACCESS_TOKEN=your_page_access_token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_ig_business_account_id
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=your_random_verify_string  # You create this — any random string

# OpenClaw public URL (must be HTTPS)
OPENCLAW_PUBLIC_URL=https://openclaw.yourdomain.com
```

---

## Step 3: Deploy OpenClaw Container

### Docker Compose

Create or update your `docker-compose.yaml`:

```yaml
version: "3.8"

services:
  styleclaw-openclaw:
    image: clawbuilt/openclaw-base:latest
    container_name: styleclaw-openclaw
    restart: unless-stopped
    env_file: .env
    ports:
      - "3200:3200"
    volumes:
      - ./configs/style/harness/openclaw/openclaw.yaml:/app/config/openclaw.yaml:ro
      - ./configs/style/harness/openclaw/routing.yaml:/app/config/routing.yaml:ro
      - ./configs/style/skills/system_prompt.md:/app/config/system_prompt.md:ro
      - ./data/knowledge:/data/knowledge:ro
      - ./data/logs:/data/logs
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: "0.5"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3200/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Reverse Proxy (Nginx)

Instagram requires HTTPS. Set up Nginx as a reverse proxy:

```nginx
server {
    listen 443 ssl;
    server_name openclaw.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/openclaw.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/openclaw.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3200;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Launch

```bash
docker compose up -d styleclaw-openclaw

# Verify it's running
curl https://openclaw.yourdomain.com/health
```

---

## Step 4: Configure Instagram Webhook

1. Go to your Meta App dashboard > **Messenger** > **Settings** > **Webhooks**
2. Click **Subscribe to Events**
3. Enter:
   - **Callback URL:** `https://openclaw.yourdomain.com/webhooks/instagram`
   - **Verify Token:** The value you set for `INSTAGRAM_WEBHOOK_VERIFY_TOKEN` in `.env`
4. Click **Verify and Save**
5. Subscribe to these webhook fields:
   - `messages`
   - `messaging_postbacks`

### Verify Webhook is Working

```bash
# Check OpenClaw logs for the verification request
docker compose logs -f styleclaw-openclaw

# You should see: "Webhook verified successfully"
```

---

## Step 5: Test the Integration

### Send a Test DM

1. Open Instagram on a different account (not the business account)
2. Send a DM to your salon's Instagram account
3. The agent should respond within a few seconds

### Test Scenarios

| Test                           | Expected Response                                    |
|--------------------------------|------------------------------------------------------|
| "Hi"                           | Personalized greeting with quick reply options       |
| "How much is a haircut?"       | Pricing from knowledge base                          |
| "I want to book"               | Booking link with encouragement                      |
| "Who does the best balayage?"  | Stylist recommendation from bios                     |
| Send an inspo photo            | Acknowledge photo, suggest referencing at appointment |
| "Let me talk to someone"       | Escalation response with phone/email                 |
| Send message outside hours     | Away message with contact alternatives               |

---

## Security Hardening

### Required for Production

1. **Validate webhook signatures** — Verify that incoming webhooks are from Meta:

```python
# OpenClaw validates this automatically, but verify it's enabled:
# In openclaw.yaml, ensure webhook signature validation is not disabled
```

2. **Rate limit by user** — Prevent DM spam from exhausting your LLM budget:
   - Default: 10 messages/minute, 60 messages/hour per user
   - Configured in `openclaw.yaml` under `rate_limiting`

3. **Spam detection** — Block known spam patterns (configured in `openclaw.yaml`)

4. **PII protection** — Never collect sensitive info over DMs:
   - No phone numbers (redirect to booking link)
   - No email addresses (redirect to website)
   - No payment info (never, under any circumstances)

5. **Budget caps** — Set daily LLM spending limits in `routing.yaml`:
   ```yaml
   cost_controls:
     daily_budget_usd: 5.00
   ```

6. **Audit logging** — All DM conversations are logged with PII masking.

### Meta App Security

- Store `INSTAGRAM_APP_SECRET` securely — never commit to git
- Rotate `INSTAGRAM_PAGE_ACCESS_TOKEN` periodically (they expire; use long-lived tokens)
- Enable two-factor authentication on the Meta Developer account
- Restrict app roles to only necessary team members

---

## Long-Lived Access Tokens

Page Access Tokens expire. Generate a long-lived token:

```bash
# Exchange short-lived token for long-lived token (60 days)
curl -s "https://graph.facebook.com/v19.0/oauth/access_token?\
grant_type=fb_exchange_token&\
client_id=${INSTAGRAM_APP_ID}&\
client_secret=${INSTAGRAM_APP_SECRET}&\
fb_exchange_token=${SHORT_LIVED_TOKEN}" | jq .
```

**Set a calendar reminder** to rotate the token before expiration. For Agency tier, consider implementing automatic token refresh.

---

## Monitoring

### Key Metrics

| Metric                        | Where to Check                    |
|-------------------------------|-----------------------------------|
| DM response rate              | OpenClaw logs + Meta Inbox        |
| Response latency              | OpenClaw `/metrics` endpoint      |
| LLM costs                     | OpenRouter dashboard              |
| Conversations per day         | OpenClaw analytics export         |
| Escalation rate               | OpenClaw logs                     |
| Spam blocked                  | OpenClaw logs                     |

### Alerts

Set up alerts for:
- Webhook delivery failures (Meta sends retry notifications)
- LLM budget threshold reached (80%)
- Agent response latency > 5 seconds
- Error rate > 5% of conversations

---

## Troubleshooting

| Issue                              | Solution                                                      |
|------------------------------------|---------------------------------------------------------------|
| Webhook verification fails         | Check verify token matches `.env`; ensure HTTPS is working    |
| Agent not responding to DMs        | Check webhook subscriptions; verify Page Access Token is valid |
| "Token expired" errors             | Generate new long-lived token (see above)                     |
| Responses too slow                 | Check model routing — ensure Haiku is handling simple queries  |
| Budget exceeded, static responses  | Increase daily budget or optimize routing to reduce Sonnet use |
| Spam overwhelming the agent        | Tighten rate limits; add patterns to spam blocklist            |
| Duplicate responses                | Check for duplicate webhook deliveries; enable dedup           |
| Instagram reports policy violation | Review response content; ensure no prohibited content          |

---

## Cost Estimates

| Component              | Monthly Estimate (Pro)      |
|------------------------|-----------------------------|
| LLM (Haiku primary)   | $5-15                       |
| LLM (Sonnet fallback) | $2-8                        |
| Hosting (VPS)          | $10-20                      |
| Domain + SSL           | $0-5 (Let's Encrypt free)   |
| **Total**              | **$17-48/mo**               |

Instagram API itself is free. Costs scale with DM volume.
