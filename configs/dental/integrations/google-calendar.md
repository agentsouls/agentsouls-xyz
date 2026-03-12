# DentalClaw — Google Calendar Integration Guide

Connect DentalClaw to Google Calendar for read-only appointment viewing. This
is the simplest calendar integration option, suitable for practices that manage
scheduling through Google Workspace or want a lightweight availability check.

---

## Overview

| Feature | Access Level | Notes |
|---------|-------------|-------|
| View events/appointments | Read-only | See what's booked |
| Check available slots | Read-only | Infer openings from free/busy |
| Create appointments | Not available | Use NexHealth for booking |
| Modify/delete events | Not available | Read-only scope enforced |

---

## Prerequisites

- Google Workspace or personal Google account for the practice
- A dedicated Google Calendar for appointments (recommended)
- Google Cloud Console access to create OAuth credentials
- The calendar must be maintained by staff — DentalClaw only reads it

---

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project: `DentalClaw-[PracticeName]`.
3. Enable the **Google Calendar API**:
   - Navigate to **APIs & Services > Library**.
   - Search for "Google Calendar API".
   - Click **Enable**.

---

## Step 2: Create OAuth Credentials

### Option A: Service Account (Recommended for Server Deployments)

1. Go to **APIs & Services > Credentials**.
2. Click **Create Credentials > Service Account**.
3. Name: `dentalclaw-calendar-reader`.
4. Grant no additional roles (we'll scope access via calendar sharing).
5. Click **Done**.
6. Click the service account, go to **Keys > Add Key > Create new key > JSON**.
7. Download the JSON key file.
8. Save it to the server:

```bash
sudo cp ~/Downloads/service-account-key.json /secrets/google-calendar-credentials.json
sudo chmod 600 /secrets/google-calendar-credentials.json
sudo chown $USER:$USER /secrets/google-calendar-credentials.json
```

9. Share the practice calendar with the service account email:
   - Open Google Calendar settings.
   - Find the appointment calendar.
   - Under **Share with specific people**, add the service account email
     (e.g., `dentalclaw-calendar-reader@your-project.iam.gserviceaccount.com`).
   - Set permission to **See all event details**.

### Option B: OAuth 2.0 Client (For Interactive Setup)

1. Go to **APIs & Services > Credentials**.
2. Click **Create Credentials > OAuth 2.0 Client ID**.
3. Application type: **Web application**.
4. Add authorized redirect URI: `http://localhost:8080/oauth/callback`.
5. Download the client JSON.
6. Run the one-time OAuth flow to obtain a refresh token:

```bash
docker compose exec dentalclaw python /app/tools/google_calendar_auth.py \
  --credentials /secrets/google-calendar-credentials.json \
  --scopes "https://www.googleapis.com/auth/calendar.readonly"
```

7. Follow the browser prompt to authorize.
8. The refresh token is stored securely in `/secrets/google-calendar-token.json`.

---

## Step 3: Configure Environment

```bash
# In .env
GOOGLE_CALENDAR_CREDENTIALS=/secrets/google-calendar-credentials.json
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
CALENDAR_PROVIDER=google_calendar
```

To find your Calendar ID:
1. Open Google Calendar.
2. Click the three dots next to your appointment calendar > **Settings**.
3. Scroll to **Integrate calendar** > **Calendar ID**.

---

## Step 4: Configure DentalClaw

```yaml
tools:
  calendar:
    enabled: true
    provider: google_calendar
    mode: read_only
    providers:
      google_calendar:
        credentials_path: "/secrets/google-calendar-credentials.json"
        calendar_id: "${GOOGLE_CALENDAR_ID}"
        scopes:
          - "https://www.googleapis.com/auth/calendar.readonly"
```

Add Google APIs to the network allowlist:

```yaml
security:
  sandbox:
    network:
      allowed_hosts:
        - "www.googleapis.com"
        - "oauth2.googleapis.com"
        - "calendar-json.googleapis.com"
```

---

## Step 5: How Availability Is Determined

Google Calendar doesn't have native "appointment slots" like a PMS. DentalClaw
infers availability using the **free/busy** API:

1. Define office hours in the harness config (e.g., Mon-Thu 8-5, Fri 8-2).
2. Query the free/busy API for the requested date range.
3. Subtract booked events from office hours to find open slots.
4. Present open slots to the patient.

### Configuration for Slot Inference

```yaml
# In hermes-config.yaml or openclaw.yaml
tools:
  calendar:
    slot_inference:
      enabled: true
      default_duration_minutes: 60
      min_slot_duration_minutes: 30
      buffer_between_slots_minutes: 15
      max_slots_to_show: 3
      lookahead_days: 14
```

### API Call

```bash
POST https://www.googleapis.com/calendar/v3/freeBusy
{
  "timeMin": "2026-03-15T08:00:00-04:00",
  "timeMax": "2026-03-20T17:00:00-04:00",
  "items": [
    {"id": "your-calendar-id@group.calendar.google.com"}
  ]
}
```

Response provides `busy` blocks. DentalClaw calculates available slots from
the gaps.

---

## Step 6: Event Data Mapping

| Google Calendar Field | DentalClaw Usage | Notes |
|----------------------|-----------------|-------|
| `summary` | Appointment type hint | "Cleaning - Jane D." |
| `start.dateTime` | Slot start time | — |
| `end.dateTime` | Slot end time | — |
| `status` | Confirmed/tentative | — |
| `description` | Not used | May contain PHI — blocked |
| `attendees` | Not used | Privacy |
| `location` | Not used | — |

**Important:** Event descriptions and attendee details are never read or
logged, as they may contain clinical notes or patient information.

---

## Step 7: Test the Connection

```bash
# Test from the DentalClaw container
docker compose exec dentalclaw python -c "
from google.oauth2 import service_account
from googleapiclient.discovery import build

creds = service_account.Credentials.from_service_account_file(
    '/secrets/google-calendar-credentials.json',
    scopes=['https://www.googleapis.com/auth/calendar.readonly']
)
service = build('calendar', 'v3', credentials=creds)
events = service.events().list(
    calendarId='${GOOGLE_CALENDAR_ID}',
    maxResults=5,
    singleEvents=True,
    orderBy='startTime'
).execute()
for event in events.get('items', []):
    print(event['start'].get('dateTime'), '-', event.get('summary', 'No title'))
"
```

---

## Limitations

- **No direct booking.** Google Calendar integration is read-only. To enable
  online booking, pair with NexHealth or upgrade to Dentrix read-write.
- **No appointment types.** Google Calendar events don't have structured
  appointment type metadata. The agent infers type from event title.
- **No patient records.** Google Calendar has no concept of patient profiles.
  Patient lookup is not available with this integration.
- **Manual sync required.** Staff must keep the Google Calendar up to date.
  If an appointment is booked by phone and not added to the calendar, the
  agent may show that slot as available.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 403 Forbidden | Calendar not shared with service account email |
| 401 Unauthorized | Credentials file missing or invalid |
| No events returned | Wrong Calendar ID (check for `@group.calendar.google.com`) |
| Stale availability | Staff not updating calendar — operational issue |
| Token expired (OAuth) | Re-run the OAuth flow for a new refresh token |

---

## Security Notes

- Use a **service account** in production — no refresh token expiration issues.
- The service account should only have access to the appointment calendar,
  not personal calendars or other organizational calendars.
- Store credentials in `/secrets/` with `chmod 600`.
- The read-only scope (`calendar.readonly`) prevents any write operations
  even if the code has a bug.
- Google API calls are logged in the DentalClaw audit log (endpoint + calendar
  ID only, no event content).

---

*DentalClaw v1.0.0 — Google Calendar Integration*
*ClawBuilt — https://clawbuilt.ai*
