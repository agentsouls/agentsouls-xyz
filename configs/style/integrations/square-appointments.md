# StyleClaw — Square Appointments Integration Guide

> **Tier:** Pro ($997) and above
> **Integration type:** Square API v2 + Composio OAuth

---

## Overview

Square Appointments is a booking and point-of-sale system widely used by salons, barbershops, and beauty businesses. This integration connects StyleClaw to Square's Bookings API for real-time service data, team member availability, and appointment information.

**What this integration enables:**
- Pull live catalog of services (CatalogItem objects) with pricing and durations
- Read team member profiles and availability
- Access booking data for appointment reminder cron jobs
- Generate deep links to Square's online booking page

**What this integration does NOT do:**
- Create, modify, or cancel bookings
- Process payments or access financial data
- Access customer PII from Square's customer directory

---

## Prerequisites

- Active Square account with Appointments enabled
- Square Developer account: https://developer.squareup.com
- Square application created in the Developer Dashboard
- Composio account (recommended) or direct OAuth credentials
- StyleClaw deployed on Hermes Agent or OpenClaw harness

---

## Setup via Composio (Recommended)

### Step 1: Connect Square in Composio

1. Log into Composio at https://app.composio.dev
2. Navigate to **Connections** > **Add Connection**
3. Search for **Square** and select it
4. Click **Connect** and complete the Square OAuth flow:
   - Log into your Square account
   - Authorize the requested permissions (read-only)
   - Composio handles token storage and refresh
5. Note the **Connection ID**

### Step 2: Configure Permissions (OAuth Scopes)

Request only the scopes StyleClaw needs:

| Square OAuth Scope                  | Purpose                              | Required |
|-------------------------------------|--------------------------------------|:--------:|
| `APPOINTMENTS_READ`                 | Read bookings for reminders          | Yes      |
| `ITEMS_READ`                        | Read service catalog and pricing     | Yes      |
| `MERCHANT_PROFILE_READ`             | Read business info and locations     | Yes      |
| `EMPLOYEES_READ`                    | Read team member profiles            | Yes      |
| `APPOINTMENTS_WRITE`                | Create/modify bookings               | No       |
| `CUSTOMERS_READ`                    | Read customer data                   | No       |
| `PAYMENTS_READ`                     | Read payment data                    | No       |

### Step 3: Add to .env

```bash
# Square via Composio
BOOKING_PLATFORM=square
COMPOSIO_ENABLED=true
COMPOSIO_API_KEY=your_composio_api_key
COMPOSIO_SQUARE_CONNECTION_ID=your_connection_id

# Square location ID (find in Square Dashboard > Locations)
BOOKING_LOCATION_ID=your_square_location_id

# Square online booking URL
BOOKING_URL=https://squareup.com/appointments/book/your-business-slug/your-location-id

# Square environment
SQUARE_ENVIRONMENT=production  # or "sandbox" for testing
```

---

## Setup via Direct API (Alternative)

### Step 1: Create a Square Application

1. Go to https://developer.squareup.com/apps
2. Click **New Application**
3. Name: `StyleClaw - {Your Salon Name}`
4. Note the **Application ID** and **Access Token**

### Step 2: Generate Access Token

For production, use OAuth 2.0 (not personal access tokens):

```bash
# OAuth authorization URL
https://connect.squareup.com/oauth2/authorize?\
client_id=${SQUARE_APP_ID}&\
scope=APPOINTMENTS_READ+ITEMS_READ+MERCHANT_PROFILE_READ+EMPLOYEES_READ&\
session=false&\
state=your_random_state_string
```

### Step 3: Configure .env

```bash
BOOKING_PLATFORM=square
COMPOSIO_ENABLED=false
SQUARE_ACCESS_TOKEN=your_oauth_access_token
SQUARE_APP_ID=your_application_id
SQUARE_APP_SECRET=your_application_secret
BOOKING_LOCATION_ID=your_location_id
SQUARE_ENVIRONMENT=production
BOOKING_URL=https://squareup.com/appointments/book/your-slug/your-location-id
```

### Step 4: Token Refresh

Square OAuth tokens expire after 30 days. Implement automatic refresh:

```bash
# Refresh endpoint
POST https://connect.squareup.com/oauth2/token
Content-Type: application/json

{
  "client_id": "${SQUARE_APP_ID}",
  "client_secret": "${SQUARE_APP_SECRET}",
  "grant_type": "refresh_token",
  "refresh_token": "${SQUARE_REFRESH_TOKEN}"
}
```

Composio handles this automatically — another reason to use it.

---

## Data Mapping

### Services (Catalog Items)

Square stores services as `CatalogItem` objects with `APPOINTMENTS_SERVICE` type.

| Square Field                          | StyleClaw Field   | Notes                            |
|---------------------------------------|-------------------|----------------------------------|
| `item_data.name`                      | Service name      | Display name                     |
| `item_data.description`              | Description       | HTML may need stripping          |
| `item_variation_data.price_money`    | Price             | In smallest currency unit (cents)|
| `item_variation_data.service_duration`| Duration          | In milliseconds — convert to min |
| `item_data.category_id`             | Category          | Resolve via Catalog API          |
| `item_variation_data.team_member_ids`| Available stylists| Who can perform this service     |

**Price conversion:** Square returns prices in cents. Divide by 100 for display.
```
$8500 → $85.00
```

**Duration conversion:** Square returns duration in milliseconds.
```
3600000ms → 60 minutes
```

### Team Members

| Square Field                      | StyleClaw Field   | Notes                        |
|-----------------------------------|-------------------|------------------------------|
| `team_member.given_name`          | First name        | Display name                 |
| `team_member.family_name`         | Last name         | May not be used in chat      |
| `team_member.email_address`       | Email             | Do NOT expose to clients     |
| `team_member.phone_number`        | Phone             | Do NOT expose to clients     |
| `booking_profile.display_name`    | Display name      | Public-facing name           |
| `booking_profile.profile_image_url`| Photo URL        | For widget display           |

### Availability

Use the Bookings API `search_availability` endpoint:

```bash
POST https://connect.squareup.com/v2/bookings/availability/search

{
  "query": {
    "filter": {
      "start_at_range": {
        "start_at": "2026-03-12T00:00:00Z",
        "end_at": "2026-03-19T00:00:00Z"
      },
      "location_id": "${BOOKING_LOCATION_ID}",
      "segment_filters": [{
        "service_variation_id": "service_variation_id",
        "team_member_id_filter": {
          "any": ["team_member_id"]
        }
      }]
    }
  }
}
```

**Note:** Use availability data for general guidance ("Sarah has openings Thursday afternoon") but always direct clients to the booking link for real-time accuracy.

---

## Deep Linking

Square Appointments supports deep links:

```
# General booking page
https://squareup.com/appointments/book/{business_slug}/{location_id}

# With staff pre-selected
https://squareup.com/appointments/book/{business_slug}/{location_id}/staff/{staff_id}

# With service pre-selected
https://squareup.com/appointments/book/{business_slug}/{location_id}/service/{service_id}
```

---

## Multi-Location Support (Agency)

Square natively supports multiple locations. For Agency-tier multi-location deployments:

```bash
# List all locations
GET https://connect.squareup.com/v2/locations

# Use location_id to scope all API calls
# Each location has its own services, staff, and availability
```

Configure per-location knowledge bases and route by the client's selected location.

---

## Webhook Integration (Pro/Agency)

Square supports webhooks for real-time updates:

```bash
# Subscribe to booking events
POST https://connect.squareup.com/v2/webhooks/subscriptions

{
  "subscription": {
    "name": "styleclaw-bookings",
    "enabled": true,
    "event_types": [
      "booking.created",
      "booking.updated"
    ],
    "notification_url": "https://your-domain.com/webhooks/square"
  }
}
```

Use booking webhooks to trigger appointment reminders instead of polling.

---

## Troubleshooting

| Issue                              | Solution                                                    |
|------------------------------------|-------------------------------------------------------------|
| "UNAUTHORIZED" errors              | Check access token; may need refresh                        |
| Services return empty              | Verify Appointments is enabled on your Square account       |
| Wrong location data                | Check `BOOKING_LOCATION_ID` matches intended location       |
| Prices showing in cents            | Ensure price conversion (divide by 100) is applied          |
| Durations in milliseconds          | Ensure duration conversion (divide by 60000) is applied     |
| Token expired                      | Refresh via OAuth or re-connect in Composio                 |
| Sandbox vs production mismatch     | Check `SQUARE_ENVIRONMENT` setting                          |

---

## Square API Rate Limits

| Tier         | Limit                              |
|--------------|------------------------------------|
| Default      | 1000 requests per minute per app   |
| Bookings API | 100 requests per minute            |
| Catalog API  | 1000 requests per minute           |

StyleClaw's usage patterns stay well within these limits.
