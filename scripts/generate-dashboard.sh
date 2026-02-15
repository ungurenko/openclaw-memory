#!/bin/bash
# Generate server health dashboard PNG
# Usage: bash generate-dashboard.sh [output_path]

OUTPUT="${1:-/root/.openclaw/media/server-dashboard.png}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Collect metrics
HOSTNAME=$(hostname)
UPTIME=$(uptime -p | sed 's/up //')
LOAD=$(cat /proc/loadavg | awk '{print $1, $2, $3}')
KERNEL=$(uname -r)
CPU_CORES=$(nproc)
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print 100 - $8}' | cut -d. -f1)
MEM_TOTAL=$(free -m | awk '/Mem:/ {print $2}')
MEM_USED=$(free -m | awk '/Mem:/ {print $3}')
MEM_PCT=$((MEM_USED * 100 / MEM_TOTAL))
DISK_TOTAL=$(df -h / | awk 'NR==2 {print $2}')
DISK_USED=$(df -h / | awk 'NR==2 {print $3}')
DISK_PCT=$(df / | awk 'NR==2 {print $5}' | tr -d '%')
OPENCLAW_PID=$(pgrep -f "openclaw" | head -1 || echo "")
if [ -n "$OPENCLAW_PID" ]; then OPENCLAW_STATUS="active"; else OPENCLAW_STATUS="inactive"; fi
SSH_STATUS=$(systemctl is-active ssh 2>/dev/null || echo "unknown")
UFW_STATUS=$(ufw status 2>/dev/null | head -1 | awk '{print $2}')
[ -z "$UFW_STATUS" ] && UFW_STATUS="unknown"
IP_ADDR=$(hostname -I | awk '{print $1}')
OPEN_CONNECTIONS=$(ss -tun | grep -c ESTAB 2>/dev/null || echo "0")
FAILED_SSH=$(journalctl -u ssh --since "24 hours ago" 2>/dev/null | grep -c "Failed password" || echo "0")
TIMESTAMP=$(TZ='Europe/Moscow' date '+%d.%m.%Y %H:%M МСК')

# Build JSON
DATA=$(cat <<EOF
{"hostname":"$HOSTNAME","uptime":"$UPTIME","load":"$LOAD","kernel":"$KERNEL","cpu_cores":$CPU_CORES,"cpu_usage":$CPU_USAGE,"mem_total":$MEM_TOTAL,"mem_used":$MEM_USED,"mem_pct":$MEM_PCT,"disk_total":"$DISK_TOTAL","disk_used":"$DISK_USED","disk_pct":$DISK_PCT,"openclaw_status":"$OPENCLAW_STATUS","ssh_status":"$SSH_STATUS","ufw_status":"$UFW_STATUS","ip_addr":"$IP_ADDR","open_connections":$OPEN_CONNECTIONS,"failed_ssh_24h":$FAILED_SSH,"timestamp":"$TIMESTAMP"}
EOF
)

# Generate HTML
TMPHTML="/root/dashboard-render-$(date +%s).html"
sed "s|__DATA_PLACEHOLDER__|${DATA}|" "$SCRIPT_DIR/server-dashboard.html" > "$TMPHTML"

# Render PNG
NODE_PATH=/usr/lib/node_modules node -e "
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless: 'new', executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']});
  const page = await browser.newPage();
  await page.setViewport({width: 520, height: 700});
  await page.goto('file://${TMPHTML}', {waitUntil: 'networkidle0'});
  await page.screenshot({path: '${OUTPUT}', fullPage: true});
  await browser.close();
  console.log('ok');
})();
" 2>&1

rm -f "$TMPHTML"

if [ -f "$OUTPUT" ]; then
  echo "Dashboard saved: $OUTPUT"
  exit 0
else
  echo "ERROR: Failed to generate dashboard"
  exit 1
fi
