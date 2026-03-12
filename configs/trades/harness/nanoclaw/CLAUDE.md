# TradeClaw — NanoClaw Claude Configuration

## Overview

NanoClaw is the lightweight, Claude-native harness for TradeClaw. It runs directly on Claude's tool-use and system prompt capabilities without external orchestration. Best suited for Pro and Agency tier clients who want rapid deployment with minimal infrastructure.

NanoClaw uses Claude as both the orchestrator and the executor — no Docker containers, no subagent routing, no cron jobs. Emergency classification happens inline within the main Claude conversation.

---

## Claude Configuration

### Model

- **Model:** claude-sonnet-4-20250514 (recommended) or claude-opus-4-20250514 (for Agency tier)
- **Temperature:** 0.2
- **Max tokens:** 2048

### System Prompt

Use the full system prompt from `skills/system_prompt.md`. Prepend the following NanoClaw-specific instructions:

```
You are running as a NanoClaw agent. You do not have access to subagents or background jobs.

IMPORTANT: You must perform emergency classification INLINE at the start of every customer message.
Before any other processing, evaluate the message against the emergency triggers listed in Section 1
of your system prompt. If the message is an emergency, follow the emergency protocol immediately.
Do not proceed with standard handling until you have confirmed the message is NOT an emergency.

Your available tools:
- knowledge_search: Search the knowledge base for pricing, services, service area, etc.
- create_service_request: Log a new service request with customer details
- send_escalation: Send emergency escalation to on-call technician
- check_service_area: Verify a zip code is in the service area
- schedule_callback: Schedule a callback from the office

You do NOT have access to:
- Direct calendar/scheduling systems (use schedule_callback to request)
- Financial or billing systems
- Dispatch board (use send_escalation for emergencies)
```

### Tool Definitions

```yaml
tools:
  - name: knowledge_search
    description: Search the TradeClaw knowledge base for services, pricing, service area, maintenance plans, and warranty info.
    parameters:
      query:
        type: string
        description: The search query
      category:
        type: string
        enum: [services, pricing, service_area, maintenance_plans, warranty, emergency_protocols]
        description: Knowledge category to search

  - name: create_service_request
    description: Create a new service request record
    parameters:
      customer_name:
        type: string
      phone:
        type: string
      email:
        type: string
      service_address:
        type: string
      zip_code:
        type: string
      issue_description:
        type: string
      property_type:
        type: string
        enum: [residential, commercial, multi_unit]
      priority:
        type: string
        enum: [emergency, standard]
      preferred_window:
        type: string
        description: Preferred appointment window

  - name: send_escalation
    description: Send an emergency escalation to the on-call technician and office manager
    parameters:
      customer_name:
        type: string
      phone:
        type: string
      service_address:
        type: string
      issue_description:
        type: string
      emergency_type:
        type: string
        enum: [gas_leak, carbon_monoxide, flooding, no_heat, no_ac, sewer_backup, electrical, other]

  - name: check_service_area
    description: Check if a zip code is within the service area
    parameters:
      zip_code:
        type: string

  - name: schedule_callback
    description: Schedule a callback from the office during business hours
    parameters:
      customer_name:
        type: string
      phone:
        type: string
      reason:
        type: string
      preferred_time:
        type: string
```

---

## Deployment Modes

### Mode 1: API-Only (Headless)

NanoClaw runs as an API endpoint. Your application sends messages and receives responses.

```python
import anthropic

client = anthropic.Anthropic()

# Load system prompt
with open("configs/trades/skills/system_prompt.md") as f:
    system_prompt = f.read()

# Replace placeholders
system_prompt = system_prompt.replace("{{COMPANY_NAME}}", "Acme HVAC")
# ... replace all placeholders

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=2048,
    temperature=0.2,
    system=system_prompt,
    messages=conversation_history,
    tools=tool_definitions,
)
```

### Mode 2: Twilio Integration

NanoClaw receives SMS/voice via Twilio webhooks and responds through the Anthropic API.

```
Twilio Webhook → Your Server → Anthropic API → Your Server → Twilio API → Customer
```

### Mode 3: Web Chat

NanoClaw powers a web chat widget via WebSocket connection.

```
Chat Widget → WebSocket → Your Server → Anthropic API → Your Server → WebSocket → Chat Widget
```

---

## Pro vs Agency Differences

| Feature | Pro | Agency |
|---|---|---|
| Model | claude-sonnet-4-20250514 | claude-opus-4-20250514 |
| Channels | SMS + Web Chat | SMS + Voice + Chat + LSA + Thumbtack |
| Knowledge base size | Up to 50 documents | Unlimited |
| Integrations | ServiceTitan or Housecall Pro | All integrations |
| Seasonal campaigns | Manual trigger | Automated via external cron |
| Multi-location | No | Yes |

---

## Limitations vs Hermes

NanoClaw is simpler but has trade-offs:

- **No subagent delegation.** Emergency classification runs inline, which means slightly higher latency on the first response (the model must classify before responding).
- **No built-in cron jobs.** Seasonal campaigns and review follow-ups must be triggered by an external scheduler (e.g., your application's cron, AWS EventBridge, GitHub Actions).
- **No Docker sandboxing.** Tool execution happens in your application's process. You are responsible for input validation and security.
- **No built-in memory persistence.** You must manage conversation history and customer memory in your application layer.

For most trades businesses, these trade-offs are acceptable. If you need subagent routing, background jobs, or sandboxed execution, use Hermes.

---

## Quick Start

1. Copy `.env.example` to `.env` and fill in values
2. Populate knowledge base from `knowledge/scaffold/` templates
3. Deploy your server with the Claude API integration
4. Configure Twilio webhooks to point to your server
5. Test emergency classification (see `harness/hermes/DEPLOY.md` Step 6 for test cases)
6. Go live
