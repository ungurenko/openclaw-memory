#!/bin/bash
# Auto-commit and push workspace to GitHub
# Runs daily at 03:00 Moscow time
# Logs to: /root/.openclaw/workspace/logs/git-backup.log

set -e  # Exit on error

WORKSPACE_DIR="/root/.openclaw/workspace"
LOG_DIR="$WORKSPACE_DIR/logs"
LOG_FILE="$LOG_DIR/git-backup.log"

# Create logs directory if needed
mkdir -p "$LOG_DIR"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "=== GitHub Backup Started ==="

cd "$WORKSPACE_DIR" || {
    log "ERROR: Failed to cd to $WORKSPACE_DIR"
    exit 1
}

# Check if git is initialized
if [ ! -d ".git" ]; then
    log "ERROR: Git not initialized in workspace"
    exit 1
fi

# Check if remote is configured
if ! git remote get-url origin &>/dev/null; then
    log "ERROR: No git remote configured"
    exit 1
fi

# Test SSH connection to GitHub
if ! ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    log "ERROR: GitHub SSH authentication failed"
    exit 1
fi

# Add all changes (respecting .gitignore)
git add -A

# Check if there are changes
if git diff --staged --quiet; then
    log "No changes to commit - workspace is up to date"
    log "=== Backup Complete (no changes) ==="
    exit 0
fi

# Commit with auto-generated message
COMMIT_MSG="Auto-backup $(date '+%Y-%m-%d %H:%M')"
if git commit -m "$COMMIT_MSG" &>>"$LOG_FILE"; then
    log "Committed: $COMMIT_MSG"
else
    log "ERROR: Git commit failed"
    exit 1
fi

# Push to GitHub
log "Pushing to GitHub..."
if git push origin main &>>"$LOG_FILE"; then
    log "✅ Push successful"
    log "=== Backup Complete ==="
else
    log "ERROR: Git push failed"
    exit 1
fi
