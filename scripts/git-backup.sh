#!/bin/bash
# Auto-commit and push workspace to GitHub
# Usage: ./git-backup.sh [commit message]

set -e  # Exit on error

WORKSPACE_DIR="/root/.openclaw/workspace"
cd "$WORKSPACE_DIR"

# Default commit message
COMMIT_MSG="${1:-Auto-backup $(date '+%Y-%m-%d %H:%M')}"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized in workspace"
    exit 1
fi

# Check if remote is configured
if ! git remote get-url origin &>/dev/null; then
    echo "❌ No git remote configured"
    echo "Run: git remote add origin git@github.com:USERNAME/REPO.git"
    exit 1
fi

# Add all changes (respecting .gitignore)
git add -A

# Check if there are changes
if git diff --staged --quiet; then
    echo "✅ No changes to commit"
    exit 0
fi

# Commit
git commit -m "$COMMIT_MSG"

# Push
echo "📤 Pushing to GitHub..."
git push origin main

echo "✅ Backup complete: $COMMIT_MSG"
