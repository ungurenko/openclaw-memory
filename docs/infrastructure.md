# Infrastructure Details

**Last updated:** 2026-02-17

## Server
- **Hostname:** pl-vmv2-mini
- **Public IP:** 82.40.37.143
- **OS:** Ubuntu 24.04.4 LTS
- **Specs:** 4 cores / 8 Gb RAM / 118 Gb disk

## Security
- **UFW:** активен (deny incoming, SSH 22/tcp LIMIT)
- **SSH:** key-only, PermitRootLogin prohibit-password
- **Fail2Ban:** активен (sshd + recidive), ~129 IP забанено
- **Автообновления:** unattended-upgrades (security patches)
- **OpenClaw Security:** 0 critical, 0 warn
- **Security Monitoring:** ежедневный audit 09:00 МСК → Telegram
- **Risk Profile:** Developer Convenience с security hardening
- **Шифрование диска:** нет (LUKS требует переустановки)

## Services
- **Whisper:** `venv-whisper`, модель base, русский язык
- **Tailscale:** установлен, не активирован
- **Exa MCP health-check:** systemd timer каждые 15 мин, логи `logs/exa-health.log`
- **iCloud Calendar sync:** cron 09:00 МСК, скрипт `scripts/icloud-calendar-sync.py`

## TODO
- [ ] Настроить системные бэкапы
