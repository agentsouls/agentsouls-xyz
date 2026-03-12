# DentalClaw — NanoClaw Deployment Guide

Lightweight deployment of DentalClaw using the NanoClaw harness. Ideal for
practices that want a simple, low-maintenance setup using Anthropic Claude.

---

## Prerequisites

| Requirement | Specification |
|-------------|---------------|
| Server | 1 vCPU, 2 GB RAM minimum |
| OS | Ubuntu 22.04+ or any Docker-compatible Linux |
| Docker | 24.0+ with Compose plugin |
| Anthropic API Key | Active billing account |
| ClawBuilt License | Pro or Agency tier |
| Domain (recommended) | For HTTPS widget access |

---

## Step 1: Server Setup

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
```

---

## Step 2: Create Directories

```bash
sudo mkdir -p /opt/dentalclaw /data/dentalclaw /secrets
sudo chown -R $USER:$USER /opt/dentalclaw /data/dentalclaw
sudo chmod 700 /secrets
```

---

## Step 3: Copy DentalClaw Configuration

```bash
# From your local machine:
scp -r configs/dental/* user@server:/opt/dentalclaw/
```

Verify the directory structure:

```bash
ls /opt/dentalclaw/
# skills/ harness/ integrations/ security/ knowledge/ .env.example SETUP.md
```

---

## Step 4: Configure Environment

```bash
cd /opt/dentalclaw
cp .env.example .env
chmod 600 .env
nano .env
```

Required variables for NanoClaw:

```bash
ANTHROPIC_API_KEY=sk-ant-...
CLAWBUILT_LICENSE_KEY=clb-...
PRACTICE_NAME="Smile Dental"
PRACTICE_PHONE="(555) 123-4567"
PRACTICE_ADDRESS="123 Main St, Suite 100, Anytown, ST 12345"
PRACTICE_WEBSITE="https://smiledental.com"
PRACTICE_TIMEZONE="America/New_York"
OFFICE_EMAIL="office@smiledental.com"
```

Add integration credentials as needed (Dentrix, NexHealth, Google Calendar).

---

## Step 5: Populate Knowledge Base

Edit each template in `knowledge/scaffold/`:

```bash
nano /opt/dentalclaw/knowledge/scaffold/services.md
nano /opt/dentalclaw/knowledge/scaffold/insurance.md
nano /opt/dentalclaw/knowledge/scaffold/policies.md
nano /opt/dentalclaw/knowledge/scaffold/procedures-faq.md
nano /opt/dentalclaw/knowledge/scaffold/financing.md
nano /opt/dentalclaw/knowledge/scaffold/team.md
```

Replace all `[placeholder]` text with real practice information. The agent only
knows what you put in these files.

---

## Step 6: Run Hardening Steps

Review `security/hardening-checklist.md` and apply relevant steps. Key items
for NanoClaw:

```bash
# Verify .env permissions
ls -la /opt/dentalclaw/.env
# Should show: -rw------- 1 user user

# Set up UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## Step 7: Start NanoClaw

```bash
cd /opt/dentalclaw

# Create the compose file (or use the one from harness/nanoclaw/)
docker compose -f harness/nanoclaw/nanoclaw-compose.yaml up -d

# Verify
docker compose -f harness/nanoclaw/nanoclaw-compose.yaml ps
docker compose -f harness/nanoclaw/nanoclaw-compose.yaml logs -f --tail=30
```

Check health:

```bash
curl http://localhost:8080/health
# {"status": "ok", "harness": "nanoclaw", "version": "1.0.0"}
```

---

## Step 8: Set Up HTTPS (Recommended)

### Caddy (simplest option)

```bash
sudo apt install -y caddy
```

Edit `/etc/caddy/Caddyfile`:

```
chat.yourpractice.com {
    reverse_proxy localhost:8080
}
```

```bash
sudo systemctl restart caddy
```

Caddy handles SSL certificate provisioning automatically via Let's Encrypt.

---

## Step 9: Embed Chat Widget

Add to the practice website before `</body>`:

```html
<script
  src="https://chat.yourpractice.com/widget.js"
  data-practice="[Practice Name]"
  async
></script>
```

---

## Step 10: Verify Deployment

Run through this checklist:

- [ ] Chat widget loads on the website
- [ ] Agent greets with practice name
- [ ] Agent answers service questions from knowledge base
- [ ] Calendar integration returns available slots (if configured)
- [ ] PHI firewall works (mention a condition — agent should not repeat it)
- [ ] After-hours mode activates outside office hours
- [ ] Captured messages are delivered to office email
- [ ] Health endpoint returns OK

---

## Maintenance

### View Logs
```bash
docker compose -f harness/nanoclaw/nanoclaw-compose.yaml logs -f
```

### Update
```bash
docker compose -f harness/nanoclaw/nanoclaw-compose.yaml pull
docker compose -f harness/nanoclaw/nanoclaw-compose.yaml up -d
```

### Backup
```bash
tar czf /backups/dentalclaw-$(date +%Y%m%d).tar.gz \
  /data/dentalclaw/ \
  /opt/dentalclaw/.env \
  /opt/dentalclaw/knowledge/
```

### Restart
```bash
docker compose -f harness/nanoclaw/nanoclaw-compose.yaml restart
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Widget not loading | Check Caddy/Nginx config, verify CORS in browser console |
| "Service unavailable" | Check `docker ps`, verify API key in .env |
| Slow responses | Check Anthropic API status, consider Haiku fallback |
| Wrong office info | Update knowledge/scaffold files and restart |
| Container OOM killed | Increase `mem_limit` in compose file |

---

*DentalClaw v1.0.0 — NanoClaw Deployment*
*ClawBuilt — https://clawbuilt.ai*
