# Calendly Setup

Account: clawbuilt@proton.me
Booking link: https://calendly.com/clawbuilt-proton

## Event Types to Create

The following event types need to be created manually in the Calendly dashboard.
The current default "30 Minute Meeting" can be renamed/duplicated for each.

- [ ] **Free Scoping Call** (15 min) — Pre-sale consultation, harness recommendation
- [ ] **Guided Setup Session** (90 min) — Paid screenshare deployment
- [ ] **Done Install Kickoff** (30 min) — Pre-deployment scoping for Done Install clients
- [ ] **Custom Tuning Kickoff** (45 min) — Pre-deployment scoping + brand voice discussion

## Configuration

- Integrate with Google Calendar for availability
- Confirmation emails with prep instructions
- Reminder emails 24 hours and 1 hour before

## CTA Wiring

All "Book a Call" CTAs site-wide should link to: https://calendly.com/clawbuilt-proton

The Calendly badge popup widget is loaded globally via `src/app/layout.tsx`.
When v5 storefront components are built, wire their CTA `href` attributes to the booking link above.
