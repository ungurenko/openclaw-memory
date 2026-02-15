#!/bin/bash
# Server Hygiene & Disk Audit Script
# Checks for cleanup opportunities and reports disk status

REPORT="/tmp/server-hygiene-report.txt"
echo "=== Server Hygiene & Disk Audit ($(date)) ===" > $REPORT
echo "" >> $REPORT

# 1. Disk Usage Summary
echo "--- Disk Usage ---" >> $REPORT
df -h / | tail -n 1 | awk '{print "Used: " $3 " (" $5 "), Available: " $4}' >> $REPORT
echo "" >> $REPORT

# 2. Large Directory Check (Top 10 in /root and .openclaw)
echo "--- Top 10 Directories in /root (including hidden) ---" >> $REPORT
du -sh /root/.[!.]* /root/* 2>/dev/null | sort -rh | head -n 10 >> $REPORT
echo "" >> $REPORT

# 3. Cleanup Opportunities
echo "--- Cleanup Opportunities ---" >> $REPORT

# Check pip cache
PIP_CACHE=$(du -sh /root/.cache/pip 2>/dev/null | cut -f1)
if [ ! -z "$PIP_CACHE" ]; then
    echo "[Potential] pip cache: $PIP_CACHE (Safe to remove)" >> $REPORT
fi

# Check apt cache
APT_CACHE=$(du -sh /var/cache/apt/archives 2>/dev/null | cut -f1)
if [ ! -z "$APT_CACHE" ]; then
    echo "[Potential] apt cache: $APT_CACHE (Safe to run 'apt clean')" >> $REPORT
fi

# Check for multiple whisper venvs
VENVS=$(ls -d /root/.openclaw/workspace/*whisper* 2>/dev/null | wc -l)
if [ "$VENVS" -gt 1 ]; then
    echo "[Warning] Found $VENVS Whisper-related venvs. Possible duplicates." >> $REPORT
fi

# Check log sizes in /var/log
LOG_SIZE=$(du -sh /var/log 2>/dev/null | cut -f1)
echo "Current log size (/var/log): $LOG_SIZE" >> $REPORT

echo "" >> $REPORT
echo "--- End of Report ---" >> $REPORT

# Output the report to stdout for the agent to capture
cat $REPORT
