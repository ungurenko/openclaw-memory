---
name: server-health-audit
description: Analyze the current server’s health, load, security posture, and operational readiness. Use when asked to audit machine status, check resource pressure, detect service failures, review exposure/firewall/SSH hardening, or produce a concise health report with risks and next actions.
---

# Server Health Audit

Run a local health + security snapshot and return a readable report with:
- Overall status (OK / Warning / Critical)
- Key findings (load, memory, disk, failed services, network exposure, updates)
- Security notes (firewall, SSH hardening hints, risky open ports)
- Prioritized next actions

## Workflow

1. Run `scripts/run-audit.sh` from this skill directory.
2. Parse the output into sections:
   - System
   - Load & resources
   - Storage
   - Services
   - Network exposure
   - Security posture
   - Updates
3. Classify severity:
   - **Critical**: service down, disk >95%, OOM signs, public risky ports without firewall
   - **Warning**: disk >85%, RAM/swap pressure, failed non-critical units, missing updates
   - **OK**: no immediate risks detected
4. Give 3–5 concrete next steps, highest impact first.

## Notes

- Prefer factual output over assumptions.
- If a command fails due to permissions, mention it and continue with available data.
- Keep report concise and actionable.
