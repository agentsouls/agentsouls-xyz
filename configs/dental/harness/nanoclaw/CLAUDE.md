# DentalClaw — NanoClaw Claude Configuration

NanoClaw is ClawBuilt's lightweight harness for running DentalClaw directly on
Anthropic's Claude API with minimal infrastructure. Designed for Pro and Agency
tier customers who want a managed, low-ops deployment.

---

## Tier Requirements

| Tier | Features | Limits |
|------|----------|--------|
| **Pro** | Web chat, after-hours capture, single location | 5,000 messages/month |
| **Agency** | All channels, multi-location, recall, reviews | 50,000 messages/month |

---

## Architecture

```
Patient  -->  [Chat Widget / Twilio]  -->  NanoClaw Gateway
                                               |
                                     [Claude API - Sonnet 4]
                                               |
                                     [Tool Router]
                                       /    |    \
                               Calendar  Capture  Reviews
```

NanoClaw runs as a single containerized process. No GPU required. The system
prompt and knowledge base are injected into the Claude context window on each
turn. Memory is handled by a local SQLite database within the container.

---

## System Prompt Configuration

NanoClaw loads the system prompt from `../../skills/system_prompt.md`. The
prompt is injected as the `system` parameter in every Claude API call.

### Prompt Assembly Order

1. **Base system prompt** — `skills/system_prompt.md` (full content)
2. **Persona overlay** — `skills/persona.md` (tone knobs applied)
3. **Knowledge base** — All files from `knowledge/scaffold/` concatenated
4. **Session context** — Current conversation history + user model (if available)
5. **Tool definitions** — Calendar, message capture, review tools

### Token Budget

| Component | Approximate Tokens | Priority |
|-----------|--------------------|----------|
| System prompt | 3,000–4,000 | Required |
| Persona | 500–800 | Required |
| Knowledge base | 2,000–6,000 | Required (trimmed if needed) |
| Conversation history | 2,000–8,000 | Rolling window |
| Tool definitions | 500–1,000 | Required |
| **Total context** | **8,000–20,000** | Max 80% of context window |

NanoClaw reserves 20% of the context window for the model's response.

---

## Container Configuration

```yaml
# nanoclaw-compose.yaml
version: "3.8"

services:
  dentalclaw-nano:
    image: clawbuilt/nanoclaw:latest
    container_name: dentalclaw-nano
    restart: unless-stopped

    # Security
    read_only: true
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
    pids_limit: 50
    mem_limit: 256m
    cpus: "0.5"

    # Ports
    ports:
      - "127.0.0.1:8080:8080"

    # Volumes
    volumes:
      - ./skills:/app/skills:ro
      - ./knowledge:/app/knowledge:ro
      - nanoclaw-data:/data:rw
    tmpfs:
      - /tmp:rw,noexec,nosuid,size=32m

    # Environment
    env_file:
      - .env

    # Health
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 5s
      retries: 3

volumes:
  nanoclaw-data:
```

---

## Container Isolation Notes

NanoClaw enforces strict container isolation for HIPAA-adjacent deployments:

### Filesystem

- **Read-only root filesystem.** The container cannot write to its own image.
  Only `/data` (named volume) and `/tmp` (tmpfs) are writable.
- `/tmp` is mounted `noexec,nosuid` — no binaries can be executed from temp.
- Skills and knowledge are mounted read-only. The agent cannot modify its own
  prompts or knowledge base at runtime.

### Process

- **PID limit: 50.** Prevents fork bombs and runaway processes.
- **No new privileges.** The container cannot escalate permissions via setuid
  binaries or capability inheritance.
- **All capabilities dropped** except `NET_BIND_SERVICE` (required for port 8080).

### Memory & CPU

- **256 MB memory limit.** Sufficient for the NanoClaw gateway process and
  SQLite. OOM kills are logged and trigger auto-restart.
- **0.5 CPU limit.** Prevents the container from starving the host.

### Network

- The container binds to `127.0.0.1` only. External access requires a reverse
  proxy (Caddy or Nginx) for HTTPS termination.
- Outbound traffic is limited to:
  - `api.anthropic.com` (Claude API)
  - Integration endpoints (Dentrix, NexHealth, Google Calendar, Birdeye)
- Use UFW or iptables on the host to enforce network restrictions.

### Secrets

- API keys and credentials are passed via environment variables (`.env` file).
- The `.env` file must be `chmod 600` and owned by the deployment user.
- For Google Calendar OAuth, the credentials JSON is mounted read-only at
  `/secrets/google-calendar-credentials.json`.
- Never bake secrets into the container image.

---

## Model Configuration

```yaml
# NanoClaw uses these defaults (configurable via .env)
NANOCLAW_MODEL: "claude-sonnet-4-20250514"
NANOCLAW_TEMPERATURE: 0.3
NANOCLAW_MAX_TOKENS: 1024
NANOCLAW_TOP_P: 0.9
```

For cost optimization on high-volume deployments:
- Use `claude-haiku-4-20250414` for simple routing/FAQ queries
- Use `claude-sonnet-4-20250514` for scheduling flows and complex conversations
- NanoClaw's built-in router handles this automatically when `NANOCLAW_SMART_ROUTING=true`

---

## Differences from Hermes Agent

| Feature | Hermes Agent | NanoClaw |
|---------|-------------|----------|
| Model flexibility | Any provider | Anthropic Claude only |
| Memory system | Full Hermes memory | Lightweight SQLite |
| Skill auto-creation | Yes | No |
| User modeling | Advanced | Basic (name, phone, prefs) |
| Tool ecosystem | Full Hermes tools | Calendar, capture, reviews |
| Multi-channel | All | Web chat + SMS (Pro), All (Agency) |
| Self-hosted | Yes | Yes |
| Resource footprint | 512 MB+ | 256 MB |
| Setup complexity | Medium | Low |

---

## Quick Start

```bash
# 1. Copy configs
cp -r configs/dental /opt/dentalclaw
cd /opt/dentalclaw

# 2. Configure
cp .env.example .env
nano .env   # Fill in API keys and practice details

# 3. Fill knowledge base
nano knowledge/scaffold/services.md
# ... edit all scaffold files ...

# 4. Start
docker compose -f harness/nanoclaw/nanoclaw-compose.yaml up -d

# 5. Test
curl http://localhost:8080/health
```

See `DEPLOY.md` for the full deployment guide.

---

*DentalClaw v1.0.0 — NanoClaw Configuration*
*ClawBuilt — https://clawbuilt.ai*
