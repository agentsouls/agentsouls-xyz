---
name: DentalClaw
description: AI agent for dental office front desk automation
version: 1.0.0
author: ClawBuilt
license: Commercial
website: https://clawbuilt.ai
tags: [dental, healthcare, HIPAA, scheduling, intake, insurance]
capabilities:
  - Appointment scheduling inquiries
  - New patient intake form guidance
  - Insurance verification questions
  - Service and procedure explanations
  - Office hours and location info
  - After-hours message capture
  - Recall reminder management
---

# DentalClaw — AI Front Desk Agent for Dental Offices

DentalClaw is a HIPAA-aware virtual front desk assistant purpose-built for dental
practices. It handles inbound patient inquiries via phone, web chat, and SMS,
covering scheduling, insurance questions, service explanations, and office
logistics — without ever collecting or storing protected health information.

## Target Practices

- General & family dentistry
- Pediatric dental offices
- Oral surgery practices
- Cosmetic & aesthetic dentistry
- Multi-location dental groups

## Key Differentiators

1. **PHI Firewall** — Strict guardrails prevent the agent from collecting,
   storing, repeating, or referencing specific patient health information.
   Conversations are steered toward scheduling and general information.

2. **PMS Integration Ready** — Pre-built connectors for Dentrix, Eaglesoft,
   and NexHealth allow read-only calendar access and appointment status checks
   without exposing clinical data.

3. **Persona Tuning** — Tone knobs let practices dial warmth, formality, and
   verbosity to match their brand — from a playful pediatric office to a
   buttoned-up oral surgery center.

4. **Multi-Channel** — Works across inbound phone (via Twilio/Vonage), website
   chat widget, SMS, and Facebook Messenger with a single configuration.

5. **After-Hours Capture** — When the office is closed, DentalClaw captures
   caller intent, urgency level, and callback preference, then delivers a
   structured summary to the office the next morning.

6. **Recall & Reactivation** — Integrates with recall lists to send gentle
   reminders for overdue cleanings, pending treatment, and annual exams.

## Harness Compatibility

| Harness       | Status    | Notes                            |
|---------------|-----------|----------------------------------|
| Hermes Agent  | Default   | Full feature support             |
| NanoClaw      | Supported | Pro/Agency tier, Claude native   |
| OpenClaw      | Supported | Open-weight models, self-hosted  |

## File Layout

```
configs/dental/
├── skills/
│   ├── SKILL.md              # This file
│   ├── system_prompt.md      # Core system prompt
│   └── persona.md            # Brand voice & tone guide
├── harness/
│   ├── hermes/               # Hermes Agent configuration
│   ├── nanoclaw/             # NanoClaw (Claude) configuration
│   └── openclaw/             # OpenClaw (open-weight) configuration
├── integrations/             # PMS & third-party connectors
├── security/                 # Hardening & compliance
├── knowledge/
│   └── scaffold/             # Editable knowledge base templates
├── .env.example              # Environment variable template
└── SETUP.md                  # Quick-start deployment guide
```

## Licensing

DentalClaw is a commercial product of ClawBuilt. Each deployment requires a
valid ClawBuilt license key. See https://clawbuilt.ai/pricing for current plans.

## Support

- Documentation: https://docs.clawbuilt.ai/dental
- Email: support@clawbuilt.ai
- Slack: https://clawbuilt.slack.com (customer channel)
