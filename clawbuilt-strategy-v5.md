# ClawBuilt: Multi-Harness AI Agent Deployment Agency
## Business Strategy, Pricing, Architecture & Product Catalog
### v5 -- Hermes Agent Default + Multi-Harness Architecture

---

## 1. Business Model Overview

ClawBuilt is a vertical AI deployment partner that builds, deploys, and manages AI agents for SMBs. Unlike competitors locked to a single framework, ClawBuilt is **harness-agnostic** -- matching the right agent framework to each client's security requirements, integration needs, and budget.

**Competitive landscape:**
- **ClawMart** (shopclawmart.com) -- generic download store, OpenClaw-only, no vertical specificity, no services, $0-$99 configs
- **SetupClaw** (setupclaw.com) -- white-glove exec/startup deployment, OpenClaw-only, $3K-$6K floor, no SMB configs, no marketplace
- **LushBinary, Dextralabs, etc.** -- emerging multi-harness deployment shops, but no vertical configs, no SMB focus

ClawBuilt owns a lane none of them occupy: **vertical-specific configs + multi-harness deployment + ongoing managed support**, positioned as a premium vertical AI deployment partner.

The name signals the positioning: these are agents *built* for your industry, on the best harness for your needs. Not templates. Not generic downloads. Not locked to one framework. Built.

**Side A -- Configuration Marketplace**
Pre-built, vertical-specific AI agent configurations sold as tiered packages. Configs are packaged using the agentskills.io open standard (portable SKILL.md files) with harness-specific deployment guides for Hermes Agent (default), NanoClaw, and OpenClaw. Buyers get downloadable config bundles with system prompts, tool definitions, integration templates, .env scaffolds, and deployment docs. Delivery is self-serve by default with optional paid onboarding add-ons at checkout.

**Side B -- Agency Services**
Custom deployments, hardened installs, ongoing support plans (retainer + block hours). This is the recurring revenue engine and the relationship layer that turns one-time config buyers into long-term clients.

---

## 2. Harness Strategy

### 2a. Why Multi-Harness

The AI agent framework space fragmented rapidly in early 2026. OpenClaw (210K+ GitHub stars) proved the concept but carries significant security baggage: the ClawHavoc supply chain attack compromised 9,000+ installations, its founder left for OpenAI, and the project is now community-governed under an independent foundation. Meanwhile, NanoClaw, ZeroClaw, Hermes Agent, and others have emerged with stronger security models, smaller codebases, and in some cases better technical foundations.

Locking to a single framework is a strategic risk. The framework that wins the ecosystem war may not be the one with the most GitHub stars today. By going multi-harness, ClawBuilt:
- Neutralizes the "OpenClaw security" objection that kills sales to regulated verticals
- Widens the moat against single-framework competitors (ClawMart, SetupClaw)
- Protects config IP investment via the agentskills.io portable format
- Matches the right tool to the right deployment rather than forcing a one-size-fits-all approach

### 2b. The Three Supported Harnesses

**Hermes Agent (Default -- most deployments)**

Built by Nous Research, the lab behind the Hermes, Nomos, and Psyche model families. This is not an OpenClaw fork. It is a ground-up Python agent framework with the strongest combination of features for ClawBuilt's use case:

- *Self-improving memory system:* The only agent with a built-in learning loop. It creates skills from experience, improves them during use, nudges itself to persist knowledge, and builds a deepening model of the user across sessions. For an HVAC company, this means the agent learns their specific service area patterns, seasonal trends, and repeat customer behaviors over time.
- *Five sandboxing backends:* Local, Docker, SSH, Singularity, and Modal. Container security includes read-only root, dropped capabilities, PID limits, and namespace isolation. Stronger than NanoClaw's container model, dramatically stronger than OpenClaw's application-level checks.
- *Model-agnostic:* Works with Nous Portal, OpenRouter (200+ models), OpenAI, Anthropic, or any custom endpoint. Switch models with a single command. This enables per-vertical model routing -- CounselClaw on Claude for legal precision, StyleClaw on a cheaper model for booking tasks.
- *Messaging gateway:* Telegram, Discord, Slack, WhatsApp, and CLI from a single process. Voice memo transcription. Cross-platform session continuity.
- *Skills ecosystem:* 40+ built-in skills, compatible with agentskills.io open standard plus ClawHub, LobeHub, and Claude Code Marketplace. Skills are sandboxed with quarantine and audit systems.
- *Subagent delegation:* Spawn isolated subagents for parallel workstreams, each with its own conversation and terminal. Enables multi-step workflows (qualify lead, book appointment, send confirmation) as parallel operations.
- *Research-backed:* Powered by Hermes-3 (Llama 3.1-based), trained using Atropos RL framework for tool-calling accuracy and long-range planning. Not a hobby project -- backed by a funded research lab.

**NanoClaw (Security-First -- regulated verticals)**

Built by Qwibit.ai. Approximately 700-4,000 lines of code, small enough for a single developer (or Claude Code) to audit in full. Container isolation per chat group. Built on Anthropic's Claude Agent SDK.

- *Best for:* DentalClaw, CounselClaw, PolicyClaw, PawClaw -- any vertical where compliance officers need the simplest possible architecture to audit and where the agent touches regulated data.
- *Trade-off:* Claude-only (Anthropic SDK). Smaller integration set (WhatsApp, Telegram, Discord, Slack). No self-improving memory. But the security story is airtight -- each agent sees only the data explicitly mounted into its container.
- *Endorsed by:* Andrej Karpathy ("NanoClaw looks really interesting... the core engine is ~4000 lines of code, fits into both my head and that of AI agents"). Covered by The Register, KDnuggets, The New Stack.

**OpenClaw (Maximum Integrations -- legacy and specialty)**

The original 210K-star framework. 430,000 lines of TypeScript. 50+ messaging platform integrations. Massive skills ecosystem via ClawHub (5,000+ skills, though with documented security issues).

- *Best for:* Clients who need integrations that only exist in the OpenClaw ecosystem (WeChat, Signal, iMessage, niche platforms). Clients migrating from existing OpenClaw self-installs who want hardening rather than re-platforming.
- *Trade-off:* Application-level security only (allowlists, pairing codes). Larger attack surface. Founder departed for OpenAI. Community-governed, which means slower security patches.
- *Offered with explicit hardening:* Every OpenClaw deployment includes our full security stack (Docker sandboxing, Composio OAuth, UFW + exec allowlists, read-only defaults). We do not deploy raw OpenClaw.

### 2c. Harness Selection Matrix

| Vertical | Default Harness | Why | Alternative |
|---|---|---|---|
| DentalClaw | Hermes Agent | Self-improving memory learns patient patterns; Docker sandbox for PHI safety | NanoClaw if compliance officer demands minimal codebase audit |
| StyleClaw | Hermes Agent | Multi-model routing (cheap model for bookings, smart model for product recs) | OpenClaw if client needs Instagram DM integration |
| TradeClaw | Hermes Agent | Subagent delegation for emergency vs. standard routing; scheduled automations for seasonal campaigns | OpenClaw for ServiceTitan webhook depth |
| DealClaw | Hermes Agent | Memory system learns lead qualification patterns over time | -- |
| CounselClaw | NanoClaw | Minimal attack surface for legal data; Claude's instruction-following for compliance guardrails | Hermes Agent if client needs multi-model |
| GarageClaw | Hermes Agent | Persistent memory tracks repair patterns per customer | -- |
| RepClaw | Hermes Agent | Scheduled automations for class reminders; cron-based retention campaigns | -- |
| PawClaw | NanoClaw | VCPR compliance benefits from smallest auditable codebase | Hermes Agent for multi-location practices |
| TableClaw | Hermes Agent | Voice memo transcription for phone orders; scheduled automations for reservation reminders | -- |
| PolicyClaw | NanoClaw | Insurance compliance requires demonstrable isolation; Claude for compliant language generation | Hermes Agent if client needs multi-carrier routing |

---

## 3. Pricing Strategy

*All pricing is harness-agnostic. Clients pay for the vertical config and deployment service, not the underlying framework.*

### 3a. Marketplace Config Tiers

| Tier | Price | Includes |
|---|---|---|
| **Starter** | $497 | Core config (agentskills.io format) + system prompt + 1 integration template + security hardening checklist + setup guide for default harness |
| **Pro** | $997 | Everything in Starter + 3 integration templates + knowledge base scaffold + model routing config + 30-day email support + deployment guides for all 3 harnesses |
| **Agency** | $1,497 | Everything in Pro + white-label ready + multi-location support + priority onboarding queue access + 60-day support + reseller license |

**Note:** Starter configs ship with deployment guides for the default harness only. Pro and Agency tiers include guides for all three harnesses, allowing the buyer (or their IT consultant) to choose.

### 3b. Onboarding Add-ons (at checkout)

| Add-on | Price | Deliverable |
|---|---|---|
| **Guided Setup** | $597 | 90-min screenshare -- we walk you through every step live, including security hardening and integration wiring on your chosen harness |
| **Done Install** | $2,497 | We handle everything: VPS provisioning, harness installation, security hardening, integration wiring, up to 3 workflows configured, 14-day ActiveCare |
| **Custom Tuning** | $4,497 | Done Install + custom system prompt development + brand voice calibration + 2 rounds of live tuning + 30-day ActiveCare + quarterly strategy call |

### 3c. Support Plans

**Monthly Retainers** (rolling, cancel anytime)

| Plan | Price/mo | Hours Included | Response SLA | Extras |
|---|---|---|---|---|
| **Watchdog** | $349/mo | 4 hrs | 48 hrs | Monthly health check report |
| **Guardian** | $699/mo | 10 hrs | 24 hrs | Monthly health check + 1 tune-up session |
| **Command** | $1,299/mo | 24 hrs | 4 hrs | Priority queue, dedicated Slack channel, quarterly strategy call |

**Block Hours** (valid for 12 months from purchase, extendable by request)

| Block | Price | Effective Rate |
|---|---|---|
| 5 Hours | $575 | $115/hr |
| 10 Hours | $1,100 | $110/hr |
| 20 Hours | $2,000 | $100/hr |
| 40 Hours | $3,800 | $95/hr |

**Standard hourly rate (non-block):** $175/hr

### 3d. Security Audit Add-on

| Add-on | Price | Deliverable |
|---|---|---|
| **Security Audit** | $997 | Full review of existing AI agent deployment (any harness): credential exposure check, sandbox verification, firewall hardening, written report with remediation steps + 30-min remediation call |
| **Harness Migration** | $1,497 | Full audit + migration from OpenClaw (or other harness) to Hermes Agent or NanoClaw, including config translation, integration re-wiring, and 14-day ActiveCare |

**New: Harness Migration add-on.** Targets the large installed base of self-deployed OpenClaw instances with known security gaps. Positions ClawBuilt as the upgrade path for anyone who read the Cisco report or got hit by ClawHavoc and wants to move to a hardened setup on a better framework.

---

## 4. Key Learnings from Competitors (Applied)

### 4a. Security Hardening as a Core Selling Point

OpenClaw's security reputation is now a market-wide awareness driver. Cisco published a piece calling it "a security nightmare" when self-installed. The ClawHavoc attack was covered in major tech press. This creates objections from business owners and their IT people -- but also creates demand for hardened alternatives.

**In messaging:**
- Lead with "hardened from day one" and "your choice of security model"
- Every Done Install includes sandbox hardening appropriate to the chosen harness
- Hermes Agent deployments: Docker with read-only root, dropped capabilities, PID limits, namespace isolation
- NanoClaw deployments: container-per-group isolation, minimal codebase audit available on request
- OpenClaw deployments (when chosen): full hardening stack (Docker sandbox, Composio OAuth, UFW + exec allowlists, read-only defaults)
- The Security Audit ($997) and Harness Migration ($1,497) target the installed base of insecure self-deployments

### 4b. "14-Day ActiveCare"

Included in every Done Install and Custom Tuning package:
- Daily check-ins for first 3 days
- Dedicated Slack channel
- Unlimited bug fixes within scope
- Workflow expansion as trust builds
- Final handoff call with documentation

### 4c. "Same Day Live" Promise

"Live before dinner." Applies regardless of harness. The Done Install gets the client to a working, secured, vertical-tuned agent on the same day as the deployment session.

### 4d. FAQ as Objection Demolition

Updated FAQ targets now include harness-specific questions:
- "Will the AI give my customers wrong information?"
- "What if it books an appointment we can't fill?"
- "Can it access my QuickBooks / financial data?"
- "What happens when something breaks at 2am?"
- "Is this HIPAA safe?" (for dental/medical verticals)
- "Which framework do you use?" (new -- explains multi-harness approach)
- "What if I already have an OpenClaw setup?" (new -- drives Security Audit and Migration)

### 4e. Social Proof Architecture

Launch with a **"Founding Client Program"** banner. 10 spots at reduced rates (~50% off standard) in exchange for feedback, case studies, and video testimonials. Prioritize recognizable local business owners with social followings. Replace with real testimonials after 60-90 days.

### 4f. Affiliate / Partner Program

- 15% commission on first config purchase
- 10% commission on add-on services (Guided Setup, Done Install, Custom Tuning) booked within 90 days
- White-label reseller program (Agency tier unlocks)
- Referral dashboard in client portal (Phase 2)

### 4g. SEO Strategy

**Vertical + city pages:** "AI agent for dental offices in [City]" etc.

**Framework comparison pages (new):** "Hermes Agent vs. OpenClaw for dental offices," "Best AI agent framework for law firms," "OpenClaw alternatives for HIPAA compliance." These are high-intent search terms with growing volume as the ecosystem fragments. ClawBuilt can own this content because we actually deploy on multiple harnesses.

**Educational pages:** "What is [Hermes Agent / OpenClaw / NanoClaw] for [vertical]?", "How to automate your salon's booking with AI," "Can AI agents handle HIPAA compliance for a medical office?"

---

## 5. Technical Architecture

### 5a. Marketplace Infrastructure

**Storefront:** Custom HTML/React site hosted on Vercel at clawbuilt.ai, Stripe for payments.

**Delivery:**
- On successful payment, Stripe webhook triggers a Vercel Edge Function
- Function generates a signed, time-limited R2 download URL for the config bundle
- Download link + 14-day ActiveCare onboarding checklist delivered via Resend
- License key generated and stored in Supabase (tied to email + product + harness)

**Config Bundle Structure (ZIP):**
```
/[vertical]-claw-[tier]/
  ├── skills/
  │   ├── SKILL.md                 # agentskills.io portable skill definition
  │   ├── system_prompt.md         # Tuned system prompt (harness-agnostic)
  │   └── persona.md               # Brand voice guide
  ├── harness/
  │   ├── hermes/                  # Hermes Agent deployment config
  │   │   ├── hermes-config.yaml
  │   │   ├── memory-config.yaml
  │   │   └── DEPLOY.md
  │   ├── nanoclaw/                # NanoClaw deployment config (Pro/Agency only)
  │   │   ├── CLAUDE.md
  │   │   └── DEPLOY.md
  │   └── openclaw/                # OpenClaw deployment config (Pro/Agency only)
  │       ├── openclaw.yaml
  │       ├── routing.yaml
  │       └── DEPLOY.md
  ├── integrations/
  │   ├── [integration-1].md       # Step-by-step connection guide
  │   └── [integration-2].md
  ├── security/
  │   ├── hardening-checklist.md   # Harness-specific hardening steps
  │   └── composio-setup.md        # OAuth middleware guide (where applicable)
  ├── knowledge/
  │   └── scaffold/                # Template knowledge base structure
  ├── .env.example
  └── SETUP.md                     # Quick-start for default harness
```

**Key structural change from v4:** Configs are now organized with a harness-agnostic `skills/` layer (system prompts, persona docs, skill definitions in agentskills.io format) and a harness-specific `harness/` layer with deployment configs for each supported framework. Starter tier includes only the default harness directory. Pro and Agency include all three.

### 5b. Deployment Service Stack

For Done Install / Custom Tuning clients:

| Step | Tool | Notes |
|---|---|---|
| Remote access | Tailscale or screenshare | Same across all harnesses |
| VPS provisioning | DigitalOcean / Hetzner ($5-10/mo) | ARM instances for ZeroClaw if cost-optimizing |
| Agent runtime | Hermes Agent / NanoClaw / OpenClaw | Per harness selection matrix |
| Container setup | Docker | Read-only root, dropped caps, PID limits for Hermes; per-group isolation for NanoClaw |
| OAuth middleware | Composio (where applicable) | Required for OpenClaw; optional enhancement for Hermes/NanoClaw |
| Model routing | OpenRouter / Nous Portal / direct API | Per-vertical model selection for cost/performance optimization |
| Monitoring | UptimeRobot + custom health check cron | Same across all harnesses |
| Client comms | Slack Connect (dedicated channel) | Same across all harnesses |
| Documentation | Notion (client-facing handoff doc) | Harness-specific sections |

### 5c. Client Portal (Phase 2)

- Supabase-backed auth at portal.clawbuilt.ai
- Customers: download configs, select harness variant, view version history, submit support tickets, track block hour balances, access session recordings, view security audit status
- Harness migration requests handled through portal

---

## 6. Preset Configuration Catalog

### Launch Verticals (V1)

Each vertical config ships as an agentskills.io-compatible package with harness-specific deployment guides. The system prompt, persona, knowledge scaffold, and integration documentation are shared across harnesses. Only the deployment configs differ.

---

#### 1. Dental Office -- "DentalClaw"
**Default harness:** Hermes Agent (self-improving memory learns patient patterns; Docker sandbox for PHI safety)
**Alternative:** NanoClaw (if compliance officer demands minimal codebase audit)
**Common pain points:** Appointment scheduling, insurance FAQ, recall reminders, new patient intake
**Preloaded integrations:** Dentrix, Eaglesoft, NexHealth, Google Calendar, Birdeye
**Tools configured:** Appointment lookup, FAQ responder, new patient form handler, insurance verification prompts
**System prompt tuned for:** HIPAA-aware language (no PHI collection by design), warm/professional tone, after-hours response
**Security defaults:** PHI firewall built into system prompt; audit log for all patient-facing interactions
**Knowledge base scaffold:** Services list, insurance accepted, office policies, common procedure explanations, financing options

---

#### 2. Salon & Barbershop -- "StyleClaw"
**Default harness:** Hermes Agent (multi-model routing for cost optimization)
**Alternative:** OpenClaw (if client needs Instagram DM integration)
**Common pain points:** Booking, stylist availability, pricing questions, product recommendations
**Preloaded integrations:** Vagaro, Square Appointments, Booksy, Boulevard, Instagram
**Tools configured:** Booking link redirect, service menu responder, stylist bio lookup, waitlist capture
**System prompt tuned for:** Friendly/casual tone with brand voice options (luxury salon vs. neighborhood barbershop persona toggle)
**Knowledge base scaffold:** Services + pricing, team bios, policies, product lines

---

#### 3. HVAC / Plumbing / Trades -- "TradeClaw"
**Default harness:** Hermes Agent (subagent delegation for emergency vs. standard routing; scheduled automations for seasonal campaigns)
**Alternative:** OpenClaw (for deep ServiceTitan webhook integration)
**Common pain points:** Emergency dispatch routing, quote requests, service area questions, seasonal campaign support
**Preloaded integrations:** ServiceTitan, Housecall Pro, Google LSA, Thumbtack
**Tools configured:** Emergency vs. standard routing classifier, service area lookup, quote request capture, review request trigger
**System prompt tuned for:** Efficient/direct, urgency detection for emergencies, upsell prompts for maintenance plans
**Knowledge base scaffold:** Services, service area zip codes, pricing ranges, maintenance plan details, warranty info

---

#### 4. Real Estate Agency -- "DealClaw"
**Default harness:** Hermes Agent (memory system learns lead qualification patterns over time)
**Preloaded integrations:** Follow Up Boss, KVCore, Calendly, Zillow webhook, DocuSign
**Tools configured:** Lead qualifier (buyer/seller/investor), listing lookup, showing scheduler
**System prompt tuned for:** Fair housing compliance, hot lead urgency detection
**Knowledge base scaffold:** Agent bios, market area, buying/selling process, FAQ

---

#### 5. Law Firm (Small/Solo) -- "CounselClaw"
**Default harness:** NanoClaw (minimal attack surface for legal data; Claude's instruction-following for compliance)
**Alternative:** Hermes Agent (if client needs multi-model or broader integrations)
**Preloaded integrations:** Clio, MyCase, Calendly, LawPay
**Tools configured:** Practice area router, intake handler, consultation booker, disclaimer injector
**System prompt tuned for:** Non-legal-advice guardrails, confidentiality-aware (no case detail collection)
**Security defaults:** Auto-disclaimer appended to every response; no case detail storage

---

#### 6. Auto Repair Shop -- "GarageClaw"
**Default harness:** Hermes Agent (persistent memory tracks repair patterns per customer)
**Preloaded integrations:** Shop-Ware, Mitchell1, Tekmetric, Google Business Profile
**Tools configured:** Appointment scheduler, repair status lookup, estimate capture, service reminder trigger

---

#### 7. Gym / Fitness Studio -- "RepClaw"
**Default harness:** Hermes Agent (scheduled automations for class reminders; cron-based retention campaigns)
**Preloaded integrations:** Mindbody, Wodify, Pike13, Glofox, Stripe
**Tools configured:** Class schedule lookup, membership explainer, free trial capture, trainer availability

---

#### 8. Veterinary Clinic -- "PawClaw"
**Default harness:** NanoClaw (VCPR compliance benefits from smallest auditable codebase)
**Alternative:** Hermes Agent (for multi-location practices needing richer memory)
**Preloaded integrations:** Avimark, Cornerstone, ezyVet, PetDesk
**Tools configured:** Emergency vs. routine classifier, appointment booker, prescription refill capture
**Security defaults:** VCPR-aware; no remote diagnosis by design

---

#### 9. Restaurant / Food Service -- "TableClaw"
**Default harness:** Hermes Agent (voice memo transcription for phone orders; scheduled automations for reservation reminders)
**Preloaded integrations:** OpenTable, Resy, Toast, Square, Yelp, Google Business
**Tools configured:** Reservation booker, menu FAQ, catering inquiry capture, event booking handler

---

#### 10. Insurance Agency -- "PolicyClaw"
**Default harness:** NanoClaw (insurance compliance requires demonstrable isolation; Claude for compliant language)
**Alternative:** Hermes Agent (if client needs multi-carrier routing across model providers)
**Preloaded integrations:** AgencyZoom, Applied Epic, EZLynx, Calendly
**Tools configured:** Coverage type classifier, quote request capture, claims routing, referral capture
**Security defaults:** No coverage guarantees; compliant language enforced in system prompt

---

## 7. Go-to-Market Strategy

### Phase 1 -- Foundation (Month 1-2)
- Launch 3 vertical configs (Dental, Salon, HVAC) on Hermes Agent as default harness
- **Founding Client Program**: 10 spots at ~50% off standard rates in exchange for feedback, case studies, and video testimonials
- 3 founding clients get full white-glove deploys -- target recognizable local business owners
- Publish educational pages: "What is [Hermes Agent] for [vertical]?" and "OpenClaw alternatives for [vertical]"
- Set up affiliate program (Rewardful or Affonso)
- Internal: build deployment playbooks for Hermes Agent, begin NanoClaw testing on CounselClaw

### Phase 2 -- Multi-Harness Launch (Month 3-4)
- Full storefront live at clawbuilt.ai with 6-7 verticals
- NanoClaw configs live for CounselClaw, PolicyClaw, PawClaw (regulated verticals)
- OpenClaw configs available as "maximum integration" option for StyleClaw and TradeClaw
- Harness comparison pages for SEO: "Hermes Agent vs. OpenClaw for [vertical]"
- Security Audit and Harness Migration add-ons active, targeting OpenClaw installed base
- Replace "Founding Client" banner with real testimonials and live client counter

### Phase 3 -- Scale (Month 5+)
- All 10 verticals available on all three harnesses (where applicable)
- Partner/reseller program (Agency tier white-label unlock)
- Expand to 15+ verticals
- Client portal launch (Supabase) at portal.clawbuilt.ai with harness selection
- Explore ZeroClaw as a fourth harness option for ultra-cost-sensitive clients ($5/mo ARM VPS)
- Explore recurring config licensing model ($149-$299/mo) for verticals with high update cadence

---

## 8. Competitive Positioning

**Tagline options:**
- "Production-ready AI agents, built for your industry."
- "Live before dinner."
- "The right agent, on the right framework, for your business."

**Differentiation matrix:**

| | ClawMart | SetupClaw | LushBinary/Dextralabs | **ClawBuilt** |
|---|---|---|---|---|
| Vertical-specific configs | No | No | No | Yes |
| Industry integrations (Dentrix, Vagaro, etc.) | No | No | No | Yes |
| Multi-harness deployment | No (OpenClaw only) | No (OpenClaw only) | Yes (but generic) | Yes (vertical-optimized) |
| Self-serve config entry | Yes ($0-$99) | No | No | Yes ($497+) |
| Security hardening | No | Yes | Yes | Yes (harness-matched) |
| White-glove deploy | No | Yes ($3K-$6K) | Yes (custom quote) | Yes ($2,497-$4,497) |
| Ongoing support plans | No | No | Yes (custom) | Yes ($349-$1,299/mo) |
| SMB-targeted | Sort of | No (exec/startup) | No (enterprise) | Yes |
| Harness migration service | No | No | Yes | Yes ($1,497) |

**Strategic position:** ClawBuilt is the only service combining vertical-specific configurations with multi-harness deployment expertise and SMB-accessible pricing. ClawMart and SetupClaw are locked to OpenClaw. Dextralabs and LushBinary offer multi-harness consulting but without vertical configs or SMB focus. ClawBuilt owns the intersection.

---

## 9. Guarantee Policy

**Config purchases ($497-$1,497):** Full refund within 14 days, no questions asked.

**Done Install ($2,497) and Custom Tuning ($4,497):** If we cannot get you live on the agreed timeline, or if the deployment does not meet the scope defined in our pre-install scoping call, we will refund the service fee in full.

**Harness Migration ($1,497):** Same scope-based guarantee as Done Install.

**Support plans and block hours:** No refunds on retainer months already billed. Unused block hours can be refunded pro-rata within 30 days of purchase if unused.

---

## 10. Value Framing for Sales Conversations

| What they pay now | Monthly cost | What ClawBuilt replaces/augments |
|---|---|---|
| Dental receptionist (full-time) | $4,117-$4,333/mo | DentalClaw + Guardian retainer = $699/mo |
| HVAC dispatcher (full-time) | $4,550-$5,200/mo | TradeClaw + Guardian retainer = $699/mo |
| Law firm intake specialist | $4,983-$5,742/mo | CounselClaw + Guardian retainer = $699/mo |
| Virtual receptionist service (Ruby, Smith.ai) | $300-$1,000+/mo (limited minutes) | Any vertical config + Watchdog = $349/mo (unlimited) |
| AI receptionist SaaS (AirClinic, AgentZap) | $199-$499/mo (ongoing) | One-time config ($497-$997) + hosting ($5-$10/mo) |

The framing: "You are not buying software. You are hiring a 24/7 employee that costs less per month than your current receptionist costs per week. And we deploy it on the framework that fits your security requirements, not the one that went viral."

---

## 11. Changelog (v4 to v5)

**Harness architecture (major):**
- Hermes Agent adopted as **default harness** for most verticals, replacing OpenClaw
- NanoClaw designated as **security-first harness** for regulated verticals (CounselClaw, PolicyClaw, PawClaw)
- OpenClaw retained as **maximum-integration harness** for specialty use cases
- Config bundles restructured: agentskills.io-compatible `skills/` layer (harness-agnostic) + `harness/` layer (per-framework deployment configs)
- Starter tier includes default harness only; Pro/Agency include all three

**New products:**
- **Harness Migration** add-on at $1,497 (audit + migration from OpenClaw to Hermes Agent or NanoClaw)
- Framework comparison SEO pages added to content strategy

**Vertical catalog updates:**
- Each vertical now specifies default harness and alternative with rationale
- DentalClaw, StyleClaw, TradeClaw, DealClaw, GarageClaw, RepClaw, TableClaw default to Hermes Agent
- CounselClaw, PawClaw, PolicyClaw default to NanoClaw

**Competitive positioning:**
- Added LushBinary/Dextralabs as emerging multi-harness competitors (but no vertical configs, no SMB focus)
- Differentiation matrix expanded to 4-column comparison
- ClawBuilt positioned as only service combining vertical configs + multi-harness + SMB pricing

**All v4 pricing preserved.** No price changes in this version.
