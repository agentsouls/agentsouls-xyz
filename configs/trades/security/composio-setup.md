# TradeClaw — Composio OAuth Setup Guide

## Overview

Composio acts as an OAuth broker for TradeClaw's third-party integrations. Instead of managing OAuth tokens directly in your application, Composio handles the OAuth flow, token storage, and automatic refresh for all connected services.

This simplifies integration setup and improves security — your application never stores raw OAuth tokens.

---

## Why Composio

| Without Composio | With Composio |
|---|---|
| Implement OAuth flow per integration | Single OAuth flow via Composio |
| Store and encrypt tokens yourself | Composio manages token storage |
| Handle token refresh logic | Automatic token refresh |
| Risk of token leakage | Tokens never touch your server |
| Per-integration auth debugging | Centralized auth dashboard |

---

## Prerequisites

1. Composio account (https://composio.dev)
2. Composio API key
3. The client's credentials for each integration (ServiceTitan, Housecall Pro, Google, etc.)

---

## Setup

### Step 1: Install Composio SDK

```bash
pip install composio-core
# or
npm install composio-core
```

### Step 2: Configure Environment

```bash
COMPOSIO_API_KEY=your-composio-api-key
COMPOSIO_ENTITY_ID=client-unique-id  # One per client deployment
```

### Step 3: Connect Integrations

#### ServiceTitan via Composio

```python
from composio import ComposioToolSet, App

toolset = ComposioToolSet(api_key=os.environ["COMPOSIO_API_KEY"])

# Initiate connection — returns a URL for the client to authorize
connection = toolset.initiate_connection(
    app=App.SERVICETITAN,
    entity_id=os.environ["COMPOSIO_ENTITY_ID"],
    redirect_url="https://your-domain.com/auth/callback"
)

print(f"Have the client visit: {connection.redirect_url}")
```

The client clicks the link, logs into ServiceTitan, authorizes the app, and Composio stores the tokens.

#### Housecall Pro via Composio

```python
connection = toolset.initiate_connection(
    app=App.HOUSECALL_PRO,
    entity_id=os.environ["COMPOSIO_ENTITY_ID"],
    redirect_url="https://your-domain.com/auth/callback"
)
```

#### Google (for Google LSA / Google Business Profile)

```python
connection = toolset.initiate_connection(
    app=App.GOOGLE,
    entity_id=os.environ["COMPOSIO_ENTITY_ID"],
    redirect_url="https://your-domain.com/auth/callback",
    scopes=["https://www.googleapis.com/auth/local-services"]
)
```

### Step 4: Use Connected Integration

Once connected, use Composio to make authenticated API calls:

```python
# Execute an action through Composio
result = toolset.execute_action(
    action="servicetitan_get_customer",
    params={"phone": "5551234567"},
    entity_id=os.environ["COMPOSIO_ENTITY_ID"]
)
```

Or retrieve the access token for direct API calls:

```python
# Get the current (auto-refreshed) access token
connection = toolset.get_connection(
    app=App.SERVICETITAN,
    entity_id=os.environ["COMPOSIO_ENTITY_ID"]
)
access_token = connection.access_token

# Use directly with requests
response = requests.get(
    f"{SERVICETITAN_API_URL}/customers?phone=5551234567",
    headers={"Authorization": f"Bearer {access_token}"}
)
```

---

## Integration Status Dashboard

Composio provides a dashboard showing:
- Connection status for each integration
- Token expiration status
- Last successful API call
- Error logs

Access at: `https://app.composio.dev/entities/{COMPOSIO_ENTITY_ID}`

---

## Supported Integrations

| Integration | Composio App | Auth Type |
|---|---|---|
| ServiceTitan | `App.SERVICETITAN` | OAuth 2.0 |
| Housecall Pro | `App.HOUSECALL_PRO` | OAuth 2.0 |
| Google (LSA) | `App.GOOGLE` | OAuth 2.0 |
| Twilio | `App.TWILIO` | API Key (manual) |
| Thumbtack | `App.THUMBTACK` | API Key (manual) |

Note: Twilio and Thumbtack use API keys, not OAuth. You can still register them in Composio for centralized credential management, but there's no OAuth flow to automate.

---

## Security Notes

- Composio stores tokens encrypted at rest with AES-256
- Tokens are transmitted over TLS only
- Your application never stores raw OAuth tokens (Composio is the single source of truth)
- Revoke access instantly from the Composio dashboard if a client churns or a breach occurs
- Entity IDs should be unique per client — never reuse across deployments

---

## Troubleshooting

| Issue | Solution |
|---|---|
| "Connection not found" | Client hasn't completed OAuth flow. Resend the auth URL. |
| "Token expired" | Should auto-refresh. If not, reconnect via Composio dashboard. |
| "Permission denied" | Client's account may not have API access. Check with the platform. |
| "Rate limited" | Composio passes through rate limits from the upstream API. Implement caching. |
