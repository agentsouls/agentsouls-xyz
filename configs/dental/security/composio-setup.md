# DentalClaw — Composio OAuth Middleware Setup

Composio manages OAuth connections for all third-party integrations, providing
centralized token management, automatic refresh, permission scoping, and
revocation. This replaces storing raw OAuth tokens in environment variables.

---

## Why Composio

- **Token lifecycle management** — Automatic refresh before expiration.
- **Permission scoping** — Request only the minimum permissions needed.
- **Centralized revocation** — Disconnect an integration in one place.
- **Audit trail** — All OAuth operations are logged.
- **No raw tokens in .env** — Composio handles token storage securely.

---

## Step 1: Create a Composio Account

1. Go to [https://composio.dev](https://composio.dev).
2. Sign up for an account (free tier available; paid plans for production).
3. Create a new **Project** called `DentalClaw-[PracticeName]`.
4. Note your **Composio API Key** from the dashboard.

---

## Step 2: Install Composio CLI (Optional)

```bash
npm install -g composio-core
# or
pip install composio-core

# Authenticate
composio login
```

---

## Step 3: Configure Environment

Add to your `.env`:

```bash
# Composio
COMPOSIO_API_KEY=your-composio-api-key
COMPOSIO_PROJECT_ID=your-project-id
```

---

## Step 4: Set Up OAuth Connections

### 4a: Google Calendar

```bash
# Create a Google Calendar connection
composio add google-calendar \
  --project ${COMPOSIO_PROJECT_ID} \
  --scopes "calendar.readonly" \
  --name "dentalclaw-gcal"
```

This opens a browser for the OAuth consent flow. Authorize with the Google
account that owns the practice calendar.

**Permission scopes:**
- `https://www.googleapis.com/auth/calendar.readonly` — Read-only access

**Do NOT request:**
- `calendar` (full read-write)
- `calendar.events` (write access)

### 4b: NexHealth

NexHealth uses API keys rather than OAuth, but Composio can still manage them:

```bash
composio add custom-api \
  --project ${COMPOSIO_PROJECT_ID} \
  --name "dentalclaw-nexhealth" \
  --api-key "${NEXHEALTH_API_KEY}" \
  --base-url "https://nexhealth.info/api/v1"
```

### 4c: Birdeye

```bash
composio add custom-api \
  --project ${COMPOSIO_PROJECT_ID} \
  --name "dentalclaw-birdeye" \
  --api-key "${BIRDEYE_API_KEY}" \
  --base-url "https://api.birdeye.com"
```

### 4d: Twilio (if using voice/SMS)

```bash
composio add twilio \
  --project ${COMPOSIO_PROJECT_ID} \
  --account-sid "${TWILIO_ACCOUNT_SID}" \
  --auth-token "${TWILIO_AUTH_TOKEN}" \
  --name "dentalclaw-twilio"
```

---

## Step 5: Configure Permission Scopes

For each connection, verify that only minimum required permissions are granted.

| Integration | Required Scopes | Blocked Scopes |
|-------------|----------------|----------------|
| Google Calendar | `calendar.readonly` | `calendar` (write), `contacts`, `gmail` |
| NexHealth | `appointments:read`, `availabilities:read`, `patients:read` | `billing:*`, `clinical:*` |
| Birdeye | `reviews:generate`, `contacts:read` | `reviews:respond`, `admin:*` |
| Twilio | `calls:create`, `messages:create` | `recordings:*`, `account:*` |

---

## Step 6: API Key Configuration in DentalClaw

Instead of raw API keys in `.env`, reference Composio connections:

```yaml
# In hermes-config.yaml
tools:
  calendar:
    auth:
      method: composio
      connection_name: "dentalclaw-gcal"

  reviews:
    auth:
      method: composio
      connection_name: "dentalclaw-birdeye"
```

DentalClaw's Composio integration fetches tokens at runtime via the Composio
API, ensuring tokens are always fresh and properly scoped.

---

## Step 7: Token Refresh

Composio handles token refresh automatically:

- **Google Calendar OAuth tokens** expire every 60 minutes. Composio refreshes
  them using the refresh token before expiration.
- **API keys** (NexHealth, Birdeye) don't expire automatically but can be
  rotated through Composio.

### Manual Token Refresh

```bash
# Force refresh a connection's token
composio refresh --connection "dentalclaw-gcal"

# Via API
curl -X POST "https://api.composio.dev/v1/connections/dentalclaw-gcal/refresh" \
  -H "Authorization: Bearer ${COMPOSIO_API_KEY}"
```

### Monitoring Token Health

```bash
# Check all connection statuses
composio connections list --project ${COMPOSIO_PROJECT_ID}

# Via API
curl -H "Authorization: Bearer ${COMPOSIO_API_KEY}" \
  "https://api.composio.dev/v1/connections?project_id=${COMPOSIO_PROJECT_ID}"
```

Expected response includes `status`, `last_refreshed`, and `expires_at` for
each connection.

---

## Step 8: Token Revocation

When an integration is no longer needed, or when staff with access depart:

### Revoke a Single Connection

```bash
composio remove --connection "dentalclaw-gcal" --project ${COMPOSIO_PROJECT_ID}

# Via API
curl -X DELETE "https://api.composio.dev/v1/connections/dentalclaw-gcal" \
  -H "Authorization: Bearer ${COMPOSIO_API_KEY}"
```

This immediately revokes the token with the upstream provider (Google, etc.)
and removes it from Composio storage.

### Revoke All Connections (Emergency)

```bash
composio connections revoke-all --project ${COMPOSIO_PROJECT_ID} --confirm

# Via API
curl -X POST "https://api.composio.dev/v1/projects/${COMPOSIO_PROJECT_ID}/revoke-all" \
  -H "Authorization: Bearer ${COMPOSIO_API_KEY}"
```

Use this in case of a security incident to immediately disconnect all
integrations.

---

## Step 9: Audit Trail

Composio logs all OAuth operations. Access the audit log:

```bash
composio audit --project ${COMPOSIO_PROJECT_ID} --last 7d

# Via API
curl -H "Authorization: Bearer ${COMPOSIO_API_KEY}" \
  "https://api.composio.dev/v1/audit?project_id=${COMPOSIO_PROJECT_ID}&days=7"
```

Audit entries include:
- Connection creation/deletion
- Token refresh events
- Token usage (which tool called which connection)
- Failed authentication attempts
- Permission scope changes

---

## Step 10: Security Best Practices

1. **Rotate the Composio API key** every 90 days.
2. **Use project-level isolation** — each dental practice should have its own
   Composio project. Never share projects across practices.
3. **Enable Composio webhook notifications** for connection failures so you
   are alerted if a token stops working.
4. **Review active connections monthly** — remove any that are no longer needed.
5. **Never bypass Composio** to store tokens directly in `.env` in production.
   The `.env` file should only contain the Composio API key and project ID.
6. **IP allowlisting** — If Composio supports it, restrict API access to the
   DentalClaw server's IP address.

---

## Fallback: Direct API Keys

If Composio is not used (development or simple deployments), tokens are stored
directly in `.env`:

```bash
# Direct mode (not recommended for production)
NEXHEALTH_API_KEY=direct-api-key
BIRDEYE_API_KEY=direct-api-key
GOOGLE_CALENDAR_CREDENTIALS=/secrets/google-calendar-credentials.json
```

In direct mode, you are responsible for:
- Token rotation
- Refresh token handling
- Revocation on staff departure
- Audit logging of token usage

---

*DentalClaw v1.0.0 — Composio Setup*
*ClawBuilt — https://clawbuilt.ai*
