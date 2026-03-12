# StyleClaw — Boulevard Integration Guide

> **Tier:** Agency ($1,497) only
> **Integration type:** Boulevard GraphQL API + Composio OAuth

---

## Overview

Boulevard is a premium salon management platform built for high-end salons, spas, and multi-location beauty businesses. It features a modern GraphQL API, sophisticated appointment management, and enterprise-grade infrastructure.

**Why Agency-only:** Boulevard's API, pricing, and target market align with premium salon deployments. The integration complexity and Boulevard's own pricing tier make it best suited for Agency-level StyleClaw clients.

**What this integration enables:**
- Query services, staff, and locations via GraphQL
- Real-time availability with fine-grained slot data
- Appointment data for smart reminder workflows
- Multi-location routing (Boulevard's core strength)
- Client preference data for personalized experiences (with consent)

**What this integration does NOT do:**
- Create or modify appointments (read-only by design)
- Process payments or gift cards
- Access business analytics or financial reports

---

## Prerequisites

- Active Boulevard business account (Professional or Enterprise plan)
- Boulevard API access (enabled in Boulevard Dashboard > Settings > Developers)
- Composio account (recommended) or direct API credentials
- StyleClaw deployed on Hermes Agent (recommended for Boulevard's feature set)

---

## Setup via Composio (Recommended)

### Step 1: Connect Boulevard in Composio

1. Log into Composio at https://app.composio.dev
2. Navigate to **Connections** > **Add Connection**
3. Search for **Boulevard** and select it
4. Complete the OAuth authorization flow:
   - Log into your Boulevard dashboard
   - Authorize the requested scopes
   - Composio stores and auto-refreshes tokens
5. Note the **Connection ID**

### Step 2: Configure Scopes

Boulevard uses granular OAuth scopes:

| Scope                          | Required | Purpose                               |
|--------------------------------|:--------:|---------------------------------------|
| `services:read`               | Yes      | Service menu, pricing, durations      |
| `staff:read`                  | Yes      | Staff profiles, bios, specialties     |
| `locations:read`              | Yes      | Location details, hours               |
| `appointments:read`           | Yes      | For reminder cron jobs                 |
| `availability:read`           | Yes      | Real-time slot availability           |
| `clients:read`                | Optional | Client preferences (with consent)      |
| `appointments:write`          | No       | Agent does not create bookings         |
| `clients:write`               | No       | Not needed                             |

### Step 3: Add to .env

```bash
# Boulevard via Composio
BOOKING_PLATFORM=boulevard
COMPOSIO_ENABLED=true
COMPOSIO_API_KEY=your_composio_api_key
COMPOSIO_BOULEVARD_CONNECTION_ID=your_connection_id

# Boulevard business ID
BOOKING_LOCATION_ID=your_boulevard_business_id

# Boulevard online booking URL
BOOKING_URL=https://dashboard.boulevard.io/booking/your-business-slug

# For multi-location (Agency feature)
BOULEVARD_LOCATIONS=main:loc_abc123,downtown:loc_def456,westside:loc_ghi789
```

---

## Setup via Direct API (Alternative)

### Step 1: Enable API Access

1. In Boulevard Dashboard, go to **Settings** > **Developers**
2. Create a new API application
3. Note the **Client ID**, **Client Secret**, and **API endpoint**

### Step 2: Authenticate

Boulevard uses OAuth 2.0 with PKCE:

```bash
# Authorization endpoint
https://dashboard.boulevard.io/oauth/authorize?\
client_id=${BOULEVARD_CLIENT_ID}&\
redirect_uri=${REDIRECT_URI}&\
response_type=code&\
scope=services:read+staff:read+locations:read+appointments:read+availability:read&\
code_challenge=${CODE_CHALLENGE}&\
code_challenge_method=S256
```

### Step 3: Configure .env

```bash
BOOKING_PLATFORM=boulevard
COMPOSIO_ENABLED=false
BOULEVARD_CLIENT_ID=your_client_id
BOULEVARD_CLIENT_SECRET=your_client_secret
BOULEVARD_ACCESS_TOKEN=your_access_token
BOULEVARD_REFRESH_TOKEN=your_refresh_token
BOOKING_LOCATION_ID=your_business_id
BOOKING_URL=https://dashboard.boulevard.io/booking/your-slug
```

---

## GraphQL Queries

Boulevard uses a GraphQL API. Here are the key queries StyleClaw uses:

### Fetch Services

```graphql
query GetServices($locationId: ID!) {
  location(id: $locationId) {
    services {
      edges {
        node {
          id
          name
          description
          category {
            name
          }
          serviceOptions {
            edges {
              node {
                id
                name
                priceMoney {
                  amount
                  currency
                }
                durationMinutes
                staffVariants {
                  edges {
                    node {
                      staff {
                        id
                        displayName
                      }
                      priceMoney {
                        amount
                        currency
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### Fetch Staff

```graphql
query GetStaff($locationId: ID!) {
  location(id: $locationId) {
    staff {
      edges {
        node {
          id
          displayName
          firstName
          lastName
          title
          bio
          avatar {
            url
          }
          employmentStatus
          services {
            edges {
              node {
                name
              }
            }
          }
        }
      }
    }
  }
}
```

### Check Availability

```graphql
query GetAvailability(
  $locationId: ID!
  $serviceId: ID!
  $staffId: ID
  $startDate: Date!
  $endDate: Date!
) {
  availability(
    locationId: $locationId
    serviceId: $serviceId
    staffId: $staffId
    startDate: $startDate
    endDate: $endDate
  ) {
    slots {
      startAt
      endAt
      staffVariant {
        staff {
          displayName
        }
      }
    }
  }
}
```

### Fetch Locations (Multi-Location)

```graphql
query GetLocations {
  business {
    locations {
      edges {
        node {
          id
          name
          address {
            line1
            city
            state
            postalCode
          }
          phoneNumber
          businessHours {
            dayOfWeek
            openTime
            closeTime
          }
        }
      }
    }
  }
}
```

---

## Data Mapping

### Services

| Boulevard Field                        | StyleClaw Field   | Notes                                |
|----------------------------------------|-------------------|--------------------------------------|
| `service.name`                         | Service name      | Display name                         |
| `service.description`                  | Description       | Rich text — may need HTML stripping  |
| `serviceOption.priceMoney.amount`      | Price             | In cents — divide by 100             |
| `serviceOption.durationMinutes`        | Duration          | Already in minutes                   |
| `service.category.name`               | Category          | Service category                     |
| `staffVariant.priceMoney`             | Staff-specific price | Some staff may have different rates |

### Staff

| Boulevard Field              | StyleClaw Field   | Notes                        |
|------------------------------|-------------------|------------------------------|
| `staff.displayName`         | Display name      | Public-facing name           |
| `staff.title`               | Title/role        | Senior Stylist, etc.         |
| `staff.bio`                 | Bio               | Staff bio                    |
| `staff.avatar.url`          | Photo URL         | Profile image                |
| `staff.services`            | Specialties       | Services offered             |

---

## Multi-Location Routing (Agency Feature)

Boulevard excels at multi-location management. For Agency-tier deployments:

### Configuration

```yaml
# In hermes-config.yaml
multi_location:
  enabled: true
  provider: "boulevard"

  # How the agent determines which location the client is asking about
  routing_strategy: "ask_client"  # or "phone_number", "url_path", "geo_ip"

  locations:
    - id: "main"
      boulevard_id: "loc_abc123"
      name: "Main Street Studio"
      knowledge_path: "/data/knowledge/main/"
    - id: "downtown"
      boulevard_id: "loc_def456"
      name: "Downtown Location"
      knowledge_path: "/data/knowledge/downtown/"
    - id: "westside"
      boulevard_id: "loc_ghi789"
      name: "Westside Salon"
      knowledge_path: "/data/knowledge/westside/"

  # Agent asks "Which location are you interested in?" if not already determined
  location_prompt: "We have three locations — Main Street, Downtown, and Westside. Which one is most convenient for you?"
```

### Per-Location Knowledge

Each location can have its own:
- Service menu (if offerings differ)
- Staff bios
- Parking/access info
- Promotions

Shared knowledge (policies, product catalog) can be kept in a common directory.

---

## Boulevard-Specific Features

### Pricing Tiers

Boulevard supports staff-level pricing (e.g., Junior Stylist vs. Master Stylist at different rates for the same service). The agent should present this clearly:

> "A women's haircut ranges from $55 with our junior stylists to $95 with our master stylists. Would you like me to share who's available in each tier?"

### Service Add-Ons

Boulevard handles add-ons natively. Configure the agent to suggest relevant add-ons:

```yaml
# In knowledge base
addons:
  - service: "Color Service"
    suggested_addons:
      - "Deep Conditioning Treatment ($35)"
      - "Toner Refresh ($25)"
      - "Olaplex Treatment ($45)"
```

### Forms & Intake

Boulevard supports digital intake forms. The agent can remind new clients:

> "Before your first visit, you'll receive a quick intake form via email from Boulevard. Filling it out ahead of time saves time at check-in!"

---

## Troubleshooting

| Issue                              | Solution                                                    |
|------------------------------------|-------------------------------------------------------------|
| GraphQL query errors               | Check query syntax; verify field names against Boulevard schema |
| "Forbidden" scope errors           | Re-authorize with correct scopes in Composio               |
| Empty service list                 | Verify location ID; check services are active in Boulevard  |
| Staff-level pricing not showing    | Ensure `staffVariants` are included in the services query   |
| Multi-location routing confusion   | Clarify routing strategy; test each location independently  |
| Token expired                      | Re-authorize in Composio or refresh via OAuth               |

---

## Boulevard API Rate Limits

| Limit Type             | Value                      |
|------------------------|----------------------------|
| Requests per second    | 10                         |
| Requests per minute    | 300                        |
| Query complexity limit | 1000 points per query      |

For multi-location deployments, be mindful of query complexity — fetching all locations' services in one query may exceed complexity limits. Batch by location.
