---
name: github-releases-tracker
description: Track and report new releases from OpenClaw and Claude Code GitHub repositories. Use when monitoring these projects for updates, checking for new versions, or when scheduled via cron to get daily release notifications. Returns formatted Russian-language summaries of latest releases with changelogs.
---

# GitHub Releases Tracker

## Overview

Track releases and updates from OpenClaw (`openclaw/openclaw`) and Claude Code (`anthropics/claude-code`) repositories. The skill checks GitHub for the latest releases and provides Russian-language summaries of what changed.

## Quick Start

Run the tracker script:

```bash
python3 scripts/check_releases.py
```

The script will:
1. Check both repositories for latest releases via GitHub API
2. Compare with previously seen releases (state stored in `last_check.json`)
3. Output formatted Russian-language report showing:
   - New releases (marked with 🆕)
   - Version numbers and release dates
   - Changelog/release notes
   - Links to full release pages

## How It Works

**State Management:**
- First run: reports current latest releases as "new"
- Subsequent runs: only reports releases newer than last check
- State stored in: `~/.openclaw/workspace/skills/github-releases-tracker/last_check.json`

**Output Format:**
- Structured sections for each repository
- Emoji markers for visual clarity
- Truncated changelogs (max 1500 chars) with links to full versions
- Summary at the end indicating if new releases were found

**GitHub API:**
- Uses public API (no auth required for basic usage)
- Supports `GITHUB_TOKEN` env var for higher rate limits
- Handles both releases and tags (fallback if no releases exist)

## Automation

Designed for cron/scheduled execution. Exit codes:
- `0` = no new releases
- `1` = new releases found

Example cron job (daily at 7:30 AM Moscow time):
```
30 4 * * * python3 /path/to/scripts/check_releases.py
```

(Note: 7:30 MSK = 4:30 UTC during standard time, 3:30 UTC during daylight saving)

## Resources

### scripts/

**check_releases.py** - Main tracker script that queries GitHub API, compares with previous state, and outputs formatted Russian-language release reports.
