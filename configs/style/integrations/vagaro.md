# StyleClaw — Vagaro Integration Guide

> **Tier:** Starter ($497) and above
> **Integration type:** REST API + Composio OAuth

---

## Overview

Vagaro is a popular all-in-one salon management platform used by over 220,000 businesses. This integration connects StyleClaw to Vagaro's API for real-time service menu data, stylist availability, and appointment information.

**What this integration enables:**
- Pull live service menu with pricing and durations
- Check stylist/barber availability windows
- Read appointment data for reminder cron jobs (Pro/Agency)
- Generate deep links to Vagaro's booking page for specific services or stylists

**What this integration does NOT do:**
- Create, modify, or cancel appointments (by design — reduces liability)
- Process payments
- Access client records or history

---

## Prerequisites

- Active Vagaro business account (any plan)
- Vagaro API access (contact Vagaro support or apply via partner program)
- Composio account (recommended) or direct API credentials
- StyleClaw deployed on any harness

---

## Setup via Composio (Recommended)

Composio manages the OAuth flow and token lifecycle for you.

### Step 1: Connect Vagaro in Composio

1. Log into your Composio dashboard at https://app.composio.dev
2. Navigate to **Connections** > **Add Connection**
3. Search for **Vagaro** and select it
4. Click **Connect** and follow the OAuth authorization flow:
   - Log into your Vagaro business account
   - Authorize the requested permissions
   - Composio stores and manages the tokens
5. Note the **Connection ID** — you'll need it for your `.env`

### Step 2: Configure Permissions

In Composio, set the connection permissions to read-only:

| Permission              | Enabled | Notes                                    |
|-------------------------|:-------:|------------------------------------------|
| Read Services           | Yes     | Service menu, descriptions, pricing       |
| Read Staff              | Yes     | Stylist names, bios, availability         |
| Read Appointments       | Yes     | For reminder cron jobs (Pro/Agency only)   |
| Write Appointments      | No      | Agent should not create bookings directly  |
| Read Clients            | No      | Not needed — privacy protection            |
| Write Clients           | No      | Not needed                                 |
| Read Payments           | No      | Not needed                                 |

### Step 3: Add to .env

```bash
# Vagaro via Composio
BOOKING_PLATFORM=vagaro
COMPOSIO_ENABLED=true
COMPOSIO_API_KEY=your_composio_api_key
COMPOSIO_VAGARO_CONNECTION_ID=your_connection_id

# Vagaro booking page URL (for client redirects)
BOOKING_URL=https://www.vagaro.com/yoursalonname
# Or custom domain: https://book.yoursalon.com

# Vagaro location ID (find in Vagaro dashboard under Settings > Business Info)
BOOKING_LOCATION_ID=your_vagaro_location_id
```

---

## Setup via Direct API (Alternative)

If not using Composio, connect directly to Vagaro's API.

### Step 1: Obtain API Credentials

1. Contact Vagaro partner support or access via the Vagaro Developer Portal
2. Request API credentials for your business account
3. Receive: `client_id`, `client_secret`, and `api_key`

### Step 2: Configure .env

```bash
BOOKING_PLATFORM=vagaro
COMPOSIO_ENABLED=false
BOOKING_API_KEY=your_vagaro_api_key
VAGARO_CLIENT_ID=your_client_id
VAGARO_CLIENT_SECRET=your_client_secret
BOOKING_LOCATION_ID=your_location_id
BOOKING_URL=https://www.vagaro.com/yoursalonname
```

### Step 3: Token Management

Direct API tokens may expire. Implement token refresh logic or set a calendar reminder to rotate credentials.

---

## Data Mapping

### Services

Vagaro service data maps to StyleClaw's knowledge base as follows:

| Vagaro Field         | StyleClaw Field       | Notes                              |
|----------------------|-----------------------|------------------------------------|
| `serviceName`        | Service name          | Display name shown to clients      |
| `serviceDescription` | Description           | Brief service description          |
| `price`              | Starting price        | May be variable — note as "from"   |
| `duration`           | Duration (minutes)    | Processing time excluded           |
| `categoryName`       | Category              | Haircut, Color, Treatment, etc.    |
| `staffMembers`       | Available stylists    | Who performs this service           |

### Staff

| Vagaro Field         | StyleClaw Field       | Notes                              |
|----------------------|-----------------------|------------------------------------|
| `staffName`          | Stylist name          | Display name                       |
| `title`              | Role/title            | Stylist, Senior Colorist, etc.     |
| `bio`                | Bio                   | From staff profile                 |
| `services`           | Specialties           | Services this staff member offers  |

### Availability

| Vagaro Field         | StyleClaw Field       | Notes                              |
|----------------------|-----------------------|------------------------------------|
| `availableSlots`     | Availability windows  | Used for general guidance only     |
| `workingHours`       | Schedule              | Days/hours the stylist works       |

---

## Deep Linking

Vagaro supports deep links to specific services and staff:

```
# General booking page
https://www.vagaro.com/{business_name}

# Specific service
https://www.vagaro.com/{business_name}/service/{service_id}

# Specific staff member
https://www.vagaro.com/{business_name}/staff/{staff_id}

# Specific staff + service combo
https://www.vagaro.com/{business_name}/staff/{staff_id}/service/{service_id}
```

Configure the agent to construct these deep links when a client asks about a specific service or stylist, making it one tap to book.

---

## Syncing Knowledge Base

You have two options for keeping the knowledge base current:

### Option A: API-Driven (Real-time)

The agent queries Vagaro's API at runtime for service/staff data. This ensures pricing and availability are always current.

**Pros:** Always accurate, no manual updates
**Cons:** Adds API latency, requires API uptime

### Option B: Periodic Sync (Recommended for Starter)

Run a sync script daily/weekly to pull Vagaro data into the knowledge base files.

```bash
# Example sync command (built into StyleClaw CLI)
styleclaw sync --platform vagaro --output data/knowledge/
```

**Pros:** Fast responses (no API call), works offline
**Cons:** May be stale if services/pricing change frequently

**Recommendation:** Use Option B for Starter tier (simplicity), Option A for Pro/Agency (accuracy).

---

## Troubleshooting

| Issue                              | Solution                                                    |
|------------------------------------|-------------------------------------------------------------|
| "Unauthorized" API errors          | Check API key/tokens; re-authorize in Composio              |
| Services not appearing             | Verify location ID is correct; check Vagaro service status  |
| Stale pricing                      | Run sync or restart agent to refresh cache                  |
| Deep links broken                  | Verify business name slug matches Vagaro URL                |
| Composio connection expired        | Re-authorize in Composio dashboard                          |
| Rate limited by Vagaro             | Reduce poll interval; cache responses more aggressively     |

---

## Vagaro API Rate Limits

| Endpoint            | Limit                    |
|---------------------|--------------------------|
| Services            | 100 requests/minute      |
| Staff               | 100 requests/minute      |
| Availability        | 60 requests/minute       |
| Appointments (read) | 60 requests/minute       |

StyleClaw's default polling interval (15 minutes for reminders) stays well within these limits.
