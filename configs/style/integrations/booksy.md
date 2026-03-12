# StyleClaw — Booksy Integration Guide

> **Tier:** Pro ($997) and above
> **Integration type:** Booksy Business API + Composio OAuth

---

## Overview

Booksy is a leading booking platform for beauty and wellness professionals, with over 30 million users globally. It is especially popular with barbershops, nail salons, and independent stylists. This integration connects StyleClaw to Booksy's API for service data, staff profiles, and appointment information.

**What this integration enables:**
- Pull live service menu with pricing, durations, and descriptions
- Read staff profiles and availability windows
- Access appointment data for reminder cron jobs
- Generate deep links to Booksy's booking page

**What this integration does NOT do:**
- Create, modify, or cancel appointments
- Process payments or tips
- Access client reviews or ratings data

---

## Prerequisites

- Active Booksy Biz account (Pro plan recommended for API access)
- Booksy Business API credentials (apply via Booksy Partner Program)
- Composio account (recommended) or direct API credentials
- StyleClaw deployed on Hermes Agent or OpenClaw harness

---

## Setup via Composio (Recommended)

### Step 1: Connect Booksy in Composio

1. Log into Composio at https://app.composio.dev
2. Navigate to **Connections** > **Add Connection**
3. Search for **Booksy** and select it
4. Complete the OAuth authorization flow:
   - Log into your Booksy Biz account
   - Authorize read-only access
   - Composio stores and manages credentials
5. Note the **Connection ID**

### Step 2: Configure Permissions

| Permission              | Enabled | Notes                                    |
|-------------------------|:-------:|------------------------------------------|
| Read Services           | Yes     | Service menu, pricing, durations          |
| Read Staff              | Yes     | Staff profiles, availability              |
| Read Appointments       | Yes     | For reminder cron jobs                     |
| Write Appointments      | No      | Agent does not create bookings             |
| Read Clients            | No      | Privacy protection                         |
| Read Reviews            | No      | Not needed for agent                       |

### Step 3: Add to .env

```bash
# Booksy via Composio
BOOKING_PLATFORM=booksy
COMPOSIO_ENABLED=true
COMPOSIO_API_KEY=your_composio_api_key
COMPOSIO_BOOKSY_CONNECTION_ID=your_connection_id

# Booksy business ID (from Booksy Biz dashboard)
BOOKING_LOCATION_ID=your_booksy_business_id

# Booksy booking URL
BOOKING_URL=https://booksy.com/en-us/your-business-slug
```

---

## Setup via Direct API (Alternative)

### Step 1: Apply for API Access

1. Contact Booksy's Partner Program: https://booksy.com/partners
2. Request Business API credentials for your account
3. Receive: `api_key` and `business_id`

### Step 2: Configure .env

```bash
BOOKING_PLATFORM=booksy
COMPOSIO_ENABLED=false
BOOKING_API_KEY=your_booksy_api_key
BOOKING_LOCATION_ID=your_booksy_business_id
BOOKING_URL=https://booksy.com/en-us/your-business-slug
```

---

## Data Mapping

### Services

| Booksy Field          | StyleClaw Field   | Notes                              |
|-----------------------|-------------------|------------------------------------|
| `name`                | Service name      | Display name                       |
| `description`         | Description       | Service description                |
| `price`               | Price             | May include "from" indicator       |
| `duration`            | Duration          | In minutes                         |
| `category`            | Category          | Haircut, Color, Styling, etc.      |
| `staff_ids`           | Available stylists| Staff who perform this service     |
| `is_addon`            | Add-on flag       | Mark as add-on in service menu     |

### Staff

| Booksy Field          | StyleClaw Field   | Notes                              |
|-----------------------|-------------------|------------------------------------|
| `name`                | Display name      | Public name                        |
| `title`               | Role              | Barber, Stylist, Colorist, etc.    |
| `bio`                 | Bio               | Staff description                  |
| `avatar_url`          | Photo             | Profile image                      |
| `services`            | Specialties       | Services this staff member offers  |
| `working_hours`       | Schedule          | Days and hours available           |

### Availability

Booksy provides availability through time slots:

| Booksy Field          | StyleClaw Field   | Notes                              |
|-----------------------|-------------------|------------------------------------|
| `available_slots`     | Open times        | Available booking windows          |
| `next_available`      | Next opening      | Soonest available slot             |

Use availability for general guidance and always direct to the Booksy booking page for real-time slot selection.

---

## Deep Linking

Booksy supports direct links to your business booking page:

```
# General booking page
https://booksy.com/en-us/{business-slug}

# Mobile app deep link (opens Booksy app if installed)
booksy://business/{business_id}
```

Booksy's web booking page handles service and staff selection within their UI — no separate service/staff deep links are available.

**Tip:** Many Booksy clients book through the app. The agent can say: "You can book right in the Booksy app — search for {Salon Name} — or use this link: {BOOKING_URL}"

---

## Booksy-Specific Features

### Walk-In Queue

Booksy supports walk-in queue management. If your shop uses this:

```yaml
# In hermes-config.yaml, under integrations:
booksy:
  walk_in_queue:
    enabled: true
    status_check: true  # Agent can check current wait time
```

The agent can tell clients: "The current wait is about 20 minutes. Want to add yourself to the queue, or would you prefer to book a specific time?"

### Boost Integration

Booksy Boost is their marketing tool. If you use Boost promotions, add them to the knowledge base so the agent can share active deals.

---

## Syncing Knowledge Base

### Automated Sync

```bash
# Sync Booksy data to knowledge base
styleclaw sync --platform booksy --output data/knowledge/

# Schedule daily sync via cron
0 6 * * * /usr/local/bin/styleclaw sync --platform booksy --output /data/knowledge/
```

### Manual Knowledge Enhancement

Booksy's API provides structured data, but you may want to enhance it:

- Add more detailed service descriptions beyond what's in Booksy
- Include aftercare instructions per service
- Add product recommendations per service type
- Include stylist personality details beyond the basic bio

These enhancements go in the knowledge scaffold files and supplement the API data.

---

## Troubleshooting

| Issue                              | Solution                                                    |
|------------------------------------|-------------------------------------------------------------|
| "Unauthorized" API errors          | Check API key; re-authorize in Composio                     |
| Empty service list                 | Verify business ID; check services are published in Booksy  |
| Staff not showing                  | Ensure staff profiles are active and public in Booksy       |
| Walk-in queue data unavailable     | Feature requires Booksy Biz Pro plan                        |
| Composio connection expired        | Re-authorize in Composio dashboard                          |
| Booking link doesn't work          | Verify business slug in Booksy URL                          |

---

## Booksy API Rate Limits

| Endpoint            | Limit                    |
|---------------------|--------------------------|
| Services            | 120 requests/minute      |
| Staff               | 120 requests/minute      |
| Availability        | 60 requests/minute       |
| Appointments        | 60 requests/minute       |

StyleClaw's default usage is well within these limits. For high-traffic salons (Agency tier), consider caching responses for 5-15 minutes.
