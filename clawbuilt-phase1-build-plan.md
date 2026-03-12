# ClawBuilt Phase 1 Build Plan
## Agent-Executable Specification
### Target: Revenue-ready in 4-6 weeks

---

## Overview

This document contains everything needed to build ClawBuilt from the current v5 mockups to a revenue-generating product. Phase 1 delivers 3 vertical configs (DentalClaw, StyleClaw, TradeClaw) on Hermes Agent, a production storefront with Stripe checkout, automated config delivery, and the internal tooling to support 10 founding clients.

**Tech stack:** Next.js 14 (App Router) on Vercel, Stripe for payments, Cloudflare R2 for config storage, Resend for transactional email, Supabase for license keys and basic data, Calendly for booking (account: clawbuilt@proton.me, link: https://calendly.com/clawbuilt-proton), Slack Connect for client comms.

**Source of truth:** clawbuilt-strategy-v5.md and clawbuilt-storefront-v5.html (design reference). All pricing, copy, and product specs come from these documents.

**Build order:** Follow the numbered workstreams. Items marked [BLOCKER] must be complete before first sale. Items marked [PARALLEL] can be built simultaneously. Items marked [FAST-FOLLOW] can ship within 1 week after launch.

---

## Workstream 1: Production Storefront [BLOCKER]

### 1.1 Next.js Project Setup

**Create** a Next.js 14 App Router project deployed to Vercel.

```
clawbuilt/
  ├── app/
  │   ├── layout.tsx              # Root layout with fonts, meta, analytics
  │   ├── page.tsx                # Homepage (hero, how-it-works, security, harness, marketplace, pricing, deploy, value, founding, support, FAQ, CTA, footer)
  │   ├── audit/page.tsx          # Security Audit landing page (Phase 2, stub now)
  │   ├── migrate/page.tsx        # Harness Migration landing page (Phase 2, stub now)
  │   └── api/
  │       ├── webhook/route.ts    # Stripe webhook handler
  │       └── download/route.ts   # Signed R2 download URL generator
  ├── components/
  │   ├── Nav.tsx
  │   ├── Hero.tsx
  │   ├── HowItWorks.tsx
  │   ├── SecurityStrip.tsx
  │   ├── HarnessComparison.tsx
  │   ├── Marketplace.tsx         # Config cards with filter bar
  │   ├── ConfigCard.tsx          # Individual card with harness badge
  │   ├── PricingTiers.tsx
  │   ├── DeploySection.tsx
  │   ├── ValueComparison.tsx
  │   ├── FoundingClients.tsx
  │   ├── SupportPlans.tsx
  │   ├── FAQ.tsx
  │   ├── CTABanner.tsx
  │   └── Footer.tsx
  ├── lib/
  │   ├── stripe.ts               # Stripe client + product/price IDs
  │   ├── supabase.ts             # Supabase client
  │   ├── resend.ts               # Email sending
  │   └── r2.ts                   # Cloudflare R2 signed URLs
  ├── data/
  │   └── verticals.ts            # Vertical config metadata (names, prices, descriptions, integrations, harness badges)
  └── public/
      └── og-image.png            # Open Graph image for social sharing
```

**Design reference:** Port the v5 HTML mockup (clawbuilt-storefront-v5.html) faithfully. Preserve:
- Color system: --bg #0a0a0f, --surface #111118, --gold #e8a830, --green #2fd472, --text #f0eee8, --muted #7a7a8a
- Typography: Syne (headings, 800 weight) + DM Sans (body, 300/400/500)
- Dark theme with gold accent throughout
- Subtle grid background on hero, gold glow radial gradient
- All animations (fadeUp on hero elements, pulse on status dot)
- Harness badge colors: purple (#a78bfa) for Hermes Agent, green for NanoClaw, blue (#3a9fff) for OpenClaw

**Functional requirements:**
- Filter bar on marketplace section actually filters config cards by category using data-category attributes
- FAQ accordion opens/closes with smooth animation
- All anchor links scroll smoothly to sections
- Nav is fixed with backdrop blur, collapses to hamburger on mobile
- Fully responsive: 3-col grids collapse to 1-col on mobile, pricing cards stack, nav becomes mobile menu
- Calendly popup widget on all "Book a Call" CTAs (see WS-6 for embed code)
- "Get Config" and tier buttons link to Stripe checkout (see Workstream 2)

**SEO requirements:**
- Title: "ClawBuilt -- AI Agents Built for Your Industry"
- Meta description: "Production-ready AI agent configs for dental offices, salons, HVAC, law firms, and more. Security-hardened. Multi-framework. Live before dinner."
- Open Graph image, Twitter card meta
- Structured data (Organization, Product) where appropriate
- Semantic HTML (sections, nav, main, footer)

**Acceptance criteria:**
- [ ] Deployed to Vercel at clawbuilt.ai
- [ ] All sections from v5 mockup rendered correctly
- [ ] Filter bar filters config cards
- [ ] FAQ accordion works
- [ ] Mobile responsive (test at 375px, 768px, 1024px, 1440px)
- [ ] Lighthouse performance > 90, accessibility > 90
- [ ] All CTAs wired (checkout or Calendly popup widget)

### 1.2 Domain & DNS

- Domain: clawbuilt.ai (already registered)
- Point DNS to Vercel
- SSL auto-provisioned by Vercel
- Set up email forwarding: hello@clawbuilt.ai, support@clawbuilt.ai (forward to personal email initially)

---

## Workstream 2: Stripe Payments [BLOCKER]

### 2.1 Stripe Product Catalog

Create the following products and prices in Stripe (live mode). Use metadata fields to link products to delivery logic.

**Config Products (one-time):**

| Stripe Product Name | Price | Metadata |
|---|---|---|
| DentalClaw - Starter | $497 | vertical: dental, tier: starter, harness: hermes |
| DentalClaw - Pro | $997 | vertical: dental, tier: pro, harness: hermes |
| DentalClaw - Agency | $1,497 | vertical: dental, tier: agency, harness: hermes |
| StyleClaw - Starter | $497 | vertical: style, tier: starter, harness: hermes |
| StyleClaw - Pro | $997 | vertical: style, tier: pro, harness: hermes |
| StyleClaw - Agency | $1,497 | vertical: style, tier: agency, harness: hermes |
| TradeClaw - Starter | $497 | vertical: trades, tier: starter, harness: hermes |
| TradeClaw - Pro | $997 | vertical: trades, tier: pro, harness: hermes |
| TradeClaw - Agency | $1,497 | vertical: trades, tier: agency, harness: hermes |

**Add-on Products (one-time):**

| Stripe Product Name | Price | Metadata |
|---|---|---|
| Guided Setup | $597 | type: addon, service: guided-setup |
| Done Install | $2,497 | type: addon, service: done-install |
| Custom Tuning | $4,497 | type: addon, service: custom-tuning |
| Security Audit | $997 | type: addon, service: security-audit |
| Harness Migration | $1,497 | type: addon, service: harness-migration |

**Support Products (recurring):**

| Stripe Product Name | Price | Metadata |
|---|---|---|
| Watchdog Retainer | $349/mo | type: retainer, plan: watchdog |
| Guardian Retainer | $699/mo | type: retainer, plan: guardian |
| Command Retainer | $1,299/mo | type: retainer, plan: command |

**Block Hour Products (one-time):**

| Stripe Product Name | Price | Metadata |
|---|---|---|
| Block Hours - 5hr | $575 | type: block, hours: 5 |
| Block Hours - 10hr | $1,100 | type: block, hours: 10 |
| Block Hours - 20hr | $2,000 | type: block, hours: 20 |
| Block Hours - 40hr | $3,800 | type: block, hours: 40 |

**Founding Client Coupon:**
- Code: FOUNDING50
- 50% off, one-time use per customer, limited to 10 redemptions
- Valid on config products and add-on services

### 2.2 Checkout Flow

Use Stripe Checkout (hosted) for simplicity at launch. Flow:

1. User clicks "Get Config" or tier button on storefront
2. Redirect to Stripe Checkout with the selected config product pre-loaded
3. Checkout page allows adding one optional add-on (Guided Setup, Done Install, or Custom Tuning) via Stripe line items
4. On successful payment, Stripe fires webhook to /api/webhook

**Implementation notes:**
- Use Stripe Checkout Sessions API with `mode: 'payment'` for one-time products
- For add-ons, present as optional upsell on the checkout page using `line_items` with `adjustable_quantity`
- Support plan purchases (retainers) use `mode: 'subscription'`
- Block hours use `mode: 'payment'`
- Store Stripe Customer ID in Supabase for future portal association

### 2.3 Stripe Webhook Handler

**Endpoint:** `/api/webhook` (POST)

**On `checkout.session.completed` event:**

1. Extract customer email, product metadata (vertical, tier, harness), and any add-ons purchased
2. Generate a unique license key (UUID v4)
3. Store in Supabase `licenses` table:
   ```
   {
     id: uuid,
     email: string,
     stripe_customer_id: string,
     stripe_session_id: string,
     vertical: string,          // 'dental' | 'style' | 'trades'
     tier: string,              // 'starter' | 'pro' | 'agency'
     harness: string,           // 'hermes' | 'nanoclaw' | 'openclaw'
     license_key: string,       // UUID v4
     addons: jsonb,             // [{service: 'done-install', price: 2497}]
     created_at: timestamp,
     download_count: integer,   // Track downloads, default 0
     download_limit: integer    // Default 5
   }
   ```
4. Generate a signed R2 download URL for the config ZIP (see Workstream 3)
5. Send purchase confirmation + download link email via Resend (see Workstream 5)
6. If add-on service purchased (Guided Setup, Done Install, Custom Tuning), send internal notification to Slack #new-sales channel with client details

**On `customer.subscription.created` event (retainers):**
1. Store in Supabase `subscriptions` table
2. Send retainer activation email via Resend
3. Notify Slack #new-sales

**Acceptance criteria:**
- [ ] All products created in Stripe with correct metadata
- [ ] Checkout flow works for config + optional add-on
- [ ] Webhook processes payments and stores license in Supabase
- [ ] Download URL generated and emailed on successful purchase
- [ ] Internal Slack notification fires on every sale
- [ ] FOUNDING50 coupon works and limits to 10 uses

---

## Workstream 3: Config Bundle Delivery [BLOCKER]

### 3.1 Cloudflare R2 Bucket Setup

**Bucket:** `clawbuilt-configs`

**Structure:**
```
clawbuilt-configs/
  ├── dental/
  │   ├── dental-claw-starter.zip
  │   ├── dental-claw-pro.zip
  │   └── dental-claw-agency.zip
  ├── style/
  │   ├── style-claw-starter.zip
  │   ├── style-claw-pro.zip
  │   └── style-claw-agency.zip
  └── trades/
      ├── trades-claw-starter.zip
      ├── trades-claw-pro.zip
      └── trades-claw-agency.zip
```

**Access:** Private. All downloads via signed URLs only (1-hour expiry, generated by webhook handler).

### 3.2 Download Endpoint

**Endpoint:** `/api/download` (GET)

**Parameters:** `?license_key=<uuid>&email=<email>`

**Logic:**
1. Validate license key + email match in Supabase
2. Check download_count < download_limit
3. Increment download_count
4. Generate fresh signed R2 URL (1-hour expiry)
5. Redirect to signed URL
6. On failure: return error page with support contact

### 3.3 Config ZIP Contents

Each ZIP follows this structure (per v5 strategy):

```
/[vertical]-claw-[tier]/
  ├── skills/
  │   ├── SKILL.md                 # agentskills.io portable skill definition
  │   ├── system_prompt.md         # Tuned system prompt
  │   └── persona.md               # Brand voice guide
  ├── harness/
  │   └── hermes/                  # Starter: default harness only
  │       ├── hermes-config.yaml   # Hermes Agent configuration
  │       ├── memory-config.yaml   # Memory system configuration
  │       └── DEPLOY.md            # Step-by-step deployment guide
  ├── integrations/
  │   ├── [integration-1].md       # Per-integration setup guide
  │   └── ...
  ├── security/
  │   ├── hardening-checklist.md   # Docker sandbox, firewall, permissions
  │   └── composio-setup.md        # OAuth middleware guide
  ├── knowledge/
  │   └── scaffold/                # Template KB files client fills in
  │       ├── services.md
  │       ├── policies.md
  │       ├── faq-template.md
  │       └── ...
  ├── .env.example
  └── SETUP.md                     # Quick-start: "Do this first"
```

**Pro and Agency tiers add:**
```
  ├── harness/
  │   ├── hermes/                  # (same as Starter)
  │   ├── nanoclaw/                # NanoClaw alternative deployment
  │   │   ├── CLAUDE.md
  │   │   └── DEPLOY.md
  │   └── openclaw/                # OpenClaw alternative deployment
  │       ├── openclaw.yaml
  │       ├── routing.yaml
  │       └── DEPLOY.md
```

**Pro adds over Starter:** 2 additional integration guides (3 total), knowledge base scaffold, model routing config (routing.yaml for cost/performance optimization).

**Agency adds over Pro:** White-label README with brand replacement instructions, multi-location config variant, reseller license text file.

**Detailed config content specs are in Workstream 4.**

---

## Workstream 4: Vertical Config Content [BLOCKER -- need at least 1 complete]

This is the core IP. Each config must be built and tested on Hermes Agent before bundling into ZIPs.

### 4.1 DentalClaw (Priority 1 -- build first, sets the template)

**SKILL.md (agentskills.io format):**
```yaml
name: DentalClaw
description: AI agent for dental office front desk automation
version: 1.0.0
author: ClawBuilt
tags: [dental, healthcare, HIPAA, scheduling, intake]
```

**system_prompt.md:**

Write a system prompt that instructs the agent to act as a dental office virtual front desk assistant. Must include:
- Identity: "You are [Practice Name]'s virtual assistant." (client fills in practice name)
- Capabilities: appointment scheduling inquiries, new patient intake form guidance, insurance verification questions, service/procedure explanations, office hours and location, after-hours message capture
- PHI firewall: "Never collect, store, repeat, or reference specific patient health information including diagnoses, treatment plans, medications, or medical history. If a caller mentions specific health details, acknowledge without repeating them and redirect to scheduling or direct them to call the office."
- Tone: Warm, professional, reassuring. Not overly casual. Not clinical.
- Boundaries: Cannot diagnose, cannot guarantee coverage, cannot modify appointments directly (read-only calendar by default), cannot access billing/financial systems
- Escalation: "If the caller's request is outside your capabilities, offer to take a message and ensure the office manager will follow up within one business day."
- Compliance footer: Append a brief disclaimer to complex medical or insurance questions directing the caller to verify with their provider

**persona.md:**
- Default persona: "Helpful, professional front desk coordinator"
- Tone calibration knobs the client can adjust: formality (1-5 scale), warmth (1-5), verbosity (1-5)
- Example adjustments for different practice types (pediatric = warmer, oral surgery = more formal)

**knowledge/scaffold/:**
- `services.md` -- Template: list all services offered with brief descriptions and typical durations
- `insurance.md` -- Template: list accepted insurance plans, verification process, out-of-network policy
- `policies.md` -- Template: cancellation policy, late arrival policy, payment policy, emergency protocol
- `procedures-faq.md` -- Template: common patient questions about cleanings, x-rays, crowns, root canals, whitening, implants
- `financing.md` -- Template: payment plan options, CareCredit, in-house financing details
- `team.md` -- Template: dentist bios, hygienist bios, office manager contact

**integrations/ (Starter gets 1, Pro gets 3):**
- `dentrix.md` -- Step-by-step guide to connecting Hermes Agent with Dentrix via API or webhook. Read-only calendar access setup. Appointment status lookup.
- `nexhealth.md` -- NexHealth API integration for online booking redirect, appointment status, patient messaging.
- `google-calendar.md` -- Google Calendar API setup for appointment viewing. Read-only scope. OAuth walkthrough.
- `birdeye.md` -- Birdeye review request trigger integration. Post-appointment review solicitation workflow.
- `eaglesoft.md` -- Eaglesoft integration notes (more limited API, may require middleware).

**hermes/hermes-config.yaml:**
```yaml
# DentalClaw - Hermes Agent Configuration
# Generated by ClawBuilt | clawbuilt.ai

agent:
  name: "DentalClaw"
  description: "Dental office virtual front desk assistant"

model:
  provider: "openrouter"          # Change to nous, openai, anthropic as needed
  model: "anthropic/claude-sonnet-4-20250514"  # Recommended for HIPAA precision
  temperature: 0.3                # Low temp for consistent, compliant responses
  max_tokens: 1024

memory:
  enabled: true
  persist_skills: true            # Agent creates skills from repeated tasks
  session_search: true            # Search past conversations for context

gateway:
  platforms:                      # Enable the platforms your practice uses
    # - telegram
    # - discord
    - slack                       # Recommended for internal team
    # - whatsapp                  # Enable for patient-facing

tools:
  enabled:
    - web_search
    - calendar_read               # Read-only by default
    - file_system
    - memory
    - task_planning
    - cron_jobs                   # For recall reminders, follow-ups

security:
  sandbox: docker
  docker:
    read_only_root: true
    drop_capabilities: true
    pid_limit: 100
    network_mode: "bridge"        # Restrict network access

scheduling:
  # Example cron jobs - customize per practice
  # morning_briefing: "0 7 * * 1-5"    # Weekday 7am summary
  # recall_check: "0 9 * * 1"          # Weekly recall reminder check
```

**hermes/memory-config.yaml:**
```yaml
# DentalClaw Memory Configuration
memory:
  nudge_interval: 300             # Seconds between memory persistence nudges
  skill_creation: auto            # Auto-create skills from solved problems
  user_modeling: true             # Build understanding of practice patterns
  retention:
    conversations: 90             # Days to retain conversation history
    skills: permanent             # Skills persist indefinitely
```

**security/hardening-checklist.md:**

Step-by-step checklist:
1. Docker container setup with read-only root filesystem
2. Drop all Linux capabilities except NET_BIND_SERVICE
3. Set PID limit to 100
4. Enable namespace isolation
5. Configure UFW: allow only required outbound ports (443 for API calls, messaging platform ports)
6. Set up Composio OAuth for any integration that touches patient data
7. Verify .env file permissions (chmod 600)
8. Enable audit logging for all patient-facing interactions
9. Test: attempt to access host filesystem from container (should fail)
10. Test: attempt to run unauthorized shell command (should fail)

**security/composio-setup.md:**

Guide for setting up Composio as OAuth middleware:
1. Create Composio account
2. Configure OAuth connections for each integration (Dentrix, NexHealth, etc.)
3. Set permission scopes (read-only calendar, read-only patient status)
4. Generate API keys for Hermes Agent to use
5. Configure token refresh automation
6. Set up revocation procedure ("kill switch" for all integrations)

**.env.example:**
```bash
# DentalClaw Environment Configuration
# Copy this to .env and fill in your values

# Model Provider (choose one)
OPENROUTER_API_KEY=your_openrouter_key_here
# NOUS_PORTAL_TOKEN=your_nous_token_here
# ANTHROPIC_API_KEY=your_anthropic_key_here

# Messaging (enable what you use)
# TELEGRAM_BOT_TOKEN=
# SLACK_BOT_TOKEN=
# WHATSAPP_API_KEY=

# Integrations
# DENTRIX_API_KEY=
# NEXHEALTH_API_KEY=
# GOOGLE_CALENDAR_CREDENTIALS_PATH=./credentials.json
# BIRDEYE_API_KEY=

# Composio OAuth (recommended)
# COMPOSIO_API_KEY=

# Practice Details (used in system prompt)
PRACTICE_NAME="Your Dental Practice"
PRACTICE_PHONE="(555) 123-4567"
PRACTICE_ADDRESS="123 Main St, City, ST 12345"
PRACTICE_HOURS="Mon-Fri 8am-5pm, Sat 9am-1pm"
PRACTICE_WEBSITE="https://yourpractice.com"
```

**SETUP.md:**
```markdown
# DentalClaw Quick Start

## Prerequisites
- A server or VPS (DigitalOcean, Hetzner, or local Mac Mini)
- Docker installed
- An API key from OpenRouter, Nous Portal, Anthropic, or OpenAI

## Setup (15 minutes)

1. Install Hermes Agent:
   curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash

2. Copy .env.example to .env and fill in your values:
   cp .env.example .env
   nano .env

3. Copy the DentalClaw config:
   cp hermes/hermes-config.yaml ~/.hermes/config.yaml
   cp hermes/memory-config.yaml ~/.hermes/memory.yaml

4. Copy your system prompt:
   cp skills/system_prompt.md ~/.hermes/system_prompt.md

5. Fill in your knowledge base:
   Edit each file in knowledge/scaffold/ with your practice details

6. Run the security hardening checklist:
   Follow security/hardening-checklist.md step by step

7. Start Hermes Agent:
   hermes

8. (Optional) Set up messaging gateway:
   hermes gateway setup
   hermes gateway install

## Next Steps
- Test the agent with sample patient questions
- Expand permissions gradually as trust builds
- See the integration guides in integrations/ for connecting your practice software
```

### 4.2 StyleClaw (Priority 2)

Same structure as DentalClaw but tuned for salon/barbershop:
- System prompt: booking assistance, service menu, stylist bios, product recommendations. Persona toggle between luxury salon (formal, aspirational) and neighborhood barbershop (casual, friendly).
- No PHI firewall needed. Standard hardening.
- Knowledge scaffold: services + pricing, team bios with specialties, product lines, cancellation policy, parking/access info
- Integrations: Vagaro (Starter), + Square Appointments, Booksy (Pro), + Boulevard (Agency)
- Model recommendation: OpenRouter with a cost-effective model (e.g., Claude Haiku or GPT-4o-mini) since salon queries are simpler than medical

### 4.3 TradeClaw (Priority 3)

Same structure tuned for HVAC/plumbing/trades:
- System prompt: emergency vs. standard routing classifier (critical -- agent must detect "no heat," "gas smell," "flooding" as emergencies and route differently). Quote request capture. Service area verification by zip code. Seasonal campaign support (AC tune-up in spring, furnace check in fall).
- Knowledge scaffold: services, service area zip codes, pricing ranges, maintenance plan details, warranty info, emergency protocols
- Integrations: ServiceTitan (Starter), + Housecall Pro, Google LSA (Pro), + Thumbtack (Agency)
- Model recommendation: OpenRouter with a balanced model. Emergency classification needs reliable reasoning.

---

## Workstream 5: Transactional Email [BLOCKER]

### 5.1 Resend Setup

- Create Resend account
- Verify sending domain: clawbuilt.ai (DNS records: SPF, DKIM, DMARC)
- Set up from address: hello@clawbuilt.ai

### 5.2 Email Templates

**Template 1: Purchase Confirmation + Download Link**

Subject: "Your [VerticalName] config is ready"

Body:
- Thank you for purchasing [VerticalName] [Tier]
- License key: [KEY]
- Download link: [SIGNED_URL] (expires in 1 hour, 5 downloads max)
- Quick start: follow SETUP.md in the ZIP
- If you purchased an add-on service: "We'll reach out within 24 hours to schedule your [Guided Setup / Done Install / Custom Tuning]"
- Support: reply to this email or Slack us

**Template 2: ActiveCare Onboarding Checklist** (sent with Done Install / Custom Tuning purchases)

Subject: "Your 14-Day ActiveCare starts now"

Body:
- What to expect: daily check-ins days 1-3, expand and tune week 2, handoff call day 14
- Your dedicated Slack channel: [LINK]
- Calendar link to schedule your deployment session

**Template 3: Internal Sales Notification** (sent to Slack #new-sales via Resend or Slack webhook)

Content:
- New purchase: [VerticalName] [Tier] ($[AMOUNT])
- Add-ons: [LIST]
- Customer: [EMAIL]
- Action needed: [If add-on service, schedule deployment session]

---

## Workstream 6: Booking Integration [BLOCKER]

### 6.1 Calendly Setup [ACCOUNT LIVE — embed code ready]

**Account:** clawbuilt@proton.me | **Booking link:** https://calendly.com/clawbuilt-proton
**Current event:** "30 Minute Meeting" (Phone call, Weekdays 9am–5pm PT) — rename/duplicate for each type below.

**Booking types to create:**

| Type | Duration | Purpose |
|---|---|---|
| Free Scoping Call | 15 min | Pre-sale consultation, harness recommendation |
| Guided Setup Session | 90 min | Paid screenshare deployment |
| Done Install Kickoff | 30 min | Pre-deployment scoping for Done Install clients |
| Custom Tuning Kickoff | 45 min | Pre-deployment scoping + brand voice discussion |

**Configuration:**
- Integrate with Google Calendar for availability
- Confirmation emails with prep instructions
- Reminder emails 24 hours and 1 hour before

**Popup widget embed code (paste into `<head>` or before `</body>` in layout.tsx):**

```html
<!-- Calendly badge widget begin -->
<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
<script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>
<script type="text/javascript">window.onload = function() { Calendly.initBadgeWidget({ url: 'https://calendly.com/clawbuilt-proton', text: 'Book a Call', color: '#0069ff', textColor: '#ffffff', branding: false }); }</script>
<!-- Calendly badge widget end -->
```

**Note:** Change `text` to `'Book a Call'` and `branding: false` (removes "Powered by Calendly" on free plan). Wire all "Book a Call" CTAs site-wide to `https://calendly.com/clawbuilt-proton` as the href fallback.

---

## Workstream 7: Supabase Schema [BLOCKER]

### 7.1 Database Tables

```sql
-- Licenses table
create table licenses (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  stripe_customer_id text,
  stripe_session_id text unique,
  vertical text not null,           -- 'dental' | 'style' | 'trades'
  tier text not null,               -- 'starter' | 'pro' | 'agency'
  harness text not null default 'hermes',
  license_key uuid default gen_random_uuid(),
  addons jsonb default '[]',
  download_count integer default 0,
  download_limit integer default 5,
  created_at timestamptz default now()
);

-- Subscriptions table (retainers)
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  plan text not null,               -- 'watchdog' | 'guardian' | 'command'
  status text default 'active',
  hours_included integer,
  hours_used_this_month integer default 0,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now()
);

-- Block hours table
create table block_hours (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  stripe_customer_id text,
  hours_purchased integer not null,
  hours_used integer default 0,
  purchase_price integer not null,  -- cents
  purchased_at timestamptz default now(),
  expires_at timestamptz            -- 12 months from purchase
);

-- Indexes
create index idx_licenses_email on licenses(email);
create index idx_licenses_key on licenses(license_key);
create index idx_subscriptions_email on subscriptions(email);
create index idx_block_hours_email on block_hours(email);
```

### 7.2 Row Level Security

Enable RLS on all tables. For Phase 1, only the webhook service role needs write access. Public access is read-only via license key validation on the download endpoint.

---

## Workstream 8: Internal Deployment Playbook [BLOCKER for Done Install clients]

### 8.1 Hermes Agent Deployment Playbook

Create a Notion doc (or markdown) with step-by-step SOPs:

**Pre-deployment (30 min before session):**
1. Confirm VPS is provisioned (DigitalOcean/Hetzner, minimum 2GB RAM, 1 vCPU)
2. Confirm SSH access works
3. Confirm client's .env values are ready (API keys, practice details)
4. Confirm which messaging platforms to configure
5. Confirm which integrations to wire

**Deployment (the session itself):**
1. SSH into VPS
2. Install Hermes Agent via one-liner
3. Copy client's config files (hermes-config.yaml, memory-config.yaml, system_prompt.md, persona.md)
4. Copy knowledge base files (client should have filled in scaffold templates)
5. Set up Docker container with hardening (read-only root, dropped caps, PID limits, namespace isolation)
6. Configure .env with client's API keys
7. Configure messaging gateway (Telegram/Slack/WhatsApp per client preference)
8. Run `hermes gateway setup` and `hermes gateway install`
9. Test: send test messages from each configured platform
10. Test: ask sample questions matching the vertical (booking inquiry, FAQ, edge case)
11. Test: verify security boundaries (attempt to access out-of-scope data, should refuse)
12. Configure monitoring (UptimeRobot ping on gateway process)
13. Set up health check cron job
14. Create Slack Connect channel for client

**Post-deployment (ActiveCare begins):**
1. Send ActiveCare onboarding email
2. Day 1: Confirm agent is live and responding
3. Days 2-3: Daily Slack check-in, review any edge cases
4. Week 2: Expand permissions if appropriate, add workflows
5. Day 14: Handoff call, deliver handoff documentation

### 8.2 Client Handoff Documentation Template

Notion template with these sections:
- Deployment summary (date, harness, VPS provider, IP, domain if applicable)
- Security configuration (sandbox type, firewall rules, OAuth scopes)
- Integrations wired (list with status and credential locations)
- Messaging platforms configured (with bot usernames/IDs)
- Monitoring setup (UptimeRobot URL, health check cron schedule)
- Knowledge base location and how to update it
- How to restart the agent
- Escalation: how to reach ClawBuilt support
- Next steps: recommended support plan

---

## Workstream 9: Support Infrastructure [PARALLEL]

### 9.1 Slack Workspace

- Create ClawBuilt Slack workspace (or use existing)
- Channel naming convention: #client-[name]-[vertical] (e.g., #client-smith-dental)
- Internal channels: #new-sales, #deployments, #support-queue
- Configure Slack Connect for client channels
- Create channel template with pinned message: "Welcome to your ClawBuilt support channel. Your ActiveCare period runs [DATE] to [DATE]. Response times: [SLA per plan]."

### 9.2 Support Tracker

Notion database (upgrade to proper tooling in Phase 3):
- Client name, email
- Vertical, tier, harness
- Support plan (retainer tier or block hours)
- Hours remaining / balance
- SLA tier (48hr / 24hr / 4hr)
- Deployment date
- ActiveCare end date
- Last health check date
- Notes

---

## Workstream 10: Affiliate Program [FAST-FOLLOW]

### 10.1 Rewardful or Affonso Setup

- Create account
- Configure commission structure: 15% on config purchase, 10% on add-on services within 90 days
- Generate affiliate signup page
- Create affiliate onboarding doc: how referral links work, commission structure, payout schedule
- Integrate tracking with Stripe (Rewardful has native Stripe integration)

---

## Workstream 11: Launch Content [FAST-FOLLOW]

### 11.1 Educational Pages (3 pages)

Build as static pages on clawbuilt.ai/blog/ or clawbuilt.ai/learn/:

1. "What is Hermes Agent for dental offices?" -- Explains what an AI agent does, how DentalClaw works, what problems it solves, cost comparison vs. receptionist, CTA to buy or book a call.

2. "What is Hermes Agent for salons?" -- Same format, salon vertical.

3. "What is Hermes Agent for HVAC?" -- Same format, trades vertical.

### 11.2 Framework Comparison Page (1 page)

"OpenClaw alternatives for small businesses" -- Positions ClawBuilt as the multi-harness answer. Compares OpenClaw security issues vs. Hermes Agent and NanoClaw. CTA to book a call.

---

## Workstream 12: Legal [BLOCKER -- need ToS before first sale]

### 12.1 Terms of Service

Cover:
- Config license: one license per purchase, non-transferable (except Agency tier reseller rights)
- Delivery: digital download, no physical goods
- Refund: full refund within 14 days on configs; scope-based refund on services
- Liability: configs are tools, not guarantees of regulatory compliance; client responsible for HIPAA/legal compliance in their jurisdiction
- Support plans: terms of retainer, block hour expiration (12 months), SLA definitions

### 12.2 Refund Policy

Codify the guarantee from v5 strategy:
- Configs: 14-day full refund, no questions
- Services: full refund if we cannot deliver on agreed scope/timeline
- Block hours: pro-rata refund within 30 days if unused
- Retainers: no refund on billed months, cancel anytime for future months

### 12.3 Privacy Policy

Standard CCPA/GDPR-compliant privacy policy covering:
- What data we collect (email, payment info via Stripe, deployment details)
- How we use it (deliver products, provide support, send transactional emails)
- Third parties (Stripe, Supabase, Resend, Cloudflare)
- Data retention
- Rights (access, deletion, portability)

---

## Dependency Map

```
Workstream 7 (Supabase) ──┐
                           ├── Workstream 2 (Stripe) ── Workstream 1 (Storefront) ── LAUNCH
Workstream 5 (Email)   ────┤
Workstream 3 (R2/Delivery)─┤
Workstream 4 (Configs)  ───┘      (need at least DentalClaw complete)
Workstream 6 (Booking)  ────────── LAUNCH (independent, just needs CTAs wired)
Workstream 8 (Playbook) ────────── First Done Install client (not needed for self-serve sales)
Workstream 12 (Legal)   ────────── LAUNCH (ToS must exist, can be simple initially)

PARALLEL (anytime):
Workstream 9 (Slack/Support)
Workstream 10 (Affiliates)
Workstream 11 (Content)
```

---

## Launch Checklist

Before announcing the Founding Client Program:

- [ ] Storefront live at clawbuilt.ai with all sections working
- [ ] Stripe checkout functional for all 3 verticals x 3 tiers
- [ ] FOUNDING50 coupon active (50% off, 10 uses)
- [ ] At least DentalClaw config bundle complete and uploaded to R2
- [ ] Webhook processes payment and sends download email
- [ ] Download link works and delivers correct ZIP
- [ ] Calendly booking live for all 4 booking types (account live, embed code in WS-6)
- [ ] Terms of service and refund policy pages live
- [ ] Privacy policy page live
- [ ] Slack workspace ready with #new-sales channel
- [ ] Hermes Agent deployment playbook documented
- [ ] Client handoff template created
- [ ] hello@clawbuilt.ai receiving email
- [ ] Test end-to-end: buy config with test card, receive email, download ZIP, verify contents
