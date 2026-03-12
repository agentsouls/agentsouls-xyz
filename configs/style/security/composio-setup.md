# StyleClaw — Composio OAuth Setup Guide

> Composio manages OAuth connections to booking platforms and third-party services, handling token lifecycle, refresh, and secure storage.

---

## Overview

Composio is an integration platform that simplifies OAuth connections for AI agents. Instead of managing API keys, refresh tokens, and token rotation yourself, Composio handles the entire OAuth lifecycle.

**StyleClaw uses Composio for:**
- Booking platform connections (Vagaro, Square, Booksy, Boulevard)
- Google Business Profile integration
- Future integrations as they're added

**Why Composio over direct API keys?**
- Automatic token refresh — no expired token downtime
- Centralized connection management dashboard
- Standardized interface across different booking platforms
- Audit log of all API access
- Revoke access from one dashboard

---

## Prerequisites

- Composio account: https://app.composio.dev (free tier available)
- Admin access to the booking platform account you're connecting
- StyleClaw `.env` file ready for credentials

---

## Step 1: Create a Composio Account

1. Go to https://app.composio.dev and sign up
2. Create a new **Workspace** for your salon (or your agency if managing multiple salons)
3. Navigate to **Settings** > **API Keys**
4. Generate a new API key
5. Copy it to your `.env`:

```bash
COMPOSIO_API_KEY=your_composio_api_key
COMPOSIO_ENABLED=true
```

---

## Step 2: Create an Entity (Per Salon)

In Composio, an "Entity" represents the end-user or business whose accounts are being connected.

### For Single Salon (Starter/Pro)

```bash
# Via Composio CLI
composio entities create --name "Your Salon Name" --id "your-salon-slug"
```

Or via the dashboard: **Entities** > **Create Entity**

### For Agency (Multiple Salons)

Create one entity per salon:

```bash
composio entities create --name "Salon A" --id "salon-a"
composio entities create --name "Salon B" --id "salon-b"
composio entities create --name "Salon C" --id "salon-c"
```

Add the entity ID to each salon's `.env`:

```bash
COMPOSIO_ENTITY_ID=your-salon-slug
```

---

## Step 3: Connect Booking Platform

### Via Dashboard (Recommended)

1. Navigate to **Connections** > **Add Connection**
2. Select your booking platform:
   - **Vagaro** — Search for "Vagaro"
   - **Square** — Search for "Square"
   - **Booksy** — Search for "Booksy"
   - **Boulevard** — Search for "Boulevard"
3. Select the Entity (salon) this connection belongs to
4. Click **Connect** and complete the OAuth flow:
   - You'll be redirected to the booking platform's login page
   - Log in with your salon's admin account
   - Authorize the requested permissions (read-only)
   - You'll be redirected back to Composio
5. The connection is now active. Note the **Connection ID**.

### Via CLI

```bash
# Initiate connection
composio connections create \
  --app vagaro \
  --entity your-salon-slug \
  --scopes "read:services,read:staff,read:appointments"

# This returns an authorization URL — open it in your browser
# Complete the OAuth flow
# The connection ID is returned upon completion
```

### Via API

```bash
curl -X POST https://api.composio.dev/v1/connections \
  -H "Authorization: Bearer ${COMPOSIO_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "app": "vagaro",
    "entity_id": "your-salon-slug",
    "scopes": ["read:services", "read:staff", "read:appointments"]
  }'
```

---

## Step 4: Configure Permissions

After connecting, verify and restrict permissions:

### Vagaro

| Permission              | Status   | Notes                        |
|-------------------------|----------|------------------------------|
| Read Services           | Enabled  | Required                     |
| Read Staff              | Enabled  | Required                     |
| Read Appointments       | Enabled  | For reminders (Pro/Agency)   |
| Write Appointments      | Disabled | Agent is read-only           |
| Read Clients            | Disabled | Privacy protection           |

### Square

| Permission              | Status   | Notes                        |
|-------------------------|----------|------------------------------|
| APPOINTMENTS_READ       | Enabled  | Required                     |
| ITEMS_READ              | Enabled  | Required                     |
| MERCHANT_PROFILE_READ   | Enabled  | Required                     |
| EMPLOYEES_READ          | Enabled  | Required                     |
| APPOINTMENTS_WRITE      | Disabled | Agent is read-only           |
| CUSTOMERS_READ          | Disabled | Privacy protection           |

### Booksy

| Permission              | Status   | Notes                        |
|-------------------------|----------|------------------------------|
| Read Services           | Enabled  | Required                     |
| Read Staff              | Enabled  | Required                     |
| Read Appointments       | Enabled  | For reminders                |
| Write Appointments      | Disabled | Agent is read-only           |
| Read Clients            | Disabled | Privacy protection           |

### Boulevard

| Permission              | Status   | Notes                        |
|-------------------------|----------|------------------------------|
| services:read           | Enabled  | Required                     |
| staff:read              | Enabled  | Required                     |
| locations:read          | Enabled  | Required                     |
| appointments:read       | Enabled  | For reminders                |
| availability:read       | Enabled  | Required                     |
| appointments:write      | Disabled | Agent is read-only           |
| clients:read            | Disabled | Privacy (unless Agency)      |

---

## Step 5: Add Connection to .env

After creating the connection, add the Connection ID to your salon's `.env`:

```bash
# For Vagaro
COMPOSIO_VAGARO_CONNECTION_ID=conn_abc123

# For Square
COMPOSIO_SQUARE_CONNECTION_ID=conn_def456

# For Booksy
COMPOSIO_BOOKSY_CONNECTION_ID=conn_ghi789

# For Boulevard
COMPOSIO_BOULEVARD_CONNECTION_ID=conn_jkl012
```

---

## Step 6: Add Google Business Profile (Optional)

If you want the agent to reference Google Business info or manage review responses:

1. In Composio, add a **Google Business Profile** connection
2. Authorize with the Google account that manages your salon's listing
3. Scopes: read-only access to business info and reviews
4. Add connection ID to `.env`:

```bash
COMPOSIO_GOOGLE_BUSINESS_CONNECTION_ID=conn_mno345
```

---

## Step 7: Verify Connections

### Via Dashboard

Navigate to **Connections** and verify all connections show **Active** status.

### Via CLI

```bash
composio connections list --entity your-salon-slug
```

### Via API

```bash
curl -s https://api.composio.dev/v1/connections?entity_id=your-salon-slug \
  -H "Authorization: Bearer ${COMPOSIO_API_KEY}" | jq .
```

### From StyleClaw

After deploying the agent, check the health endpoint:

```bash
curl http://localhost:3100/health
# Should include: "integrations": {"booking_platform": "connected"}
```

---

## Token Lifecycle

Composio automatically handles token refresh for all supported platforms:

| Platform    | Token Lifetime  | Refresh      | Composio Handles |
|-------------|-----------------|--------------|:----------------:|
| Vagaro      | Varies          | Auto         | Yes              |
| Square      | 30 days         | Auto refresh | Yes              |
| Booksy      | Varies          | Auto         | Yes              |
| Boulevard   | 1 hour          | Auto refresh | Yes              |
| Google       | 1 hour          | Auto refresh | Yes              |

**No manual token rotation needed** when using Composio. If a connection enters a "Needs Reauthorization" state, re-complete the OAuth flow from the Composio dashboard.

---

## Security Best Practices

1. **Least privilege** — Only enable the scopes StyleClaw actually needs (read-only for most deployments)
2. **One entity per salon** — Don't share entities across different salons, even within an agency
3. **Monitor connection health** — Check the Composio dashboard weekly for any connection issues
4. **Audit logs** — Review Composio's audit log monthly for unexpected API access patterns
5. **Revocation** — If a salon churns or an employee leaves, revoke the Composio connection immediately
6. **API key rotation** — Rotate your Composio API key quarterly
7. **IP allowlisting** — If Composio supports it, restrict API access to your server's IP

---

## Troubleshooting

| Issue                                | Solution                                                    |
|--------------------------------------|-------------------------------------------------------------|
| Connection shows "Inactive"          | Re-authorize via Composio dashboard                         |
| "Invalid token" errors in agent logs | Check connection status; token may need manual re-auth      |
| Connection created but agent can't use it | Verify Connection ID in `.env` matches Composio           |
| "Scope not authorized" errors        | Re-connect with correct scopes enabled                      |
| Rate limited by booking platform     | Reduce polling frequency; check Composio for retry config   |
| Agency: wrong salon data returned    | Verify entity ID mapping per salon                          |

---

## Agency: Multi-Salon Management

For agencies managing multiple salons:

### Organizational Structure

```
Composio Workspace: "Your Agency"
├── Entity: "salon-a"
│   ├── Connection: Vagaro (salon A's account)
│   └── Connection: Google Business (salon A)
├── Entity: "salon-b"
│   ├── Connection: Square (salon B's account)
│   └── Connection: Google Business (salon B)
└── Entity: "salon-c"
    ├── Connection: Boulevard (salon C's account)
    └── Connection: Google Business (salon C)
```

### Per-Salon .env

Each salon deployment gets its own `.env` with its own entity and connection IDs. Never mix credentials across salons.

### Client Offboarding

When a salon client leaves:

1. Revoke the Composio connection: **Connections** > Select > **Revoke**
2. Delete the entity: **Entities** > Select > **Delete**
3. Remove the salon's `.env` and data from your deployment
4. Confirm data deletion per your retention policy
