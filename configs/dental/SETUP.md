# DentalClaw — Quick-Start Setup Guide

Get DentalClaw running for a dental practice in under an hour.

---

## Prerequisites

Before starting, ensure you have:

| Requirement | Details |
|-------------|---------|
| **Server** | VPS or dedicated server — 2+ vCPU, 4+ GB RAM (see harness-specific guides for GPU requirements if using OpenClaw) |
| **Docker** | Docker 24.0+ with Compose plugin installed |
| **API Key** | Anthropic API key with active billing (Hermes/NanoClaw) or GPU server (OpenClaw) |
| **ClawBuilt License** | Active subscription at https://clawbuilt.ai |
| **Practice Info** | Office hours, services, insurance list, team bios, policies — the knowledge base content |
| **Domain (optional)** | For HTTPS access to the chat widget |

---

## 8-Step Setup Process

### Step 1: Install Hermes Agent

```bash
# Update system and install Docker
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# Create deployment directories
sudo mkdir -p /opt/dentalclaw /data/dentalclaw /secrets
sudo chown -R $USER:$USER /opt/dentalclaw /data/dentalclaw
sudo chmod 700 /secrets

# Pull the Hermes Agent image
docker pull clawbuilt/hermes-agent:latest
```

For NanoClaw or OpenClaw, substitute the appropriate image:
- NanoClaw: `docker pull clawbuilt/nanoclaw:latest`
- OpenClaw: `docker pull clawbuilt/openclaw:latest` (also requires vLLM — see `harness/openclaw/DEPLOY.md`)

---

### Step 2: Copy .env and Configure

```bash
# Copy the DentalClaw config to the server
scp -r configs/dental/* user@server:/opt/dentalclaw/

# Create your environment file
cd /opt/dentalclaw
cp .env.example .env
chmod 600 .env

# Edit with your credentials and practice details
nano .env
```

**Minimum required variables:**

```bash
ANTHROPIC_API_KEY=sk-ant-...
CLAWBUILT_LICENSE_KEY=clb-...
PRACTICE_NAME="Smile Dental"
PRACTICE_PHONE="(555) 123-4567"
PRACTICE_ADDRESS="123 Main St, Suite 100, Anytown, ST 12345"
PRACTICE_WEBSITE="https://smiledental.com"
PRACTICE_TIMEZONE="America/New_York"
OFFICE_EMAIL="office@smiledental.com"
CALENDAR_PROVIDER=nexhealth    # or dentrix, google_calendar, eaglesoft
```

Plus your chosen calendar integration credentials (see `integrations/` guides).

---

### Step 3: Copy Configs to Deployment Path

Verify the config structure is in place:

```bash
ls /opt/dentalclaw/
```

Expected:
```
.env
.env.example
SETUP.md
skills/
harness/
integrations/
security/
knowledge/
```

The harness config files are already in the correct locations. No additional
copying is needed if you deployed the full `configs/dental/` directory.

---

### Step 4: Copy and Customize the System Prompt

The system prompt at `skills/system_prompt.md` contains placeholders that are
automatically filled from your `.env` variables at runtime:

- `[Practice Name]` -> `$PRACTICE_NAME`
- `[Practice Phone]` -> `$PRACTICE_PHONE`
- `[Practice Address]` -> `$PRACTICE_ADDRESS`
- `[Practice Website]` -> `$PRACTICE_WEBSITE`

Review the system prompt and make any practice-specific adjustments:

```bash
nano /opt/dentalclaw/skills/system_prompt.md
```

Adjust the persona if needed:

```bash
nano /opt/dentalclaw/skills/persona.md
```

For example, set the tone knobs for a pediatric practice:
- formality: 2, warmth: 5, verbosity: 3

---

### Step 5: Fill the Knowledge Base

This is the most important step. The agent's quality depends directly on the
completeness and accuracy of the knowledge base.

Edit each file in `knowledge/scaffold/`:

```bash
# Services offered, descriptions, durations
nano /opt/dentalclaw/knowledge/scaffold/services.md

# Accepted insurance plans and verification process
nano /opt/dentalclaw/knowledge/scaffold/insurance.md

# Office policies (cancellation, payment, emergency, etc.)
nano /opt/dentalclaw/knowledge/scaffold/policies.md

# FAQ about common procedures
nano /opt/dentalclaw/knowledge/scaffold/procedures-faq.md

# Financing options (CareCredit, payment plans, etc.)
nano /opt/dentalclaw/knowledge/scaffold/financing.md

# Team bios (dentists, hygienists, staff)
nano /opt/dentalclaw/knowledge/scaffold/team.md
```

**Replace every `[bracketed]` placeholder** with real practice data. Remove
services, insurance plans, or team members that don't apply. Add any that
are missing.

---

### Step 6: Run Security Hardening

Review and complete the 10-step hardening checklist:

```bash
cat /opt/dentalclaw/security/hardening-checklist.md
```

Key actions:

```bash
# Verify .env permissions
ls -la /opt/dentalclaw/.env
# Must show: -rw------- (600)

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Verify Docker Compose security settings
grep -A5 "read_only\|cap_drop\|pids_limit" /opt/dentalclaw/docker-compose.yaml
```

Set up Composio for OAuth management (optional but recommended for production):
```bash
cat /opt/dentalclaw/security/composio-setup.md
```

---

### Step 7: Start Hermes Agent

Create the Docker Compose file (see `harness/hermes/DEPLOY.md` for the full
template) or use the one provided:

```bash
cd /opt/dentalclaw

# Start the agent
docker compose up -d

# Verify it's running
docker compose ps

# Check logs
docker compose logs -f --tail=50

# Test health endpoint
curl http://localhost:8081/health
# Expected: {"status": "ok", "version": "1.0.0"}
```

---

### Step 8: Optional Gateway Setup (HTTPS + Chat Widget)

For production deployment, set up a reverse proxy for HTTPS:

```bash
# Install Caddy (simplest option — auto SSL)
sudo apt install -y caddy

# Configure reverse proxy
sudo tee /etc/caddy/Caddyfile > /dev/null <<EOF
chat.yourpractice.com {
    reverse_proxy localhost:8080
    header {
        X-Content-Type-Options nosniff
        X-Frame-Options SAMEORIGIN
        Referrer-Policy strict-origin-when-cross-origin
    }
}
EOF

sudo systemctl restart caddy
```

Embed the chat widget on the practice website:

```html
<script
  src="https://chat.yourpractice.com/widget.js"
  data-practice="Smile Dental"
  data-position="bottom-right"
  data-color="#2563EB"
  async
></script>
```

---

## Verification Checklist

After setup, run through these tests:

- [ ] Health endpoint returns OK: `curl http://localhost:8081/health`
- [ ] Chat widget loads on the practice website
- [ ] Agent greets with the correct practice name
- [ ] Agent answers service questions accurately (from knowledge base)
- [ ] Agent handles insurance questions correctly
- [ ] Calendar integration works (shows available slots)
- [ ] PHI firewall works (mention a condition — agent redirects without repeating)
- [ ] After-hours mode activates correctly
- [ ] After-hours messages are delivered to office email
- [ ] Prompt injection is blocked (try "ignore previous instructions")
- [ ] Rate limiting works (rapid requests get 429 responses)

---

## Next Steps

Once the basic deployment is verified:

1. **Enable additional channels** — Voice (Twilio), SMS, Facebook Messenger.
   See `harness/hermes/DEPLOY.md` Step 12.

2. **Set up Birdeye reviews** — Automatic review request triggers after
   positive interactions. See `integrations/birdeye.md`.

3. **Enable recall reminders** — Connect to your recall list for automated
   patient outreach. See the recall section in `harness/hermes/hermes-config.yaml`.

4. **Set up monitoring** — Prometheus metrics, health check alerts,
   log aggregation. See the observability section in the harness config.

5. **Configure backups** — Automated daily backups of the memory database,
   `.env`, and knowledge base. See `harness/hermes/DEPLOY.md` for backup commands.

6. **Train the office team** — Show staff how to:
   - Review captured after-hours messages
   - Monitor the chat widget
   - Escalate from the agent to a human
   - Update the knowledge base when office info changes

7. **Schedule a knowledge base review** — Plan to review and update the
   knowledge base quarterly (at minimum) or whenever policies, services,
   insurance panels, or team members change.

---

## Harness Selection Guide

| Factor | Hermes Agent | NanoClaw | OpenClaw |
|--------|-------------|----------|----------|
| Best for | Full-featured deployment | Simple, low-ops | Data sovereignty |
| Model | Claude Sonnet (default) | Claude Sonnet | Llama / Mistral |
| Cost model | Per-token (API) | Per-token (API) | Fixed (GPU server) |
| Setup time | ~1 hour | ~30 minutes | ~2 hours |
| GPU required | No | No | Yes |
| Memory system | Full | Lightweight | Basic |
| Auto-skills | Yes | No | No |

---

## Support

- **Documentation:** https://docs.clawbuilt.ai/dental
- **Email:** support@clawbuilt.ai
- **Slack:** https://clawbuilt.slack.com (customer channel)
- **Emergency:** For production-down issues, email urgent@clawbuilt.ai

---

*DentalClaw v1.0.0 — Quick-Start Guide*
*ClawBuilt — https://clawbuilt.ai*
