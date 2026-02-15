#!/bin/bash
# Collect server metrics for dashboard

# System info
HOSTNAME=$(hostname)
UPTIME=$(uptime -p | sed 's/up //')
LOAD=$(cat /proc/loadavg | awk '{print $1, $2, $3}')
KERNEL=$(uname -r)

# CPU
CPU_CORES=$(nproc)
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print 100 - $8}' | cut -d. -f1)

# Memory
MEM_TOTAL=$(free -m | awk '/Mem:/ {print $2}')
MEM_USED=$(free -m | awk '/Mem:/ {print $3}')
MEM_PCT=$((MEM_USED * 100 / MEM_TOTAL))

# Disk
DISK_TOTAL=$(df -h / | awk 'NR==2 {print $2}')
DISK_USED=$(df -h / | awk 'NR==2 {print $3}')
DISK_PCT=$(df / | awk 'NR==2 {print $5}' | tr -d '%')

# Services
OPENCLAW_STATUS=$(systemctl is-active openclaw-gateway 2>/dev/null || echo "unknown")
OPENCLAW_PID=$(pgrep -f "openclaw" | head -1 || echo "N/A")
SSH_STATUS=$(systemctl is-active ssh 2>/dev/null || echo "unknown")
UFW_STATUS=$(ufw status 2>/dev/null | head -1 | awk '{print $2}')

# Network
IP_ADDR=$(hostname -I | awk '{print $1}')
OPEN_CONNECTIONS=$(ss -tun | grep -c ESTAB 2>/dev/null || echo "0")

# Security
LAST_UPDATE=$(stat -c %Y /var/lib/apt/periodic/update-success-stamp 2>/dev/null || echo "0")
NOW=$(date +%s)
DAYS_SINCE_UPDATE=$(( (NOW - LAST_UPDATE) / 86400 ))
FAILED_SSH=$(journalctl -u ssh --since "24 hours ago" 2>/dev/null | grep -c "Failed password" || echo "0")

# Output JSON
cat << EOF
{
  "hostname": "$HOSTNAME",
  "uptime": "$UPTIME",
  "load": "$LOAD",
  "kernel": "$KERNEL",
  "cpu_cores": $CPU_CORES,
  "cpu_usage": $CPU_USAGE,
  "mem_total": $MEM_TOTAL,
  "mem_used": $MEM_USED,
  "mem_pct": $MEM_PCT,
  "disk_total": "$DISK_TOTAL",
  "disk_used": "$DISK_USED",
  "disk_pct": $DISK_PCT,
  "openclaw_status": "$OPENCLAW_STATUS",
  "openclaw_pid": "$OPENCLAW_PID",
  "ssh_status": "$SSH_STATUS",
  "ufw_status": "$UFW_STATUS",
  "ip_addr": "$IP_ADDR",
  "open_connections": $OPEN_CONNECTIONS,
  "days_since_update": $DAYS_SINCE_UPDATE,
  "failed_ssh_24h": $FAILED_SSH,
  "timestamp": "$(TZ='Europe/Moscow' date '+%d.%m.%Y %H:%M МСК')"
}
EOF
