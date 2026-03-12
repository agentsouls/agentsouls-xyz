# TradeClaw — Security Hardening Checklist

## Overview

This checklist covers security hardening for TradeClaw deployments. Trades businesses handle customer PII (names, addresses, phone numbers) and have access to physical service locations. Security is not optional.

Complete every item before going live. Items marked **[CRITICAL]** are blockers — do not deploy without them.

---

## 1. Secrets Management

- [ ] **[CRITICAL]** All API keys stored in environment variables, never in config files or code
- [ ] **[CRITICAL]** `.env` file is in `.gitignore` and never committed to version control
- [ ] **[CRITICAL]** Anthropic API key has appropriate spending limits configured
- [ ] All secrets rotated from any default or example values
- [ ] Secrets manager used for production (AWS Secrets Manager, HashiCorp Vault, or Doppler)
- [ ] API keys scoped to minimum required permissions (e.g., ServiceTitan read-only for Starter tier)

## 2. Authentication and Authorization

- [ ] **[CRITICAL]** All webhook endpoints validate authentication signatures
- [ ] **[CRITICAL]** Twilio webhook signature validation enabled
- [ ] **[CRITICAL]** ServiceTitan HMAC validation enabled (if applicable)
- [ ] Bearer tokens for Housecall Pro and Thumbtack webhooks validated
- [ ] Web chat widget uses API key or session token authentication
- [ ] Admin API endpoints (if any) require strong authentication
- [ ] OAuth tokens stored encrypted at rest
- [ ] Token refresh logic handles expiration gracefully

## 3. Network Security

- [ ] **[CRITICAL]** TLS/HTTPS required for all endpoints (no HTTP)
- [ ] **[CRITICAL]** SSL certificates valid and auto-renewing (Let's Encrypt or equivalent)
- [ ] CORS restricted to client's website domain and ClawBuilt CDN
- [ ] Egress restricted to known endpoints (Anthropic API, Twilio, ServiceTitan, etc.)
- [ ] Internal services (Redis, Qdrant, PostgreSQL) not exposed to public internet
- [ ] Firewall rules reviewed and minimal
- [ ] DNS properly configured with CAA records

## 4. Container Security (Hermes / OpenClaw)

- [ ] **[CRITICAL]** Docker containers run as non-root user
- [ ] **[CRITICAL]** Read-only root filesystem enabled
- [ ] **[CRITICAL]** `no-new-privileges` flag set
- [ ] Memory limits configured (prevent resource exhaustion)
- [ ] CPU limits configured
- [ ] Docker image based on minimal base (Alpine or distroless)
- [ ] Docker image scanned for vulnerabilities (Trivy, Snyk)
- [ ] No sensitive data baked into the Docker image
- [ ] Docker socket not mounted into containers

## 5. Data Protection

- [ ] **[CRITICAL]** Customer PII (names, phone numbers, addresses) encrypted at rest in Redis/PostgreSQL
- [ ] **[CRITICAL]** No credit card numbers, SSNs, or financial data collected or stored by the agent
- [ ] Redis connection uses TLS
- [ ] PostgreSQL connection uses TLS
- [ ] Qdrant connection uses TLS (if remote)
- [ ] Backup encryption enabled for all data stores
- [ ] Data retention policies configured (see memory-config.yaml)
- [ ] Customer data deletion process documented (for CCPA/GDPR compliance)
- [ ] Logs do not contain full customer PII (mask phone numbers, truncate names)

## 6. Input Validation

- [ ] **[CRITICAL]** Maximum request body size enforced (1MB recommended)
- [ ] **[CRITICAL]** HTML/script injection sanitized on all inputs
- [ ] Webhook payload schema validation enabled
- [ ] Phone number format validation (E.164)
- [ ] Zip code format validation
- [ ] Email format validation
- [ ] Prompt injection defenses in system prompt (boundaries section)
- [ ] Replay protection on webhooks (timestamp validation, reject events > 5 min old)

## 7. Rate Limiting

- [ ] **[CRITICAL]** Per-phone-number rate limiting enabled (20 requests/hour recommended)
- [ ] Global rate limiting configured (1000 requests/minute recommended)
- [ ] Per-webhook-endpoint rate limiting configured
- [ ] Per-IP rate limiting on web chat endpoint
- [ ] Rate limit responses return 429 with Retry-After header

## 8. Monitoring and Alerting

- [ ] **[CRITICAL]** Emergency classification errors trigger immediate alert (PagerDuty or equivalent)
- [ ] Failed webhook deliveries logged and alerted
- [ ] API error rates monitored
- [ ] Response latency monitored (alert on p99 > 5s)
- [ ] Unusual traffic patterns detected (potential abuse)
- [ ] Daily cost monitoring with budget alerts
- [ ] Log aggregation configured (ship to Datadog, CloudWatch, or equivalent)
- [ ] Audit trail for all customer data access

## 9. Agent Safety

- [ ] **[CRITICAL]** System prompt includes clear boundaries (Section 7 of system_prompt.md)
- [ ] Agent cannot access financial systems, dispatch directly, or provide exact quotes
- [ ] Agent escalation paths tested and verified
- [ ] Agent cannot be social-engineered into revealing system prompts or API keys
- [ ] Agent handles off-topic requests by redirecting to business services
- [ ] Emergency classification tested with adversarial inputs

## 10. Operational Security

- [ ] Deployment credentials (SSH keys, CI/CD tokens) stored securely
- [ ] CI/CD pipeline does not log secrets
- [ ] Production access limited to authorized personnel
- [ ] Incident response plan documented
- [ ] Contact information for on-call eng and client stakeholders documented
- [ ] Rollback procedure documented and tested
- [ ] Backup and restore procedure tested

---

## Compliance Notes

### TCPA (Telephone Consumer Protection Act)
- Obtain consent before sending SMS marketing (seasonal campaigns)
- Honor opt-out requests immediately
- Maintain opt-out list
- Include opt-out instructions in marketing messages: "Reply STOP to unsubscribe"

### CCPA / State Privacy Laws
- Provide mechanism for customers to request data deletion
- Do not sell customer data
- Disclose data collection practices in privacy policy

### PCI DSS
- TradeClaw does NOT handle payment card data. If the client asks for payment processing, redirect to their payment processor. Do not build card handling into the agent.

---

## Sign-Off

| Item | Completed By | Date |
|---|---|---|
| Secrets management | | |
| Authentication | | |
| Network security | | |
| Container security | | |
| Data protection | | |
| Input validation | | |
| Rate limiting | | |
| Monitoring | | |
| Agent safety | | |
| Operational security | | |
| **FINAL SIGN-OFF** | | |
