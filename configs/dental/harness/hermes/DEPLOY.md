# DentalClaw — Hermes Agent Deployment Guide

Step-by-step instructions for deploying DentalClaw on the Hermes Agent harness
in a dental office environment.

---

## Prerequisites

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Server | 2 vCPU, 4 GB RAM | 4 vCPU, 8 GB RAM |
| OS | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |
| Docker | 24.0+ | Latest stable |
| Docker Compose | 2.20+ | Latest stable |
| Anthropic API Key | Valid key with billing | — |
| ClawBuilt License | Active subscription | — |
| Domain (optional) | — | For HTTPS/widget |

---

## Step 1: Provision the Server

Spin up a VPS or dedicated server with your cloud provider. Recommended
providers: Hetzner, DigitalOcean, Linode, AWS EC2, or any provider supporting
Docker.

```bash
# Update the system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Docker Compose (if not bundled)
sudo apt install -y docker-compose-plugin

# Verify
docker --version
docker compose version
```

---

## Step 2: Create the Deployment Directory

```bash
sudo mkdir -p /opt/dentalclaw
sudo mkdir -p /data/dentalclaw/archive
sudo mkdir -p /secrets
sudo chown -R $USER:$USER /opt/dentalclaw /data/dentalclaw
sudo chmod 700 /secrets
```

---

## Step 3: Copy Configuration Files

Copy the DentalClaw config directory to the server:

```bash
# From your local machine:
scp -r configs/dental/* user@yourserver:/opt/dentalclaw/

# On the server, verify:
ls /opt/dentalclaw/
# Expected: skills/ harness/ integrations/ security/ knowledge/ .env.example SETUP.md
```

---

## Step 4: Configure Environment Variables

```bash
cd /opt/dentalclaw
cp .env.example .env
chmod 600 .env

# Edit with your practice-specific values
nano .env
```

At minimum, fill in:
- `ANTHROPIC_API_KEY`
- `CLAWBUILT_LICENSE_KEY`
- `PRACTICE_NAME`
- `PRACTICE_PHONE`
- `PRACTICE_ADDRESS`
- `PRACTICE_WEBSITE`
- `PRACTICE_TIMEZONE`
- `OFFICE_EMAIL`
- Calendar integration credentials (Dentrix, NexHealth, or Google Calendar)

---

## Step 5: Fill the Knowledge Base

Edit each file in `knowledge/scaffold/` with the practice's actual information:

```bash
nano /opt/dentalclaw/knowledge/scaffold/services.md
nano /opt/dentalclaw/knowledge/scaffold/insurance.md
nano /opt/dentalclaw/knowledge/scaffold/policies.md
nano /opt/dentalclaw/knowledge/scaffold/procedures-faq.md
nano /opt/dentalclaw/knowledge/scaffold/financing.md
nano /opt/dentalclaw/knowledge/scaffold/team.md
```

Every placeholder marked with `[brackets]` must be replaced with real practice
data. The agent's quality depends directly on the completeness of the knowledge
base.

---

## Step 6: Run the Security Hardening Checklist

```bash
# Review and execute hardening steps
cat /opt/dentalclaw/security/hardening-checklist.md

# Key actions:
# 1. Confirm Docker rootless or non-root user
# 2. Verify read-only rootfs in hermes-config.yaml
# 3. Set up UFW firewall rules
# 4. Restrict .env file permissions
# 5. Enable audit logging
```

See `security/hardening-checklist.md` for the full 10-step checklist.

---

## Step 7: Create the Docker Compose File

Create `/opt/dentalclaw/docker-compose.yaml`:

```yaml
version: "3.8"

services:
  dentalclaw:
    image: clawbuilt/hermes-agent:latest
    container_name: dentalclaw
    restart: unless-stopped
    read_only: true
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
    pids_limit: 100
    mem_limit: 512m
    cpus: "1.0"
    ports:
      - "127.0.0.1:8080:8080"    # Web chat (behind reverse proxy)
      - "127.0.0.1:8081:8081"    # Health check
    volumes:
      - /opt/dentalclaw/harness/hermes/hermes-config.yaml:/app/config/hermes-config.yaml:ro
      - /opt/dentalclaw/harness/hermes/memory-config.yaml:/app/config/memory-config.yaml:ro
      - /opt/dentalclaw/skills:/app/skills:ro
      - /opt/dentalclaw/knowledge:/app/knowledge:ro
      - /data/dentalclaw:/data/dentalclaw:rw
      - /secrets:/secrets:ro
    tmpfs:
      - /tmp:rw,noexec,nosuid,size=64m
    env_file:
      - .env
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8081/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 15s
    logging:
      driver: json-file
      options:
        max-size: "50m"
        max-file: "5"
```

---

## Step 8: Start the Agent

```bash
cd /opt/dentalclaw
docker compose up -d

# Check status
docker compose ps
docker compose logs -f --tail=50
```

Verify the health check:

```bash
curl http://localhost:8081/health
# Expected: {"status": "ok", "version": "1.0.0"}
```

---

## Step 9: Set Up Reverse Proxy (Recommended)

Use Caddy or Nginx for HTTPS termination and to expose the chat widget.

### Caddy (simplest)

```bash
sudo apt install -y caddy
```

Create `/etc/caddy/Caddyfile`:

```
chat.yourpractice.com {
    reverse_proxy localhost:8080
    header {
        X-Content-Type-Options nosniff
        X-Frame-Options SAMEORIGIN
        Referrer-Policy strict-origin-when-cross-origin
    }
}
```

```bash
sudo systemctl restart caddy
```

### Nginx alternative

```nginx
server {
    listen 443 ssl http2;
    server_name chat.yourpractice.com;

    ssl_certificate /etc/letsencrypt/live/chat.yourpractice.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/chat.yourpractice.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Step 10: Embed the Chat Widget

Add the following snippet to the practice website, just before `</body>`:

```html
<script
  src="https://chat.yourpractice.com/widget.js"
  data-practice="[Practice Name]"
  data-position="bottom-right"
  data-color="#2563EB"
  async
></script>
```

---

## Step 11: Test End-to-End

1. Open the practice website and verify the chat widget appears.
2. Send a greeting — confirm the agent responds with the practice name.
3. Ask about available appointments — confirm calendar integration works.
4. Mention a health condition — confirm the agent does NOT repeat it and
   redirects to scheduling.
5. Test after-hours behavior — confirm message capture works.
6. Check that the office email receives captured messages.
7. Review audit logs: `docker compose exec dentalclaw cat /data/dentalclaw/audit.log | tail -20`

---

## Step 12: Enable Optional Channels

### Twilio Voice / SMS

1. Set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER` in `.env`.
2. Set `gateway.voice.enabled: true` and/or `gateway.sms.enabled: true` in `hermes-config.yaml`.
3. In Twilio console, set webhook URLs to:
   - Voice: `https://chat.yourpractice.com/voice/inbound`
   - SMS: `https://chat.yourpractice.com/sms/inbound`
4. Restart: `docker compose restart`

### Birdeye Reviews

1. Set `BIRDEYE_API_KEY`, `BIRDEYE_BUSINESS_ID`, and `REVIEW_LINK` in `.env`.
2. Set `tools.reviews.enabled: true` in `hermes-config.yaml`.
3. Restart: `docker compose restart`

---

## Monitoring & Maintenance

### Logs

```bash
# Application logs
docker compose logs -f dentalclaw

# Audit logs
tail -f /data/dentalclaw/audit.log
```

### Updates

```bash
docker compose pull
docker compose up -d
```

### Backups

```bash
# Back up memory database and configs
tar czf /backups/dentalclaw-$(date +%Y%m%d).tar.gz \
  /data/dentalclaw/memory.db \
  /opt/dentalclaw/.env \
  /opt/dentalclaw/knowledge/
```

### Troubleshooting

| Symptom | Check |
|---------|-------|
| Widget not loading | Reverse proxy config, CORS origins in hermes-config.yaml |
| "Calendar unavailable" | Integration credentials in .env, network allowlist in security block |
| Agent not responding | `docker compose ps`, health check endpoint, API key validity |
| High latency | Memory/CPU limits, model selection (switch to Haiku for speed) |
| Missing after-hours messages | `OFFICE_EMAIL` in .env, message_capture config |

---

## Uninstall

```bash
docker compose down -v
sudo rm -rf /opt/dentalclaw /data/dentalclaw
```

---

*DentalClaw v1.0.0 — Hermes Agent Deployment*
*ClawBuilt — https://clawbuilt.ai*
