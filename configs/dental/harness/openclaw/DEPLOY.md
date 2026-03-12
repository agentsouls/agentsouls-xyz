# DentalClaw — OpenClaw Deployment Guide

Deploy DentalClaw using open-weight models for full data sovereignty and no
per-token API costs. Requires a GPU server for inference.

---

## Prerequisites

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| GPU | 1x NVIDIA A10 (24 GB VRAM) | 1x NVIDIA A100 (40 GB VRAM) |
| CPU | 8 vCPU | 16 vCPU |
| RAM | 32 GB | 64 GB |
| Storage | 100 GB SSD | 200 GB NVMe |
| OS | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |
| NVIDIA Driver | 535+ | Latest stable |
| Docker | 24.0+ with nvidia-container-toolkit | Latest stable |
| ClawBuilt License | Active subscription | — |

### GPU Sizing Guide

| Model | VRAM Required (AWQ/GPTQ) | VRAM Required (FP16) |
|-------|--------------------------|----------------------|
| Llama 3.1 8B Instruct | 6 GB | 16 GB |
| Llama 3.3 70B Instruct | 40 GB | 140 GB (multi-GPU) |
| Mistral 7B Instruct | 5 GB | 14 GB |

For most dental offices, the 8B model with AWQ quantization provides good
quality at minimal cost. The 70B model is recommended for practices that need
higher quality responses.

---

## Step 1: Server & GPU Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install NVIDIA drivers
sudo apt install -y nvidia-driver-535
sudo reboot

# Verify GPU
nvidia-smi

# Install Docker + NVIDIA Container Toolkit
curl -fsSL https://get.docker.com | sh
sudo apt install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker

# Verify GPU in Docker
docker run --rm --gpus all nvidia/cuda:12.2.0-base-ubuntu22.04 nvidia-smi
```

---

## Step 2: Create Deployment Directories

```bash
sudo mkdir -p /opt/dentalclaw /data/dentalclaw/{reports,archive} /secrets /models
sudo chown -R $USER:$USER /opt/dentalclaw /data/dentalclaw /models
sudo chmod 700 /secrets
```

---

## Step 3: Download the Model

```bash
# Install huggingface-cli
pip install huggingface-hub

# Download quantized model (AWQ — recommended for single GPU)
huggingface-cli download \
  TheBloke/Llama-3.1-8B-Instruct-AWQ \
  --local-dir /models/llama-3.1-8b-instruct-awq

# Or for 70B (requires 40+ GB VRAM):
# huggingface-cli download \
#   TheBloke/Llama-3.3-70B-Instruct-AWQ \
#   --local-dir /models/llama-3.3-70b-instruct-awq
```

---

## Step 4: Copy Configuration

```bash
scp -r configs/dental/* user@server:/opt/dentalclaw/
cd /opt/dentalclaw
cp .env.example .env
chmod 600 .env
nano .env
```

Set OpenClaw-specific variables:

```bash
OPENCLAW_API_BASE=http://vllm:8000/v1
OPENCLAW_MODEL=meta-llama/Llama-3.1-8B-Instruct
OPENCLAW_QUANTIZATION=awq
```

---

## Step 5: Populate Knowledge Base

```bash
# Edit all scaffold files with practice-specific information
for f in /opt/dentalclaw/knowledge/scaffold/*.md; do nano "$f"; done
```

---

## Step 6: Create Docker Compose

Create `/opt/dentalclaw/docker-compose.yaml`:

```yaml
version: "3.8"

services:
  # vLLM inference server
  vllm:
    image: vllm/vllm-openai:latest
    container_name: dentalclaw-vllm
    restart: unless-stopped
    runtime: nvidia
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    volumes:
      - /models:/models:ro
    environment:
      - NVIDIA_VISIBLE_DEVICES=all
    command: >
      --model /models/llama-3.1-8b-instruct-awq
      --quantization awq
      --dtype float16
      --max-model-len 8192
      --gpu-memory-utilization 0.85
      --host 0.0.0.0
      --port 8000
    ports:
      - "127.0.0.1:8000:8000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 120s    # Models take time to load

  # OpenClaw agent
  dentalclaw:
    image: clawbuilt/openclaw:latest
    container_name: dentalclaw-agent
    restart: unless-stopped
    depends_on:
      vllm:
        condition: service_healthy
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
      - "127.0.0.1:8080:8080"
      - "127.0.0.1:8081:8081"
    volumes:
      - ./harness/openclaw/openclaw.yaml:/app/config/openclaw.yaml:ro
      - ./harness/openclaw/routing.yaml:/app/config/routing.yaml:ro
      - ./skills:/app/skills:ro
      - ./knowledge:/app/knowledge:ro
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
```

---

## Step 7: Harden the Deployment

Follow `security/hardening-checklist.md` — all 10 steps apply to OpenClaw.
Additional GPU-specific hardening:

```bash
# Restrict GPU access to the vLLM container only
# (handled by Docker Compose — no GPU passthrough to the agent container)

# Monitor GPU temperature and utilization
watch -n 5 nvidia-smi
```

---

## Step 8: Start the Stack

```bash
cd /opt/dentalclaw
docker compose up -d

# Wait for vLLM to load the model (may take 1-3 minutes)
docker compose logs -f vllm --tail=20

# Once healthy, verify the agent
curl http://localhost:8081/health
```

Test the inference server directly:

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "meta-llama/Llama-3.1-8B-Instruct",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 100
  }'
```

---

## Step 9: Set Up Reverse Proxy

```bash
sudo apt install -y caddy
```

`/etc/caddy/Caddyfile`:

```
chat.yourpractice.com {
    reverse_proxy localhost:8080
    header {
        X-Content-Type-Options nosniff
        X-Frame-Options SAMEORIGIN
    }
}
```

```bash
sudo systemctl restart caddy
```

---

## Step 10: Verify End-to-End

1. Open the practice website — chat widget should appear.
2. Send a message — response should come from the local model.
3. Check latency: `curl -w "\nTime: %{time_total}s\n" http://localhost:8080/health`
4. Test PHI firewall, after-hours capture, and knowledge base responses.
5. Monitor GPU: `nvidia-smi` — utilization should be reasonable.

---

## Hardening Checklist (OpenClaw-Specific)

In addition to the standard checklist in `security/hardening-checklist.md`:

- [ ] vLLM binds to `127.0.0.1` only (not `0.0.0.0` on external interface)
- [ ] No SSH access to GPU server from the internet (use VPN or bastion)
- [ ] GPU driver updated to latest stable
- [ ] Model files are mounted read-only
- [ ] vLLM has no access to `/data/dentalclaw` (secrets, patient data)
- [ ] Network policy: agent container can reach vLLM, but vLLM cannot reach agent
- [ ] Monitor GPU temperature — set alert at 85C
- [ ] Disk space monitoring for `/models` and `/data`

---

## Performance Tuning

### Latency Optimization

```bash
# Increase GPU memory utilization (if no other GPU workloads)
--gpu-memory-utilization 0.90

# Enable continuous batching (default in vLLM)
# Reduce max-model-len if context window is larger than needed
--max-model-len 4096    # Saves VRAM, faster inference
```

### Throughput Optimization

```bash
# For multiple concurrent users, increase max-num-seqs
--max-num-seqs 32

# Enable prefix caching (reuses system prompt KV cache)
--enable-prefix-caching
```

### Cost Monitoring

Check the daily cost report:

```bash
cat /data/dentalclaw/reports/$(date +%Y-%m-%d).json
```

For OpenClaw, "cost" is primarily GPU electricity + server hosting. The cost
tracker logs token throughput so you can calculate effective cost-per-token.

---

## Updates

```bash
# Update the agent
docker compose pull dentalclaw
docker compose up -d dentalclaw

# Update vLLM (may require re-downloading model for compatibility)
docker compose pull vllm
docker compose up -d vllm

# Update model
huggingface-cli download <new-model> --local-dir /models/<new-model>
# Update docker-compose.yaml command to point to new model
docker compose up -d vllm
```

---

*DentalClaw v1.0.0 — OpenClaw Deployment*
*ClawBuilt — https://clawbuilt.ai*
