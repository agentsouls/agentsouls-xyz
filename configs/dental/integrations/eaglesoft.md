# DentalClaw — Eaglesoft Integration Notes

Integration notes for connecting DentalClaw to Patterson Eaglesoft practice
management software. Eaglesoft integration is available but requires additional
configuration due to Eaglesoft's architecture.

---

## Current Status

| Feature | Status | Notes |
|---------|--------|-------|
| Appointment viewing | Available via middleware | Not direct API |
| Slot availability | Available via middleware | Inferred from schedule |
| Direct booking | Planned | Requires Patterson partnership |
| Patient lookup | Limited | Name + phone only |
| Clinical data | Blocked | Never accessed |

---

## Architecture Differences

Unlike Dentrix and NexHealth, Eaglesoft does not expose a standard REST API.
Integration requires one of the following middleware approaches:

### Option A: NexHealth Middleware (Recommended)

NexHealth connects directly to Eaglesoft and exposes a modern REST API.

1. Sign up for NexHealth and connect it to your Eaglesoft installation.
2. Follow the [NexHealth Integration Guide](./nexhealth.md).
3. Set `CALENDAR_PROVIDER=nexhealth` in `.env`.

This is the recommended approach — it provides the richest feature set and
is fully supported by DentalClaw.

### Option B: Eaglesoft Bridge (Community)

A community-maintained bridge service that reads Eaglesoft's local database
and exposes a read-only REST API.

```bash
# In .env
EAGLESOFT_API_URL=http://localhost:9090/api
EAGLESOFT_API_KEY=your-bridge-api-key
EAGLESOFT_API_HOST=localhost
CALENDAR_PROVIDER=eaglesoft
```

**Requirements:**
- The bridge must run on the same machine or network as the Eaglesoft server.
- Eaglesoft uses a Firebird database — the bridge reads it directly.
- The bridge must be configured for read-only access.

**Limitations:**
- Community-maintained; not officially supported by Patterson or ClawBuilt.
- May break with Eaglesoft updates.
- No write access (booking must be done by staff).

### Option C: Manual / Google Calendar Hybrid

For practices that want minimal integration complexity:

1. Staff maintains a Google Calendar that mirrors the Eaglesoft schedule.
2. DentalClaw reads the Google Calendar for availability.
3. Booking requests are captured as messages for staff to enter in Eaglesoft.

Follow the [Google Calendar Integration Guide](./google-calendar.md).

---

## Configuration (Option B — Eaglesoft Bridge)

```yaml
tools:
  calendar:
    enabled: true
    provider: eaglesoft
    mode: read_only
    providers:
      eaglesoft:
        api_url: "${EAGLESOFT_API_URL}"
        api_key: "${EAGLESOFT_API_KEY}"
```

Network allowlist:

```yaml
security:
  sandbox:
    network:
      allowed_hosts:
        - "${EAGLESOFT_API_HOST}"
```

---

## Data Mapping (Eaglesoft Bridge)

| Eaglesoft Field | DentalClaw Field | Notes |
|-----------------|-----------------|-------|
| `schedule.date` | `slot.date` | — |
| `schedule.start_time` | `slot.time` | — |
| `schedule.duration` | `slot.duration_minutes` | — |
| `schedule.provider` | `provider.display_name` | — |
| `schedule.status` | `appointment.status` | Mapped to standard statuses |
| `patient.name` | `patient.first_name` | First name only for greeting |
| `patient.phone` | `patient.phone` | Lookup key |

**Blocked (never read):**
- All clinical tables (charting, treatment, perio)
- Financial tables (ledger, insurance claims, payments)
- Patient demographics beyond name and phone

---

## Security Considerations

- The Eaglesoft Bridge must run behind a firewall — never expose it to the internet.
- Use a dedicated read-only database user for the bridge.
- The bridge API should require authentication (API key at minimum).
- Monitor bridge logs for unusual query patterns.
- Eaglesoft's Firebird database contains all clinical and financial data.
  The bridge must be configured to only expose scheduling tables.

---

## Patterson API Program

Patterson Dental has an emerging API program for Eaglesoft. When a supported
REST API becomes available:

1. ClawBuilt will release an official Eaglesoft connector.
2. Configuration will mirror the Dentrix integration pattern.
3. Contact support@clawbuilt.ai for updates on Eaglesoft API availability.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Bridge connection refused | Verify bridge is running and port is correct |
| Stale schedule data | Bridge may need restart; check sync interval |
| Missing providers | Bridge config may not include all providers |
| Firebird errors | Eaglesoft may have locked the database; check concurrent access |

---

## Recommendation

For new Eaglesoft deployments, we strongly recommend **Option A (NexHealth)**.
NexHealth provides a stable, supported middleware layer with full booking
capabilities and a modern API. The Eaglesoft bridge (Option B) is suitable
for practices that cannot adopt NexHealth and need basic read-only access.

---

*DentalClaw v1.0.0 — Eaglesoft Integration*
*ClawBuilt — https://clawbuilt.ai*
