# StyleClaw — NanoClaw Deployment Guide

> Deploy StyleClaw as a voice agent on edge infrastructure.

---

## Overview

NanoClaw deploys StyleClaw on serverless edge functions for voice-first salon experiences. This guide covers deployment on Cloudflare Workers (recommended), with notes for Vercel Edge and Deno Deploy.

**Tier requirement:** Pro (voice beta) or Agency (voice GA + multi-location)

---

## Prerequisites

| Requirement          | Details                                              |
|----------------------|------------------------------------------------------|
| Vapi account         | Voice AI platform — https://vapi.ai                  |
| Anthropic API key    | Direct API access for Claude Haiku                   |
| Cloudflare account   | Workers plan (free tier works for low volume)         |
| Twilio account       | For phone number provisioning (via Vapi)              |
| Node.js 18+         | For local development and wrangler CLI                |

---

## Step 1: Set Up Vapi

1. Create an account at https://vapi.ai
2. Create a new Assistant:
   - **Name:** StyleClaw - {Salon Name}
   - **Model provider:** Anthropic
   - **Model:** claude-haiku-4-5-20251001
   - **Temperature:** 0.4
   - **First message:** Set your salon greeting
3. Configure a voice:
   - Recommended: ElevenLabs for natural salon-appropriate voices
   - Choose a voice that matches your persona (warm/professional or casual/friendly)
4. Set up a phone number:
   - Import from Twilio or purchase through Vapi
   - Note the phone number for your salon's marketing materials

## Step 2: Deploy Edge Function

### Cloudflare Workers (Recommended)

```bash
# Install wrangler CLI
npm install -g wrangler

# Authenticate
wrangler login

# Clone the NanoClaw template
git clone https://github.com/clawbuilt-ai/nanoclaw-template.git styleclaw-voice
cd styleclaw-voice

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials
```

**Set secrets (never commit these):**

```bash
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put VAPI_API_KEY
wrangler secret put BOOKING_API_KEY
```

**Configure wrangler.toml:**

```toml
name = "styleclaw-voice"
main = "src/index.ts"
compatibility_date = "2026-01-01"

[vars]
SALON_NAME = "Your Salon Name"
SALON_PHONE = "(555) 123-4567"
BOOKING_URL = "https://yoursalon.vagaro.com"
PERSONA = "luxury_salon_concierge"
FORMALITY = "4"
WARMTH = "4"
VERBOSITY = "2"
PLAYFULNESS = "2"

[[kv_namespaces]]
binding = "MEMORY"
id = "create-via-wrangler-kv-namespace-create"
```

**Create KV namespace for memory:**

```bash
wrangler kv:namespace create MEMORY
# Copy the ID into wrangler.toml
```

**Deploy:**

```bash
wrangler deploy
```

### Vercel Edge (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Clone template and deploy
git clone https://github.com/clawbuilt-ai/nanoclaw-template.git styleclaw-voice
cd styleclaw-voice
vercel --prod

# Set environment variables in Vercel dashboard
```

### Deno Deploy (Alternative)

```bash
# Install deployctl
deno install -A https://deno.land/x/deploy/deployctl.ts

# Deploy
deployctl deploy --project=styleclaw-voice src/main.ts
```

## Step 3: Connect Vapi to Edge Function

1. In the Vapi dashboard, set the **Server URL** for your assistant:
   ```
   https://styleclaw-voice.your-subdomain.workers.dev/vapi
   ```
2. Configure the webhook events:
   - `assistant-request` — Handles inbound call routing
   - `function-call` — Handles tool calls (service lookup, waitlist, etc.)
   - `end-of-call-report` — Logs call summaries

## Step 4: Load Knowledge Base

For NanoClaw, knowledge is embedded in the edge function bundle:

```bash
# Place knowledge files in src/knowledge/
cp configs/style/knowledge/scaffold/*.md src/knowledge/

# Edit each file with your salon's real data
# These are bundled into the worker at deploy time
```

For Agency tier with multi-location, use KV storage:

```bash
# Upload knowledge per location
wrangler kv:key put --binding=MEMORY "knowledge:main:services" "$(cat src/knowledge/main/services.md)"
wrangler kv:key put --binding=MEMORY "knowledge:downtown:services" "$(cat src/knowledge/downtown/services.md)"
```

## Step 5: Test

```bash
# Test the edge function directly
curl -X POST https://styleclaw-voice.your-subdomain.workers.dev/test \
  -H "Content-Type: application/json" \
  -d '{"message": "How much is a haircut?"}'

# Test via Vapi — call the configured phone number
# Speak naturally and verify responses match your persona
```

### Voice Testing Checklist

- [ ] Agent answers with correct salon greeting
- [ ] Service pricing is accurate (spelled out for voice)
- [ ] Stylist recommendations work
- [ ] Booking redirect provides phone number and offers to text link
- [ ] Transfer to human works when requested
- [ ] Call ends gracefully
- [ ] Call duration stays under 5 minutes for typical queries

---

## Operations

### Monitoring

```bash
# View real-time logs
wrangler tail

# View Vapi call logs
# Check Vapi dashboard → Calls tab for transcripts and analytics
```

### Updating Knowledge

```bash
# Edit knowledge files
# Redeploy
wrangler deploy
```

### Updating Voice/Persona

Voice settings are managed in the Vapi dashboard. Persona settings are in `wrangler.toml` vars — update and redeploy.

---

## Cost Estimates

| Component              | Monthly Estimate                |
|------------------------|---------------------------------|
| Claude Haiku (voice)   | $3-10 (voice calls are short)   |
| Vapi                   | $15-50 (depends on call volume) |
| Cloudflare Workers     | Free tier covers most salons    |
| Twilio phone number    | $1-2/month + per-minute         |
| **Total**              | **$20-65/mo**                   |

---

## Troubleshooting

| Issue                         | Solution                                                    |
|-------------------------------|-------------------------------------------------------------|
| Agent doesn't answer calls    | Check Vapi phone number config and server URL               |
| Responses too long for voice  | Reduce verbosity setting; check max_sentence_count          |
| Latency on responses          | Verify edge function is deployed to nearest region          |
| Wrong salon info              | Check knowledge files are bundled correctly; redeploy       |
| Transfer not working          | Verify transfer phone number in Vapi assistant config       |
| Call drops unexpectedly       | Check max_duration_seconds and silence_timeout settings     |
