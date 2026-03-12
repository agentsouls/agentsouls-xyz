# StyleClaw — NanoClaw Claude Configuration

> NanoClaw is the lightweight, edge-deployed harness for voice agents (Vapi) and minimal-footprint deployments.

---

## Overview

NanoClaw runs StyleClaw as a Claude-powered agent on edge functions (Cloudflare Workers, Vercel Edge, or Deno Deploy). It is optimized for:

- **Voice agent** deployments via Vapi integration
- **Ultra-low latency** — edge compute, no Docker overhead
- **Minimal infrastructure** — no servers to manage
- **Pro/Agency tier** deployments where voice is a primary channel

NanoClaw trades some features (cron jobs, persistent local memory) for speed and simplicity.

---

## Claude Model Configuration

### Pro Tier

```yaml
nanoclaw:
  provider: "anthropic"
  model: "claude-haiku-4-5-20251001"
  temperature: 0.4
  max_tokens: 512        # Voice responses should be short
  top_p: 0.9

  # Voice-optimized settings
  voice:
    provider: "vapi"
    voice_id: "${VAPI_VOICE_ID}"
    # Reduce verbosity for spoken responses
    max_sentence_count: 3
    # Spell out numbers and abbreviations
    format: "spoken"
```

### Agency Tier

```yaml
nanoclaw:
  provider: "anthropic"
  model: "claude-haiku-4-5-20251001"
  temperature: 0.4
  max_tokens: 512
  top_p: 0.9

  # Agency gets Sonnet fallback for complex voice interactions
  fallback:
    model: "claude-sonnet-4-20250514"
    temperature: 0.3
    max_tokens: 768
    trigger_on:
      - intent: "complaint"
      - intent: "complex_recommendation"
      - sentiment: "negative"

  voice:
    provider: "vapi"
    voice_id: "${VAPI_VOICE_ID}"
    max_sentence_count: 4
    format: "spoken"

  # Agency: multi-location routing
  multi_location:
    enabled: true
    routing_key: "phone_number"  # Route by inbound number
    locations:
      - id: "main"
        phone: "${LOCATION_MAIN_PHONE}"
        knowledge_path: "/data/knowledge/main/"
      - id: "downtown"
        phone: "${LOCATION_DOWNTOWN_PHONE}"
        knowledge_path: "/data/knowledge/downtown/"
```

---

## System Prompt Adjustments for Voice

When running on NanoClaw (voice), the system prompt receives these additional instructions:

```
VOICE CHANNEL OVERRIDES:
- You are speaking, not typing. Use natural conversational cadence.
- Keep responses to 1-3 sentences. Clients are on the phone — respect their time.
- Spell out numbers: say "forty-five dollars" not "$45".
- Spell out times: say "two thirty in the afternoon" not "2:30 PM".
- Do not use bullet points, markdown, or formatted lists. Speak in flowing sentences.
- When listing services or options, limit to 3 at a time. Ask "would you like to hear more?" before continuing.
- Pause naturally. Use phrases like "let me check on that" to fill processing time.
- If you don't understand the client, say: "I'm sorry, could you repeat that?"
- For booking redirects, say: "I'd recommend booking through our website or giving us a call at [phone]. Would you like me to text you the link?"
```

---

## Vapi Integration

### Configuration

```yaml
vapi:
  api_key: "${VAPI_API_KEY}"

  assistant:
    name: "${AGENT_NAME}"
    model:
      provider: "anthropic"
      model: "claude-haiku-4-5-20251001"
      temperature: 0.4
      max_tokens: 512
    voice:
      provider: "11labs"       # or "deepgram", "azure"
      voice_id: "${VAPI_VOICE_ID}"
    first_message: "Hi, thanks for calling ${SALON_NAME}! How can I help you today?"
    end_call_message: "Thanks for calling! Have a great day."

    # Silence detection
    silence_timeout_seconds: 10
    max_duration_seconds: 300   # 5-minute max call

    # Transfer to human
    transfer:
      enabled: true
      phone_number: "${SALON_PHONE}"
      message: "Let me transfer you to our front desk. One moment please."
      trigger_phrases:
        - "speak to a person"
        - "talk to someone"
        - "transfer me"
        - "real person"
        - "front desk"

  # Phone number configuration
  phone:
    provider: "twilio"
    number: "${VAPI_PHONE_NUMBER}"
    # Forward unanswered calls to salon after hours
    fallback_number: "${SALON_PHONE}"
```

### Call Flow

```
1. Client calls salon number (or dedicated AI line)
2. Vapi answers with first_message greeting
3. Client states their need
4. NanoClaw processes with Claude Haiku
   → Service info, pricing, availability questions handled by AI
   → Booking requests directed to website/phone
   → Complaints or complex issues transferred to front desk
5. Call ends naturally or transfers to human
```

---

## Edge Deployment

### Cloudflare Workers

```javascript
// wrangler.toml
name = "styleclaw-voice"
main = "src/index.ts"
compatibility_date = "2025-01-01"

[vars]
SALON_NAME = "Your Salon"
PERSONA = "luxury_salon_concierge"

[[kv_namespaces]]
binding = "MEMORY"
id = "your-kv-namespace-id"
```

### Vercel Edge

```json
// vercel.json
{
  "functions": {
    "api/voice.ts": {
      "runtime": "edge",
      "maxDuration": 30
    }
  }
}
```

### Deno Deploy

```typescript
// main.ts
import { serve } from "https://deno.land/std/http/server.ts";
// NanoClaw handler imported from @clawbuilt/nanoclaw
```

---

## Memory on NanoClaw

NanoClaw uses lightweight key-value memory (Cloudflare KV, Vercel KV, or Deno KV):

```yaml
memory:
  backend: "kv"
  # Conversation context — kept for duration of call
  conversation:
    ttl_minutes: 10
  # Client history — minimal, cross-call
  client_history:
    enabled: true
    retained_fields:
      - "first_name"
      - "preferred_stylist"
      - "last_service"
    ttl_days: 90
  # No waitlist capture on voice — redirect to web/SMS
  waitlist:
    enabled: false
```

---

## When to Use NanoClaw vs Hermes

| Factor                  | NanoClaw                     | Hermes                        |
|-------------------------|------------------------------|-------------------------------|
| Primary channel         | Voice (Vapi)                 | Web chat, SMS                 |
| Infrastructure          | Edge functions (serverless)  | Docker container (VPS)        |
| Latency                 | Ultra-low (~50ms edge)       | Low (~100-200ms)              |
| Cron jobs               | Not supported                | Supported                     |
| Persistent memory       | KV store (limited)           | SQLite/Redis/Postgres         |
| Appointment reminders   | Not supported                | Supported                     |
| Cost                    | Pay-per-invocation           | Fixed hosting + per-request   |
| Best for                | Voice-first, Agency tier     | Full-featured, all tiers      |
