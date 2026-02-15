---
name: model-releases-tracker
description: Track and report new LLM and image generation model releases from US and Chinese companies. Use when monitoring the AI model landscape for daily updates on newly released models, version updates, or significant model announcements. Designed for automated daily checks via cron jobs.
---

# Model Releases Tracker

## Overview

This skill provides a systematic workflow for tracking new releases of AI models (LLM and image generation) from major US and Chinese companies using Exa MCP search capabilities.

## Workflow

### 1. Search Strategy

Use Exa MCP (via `mcporter`) to search for model releases with these parameters:

**LLM Models:**
- Search queries:
  - "new LLM model release {today's date}"
  - "GPT OpenAI release"
  - "Claude Anthropic release"
  - "Gemini Google release"
  - "Llama Meta release"
  - "DeepSeek model release"
  - "Qwen Alibaba release"
  - "ChatGLM Zhipu release"

**Image Generation Models:**
- Search queries:
  - "new image generation model release {today's date}"
  - "DALL-E release"
  - "Midjourney release"
  - "Stable Diffusion release"
  - "Imagen Google release"

**Time range:** Last 24 hours (use Exa's `startPublishedDate` parameter)

**Source priority for CONFIRMATION (must-have):**
1. **Official company blogs** (openai.com/blog, anthropic.com/news, deepmind.google/blog, ai.meta.com, etc.)
2. **Official release notes / changelogs** (help.openai.com, docs.anthropic.com, etc.)
3. **Official API documentation** showing new model in production

**Secondary sources (context only, NOT for confirmation):**
- Major tech news (TechCrunch, The Verge, Reuters) — use for discovery, verify via official source
- AI publications (Ars Technica, MIT Tech Review) — same as above

### 2. Information Extraction

For each discovered release, extract:
- **Model name** (e.g., "GPT-5", "Claude 4 Opus", "DALL-E 4")
- **Company** (OpenAI, Anthropic, Google, Meta, DeepSeek, etc.)
- **Release date** (verify it's actual release, not announcement of future release)
- **Key features** (1-2 sentence summary based on official description)
- **Source URL** (MUST be official company domain: openai.com, anthropic.com, blog.google, etc.)

**Before including any model:** Confirm you have a direct link to an official announcement on the company's own domain.

### 3. Output Format

**IMPORTANT: Always output the final report in Russian (ru), even though searches are in English.**

Structure the report as follows:

**If releases found:**

```
🚀 **Релизы AI-моделей — {date}**

**LLM-модели:**
1. **{Model Name}** — {Company}
   - Релиз: {date}
   - {1-2 предложения на русском}
   - Источник: {URL}

2. ...

**Модели генерации изображений:**
1. **{Model Name}** — {Company}
   - Релиз: {date}
   - {1-2 предложения на русском}
   - Источник: {URL}

**Итого: {X} новых релизов**
```

**If no releases:**

```
📭 **Релизы AI-моделей — {date}**

Новых релизов моделей за последние 24 часа не обнаружено.
```

### 4. Verification & Quality Control (CRITICAL)

**RULE: Only include releases with official confirmation from the company.**

**Acceptable sources for confirmation:**
1. **Official company blogs** (openai.com/blog, anthropic.com/news, blog.google, etc.)
2. **Official press releases** on company websites
3. **Official API documentation** showing new model availability

**NOT acceptable as sole source:**
- Tech news articles citing "rumors" or "leaks"
- Social media posts without official backing
- Industry speculation ("expected", "imminent", "planned")
- Unofficial sources even if reputable (TechCrunch, The Verge, etc. — use only as supplementary)

**Verification steps:**
1. Find official announcement URL on company domain
2. Verify release date is within search window (last 24h)
3. Confirm model is **released** (not "announced for future", "coming soon", or "beta waitlist")
4. Cross-check model availability (API docs, changelog, official model list)

**Red flags (exclude if present):**
- "Expected to launch"
- "Rumored release"
- "Leaks suggest"
- "Coming soon"
- "Internal testing"
- No official company source

**Separate section for announcements:**
If important models are **announced but not released**, add a separate section:
```
**Анонсы (не выпущены):**
- {Model} — {Company}: анонсирован для релиза {date/month}
```

**When in doubt:** EXCLUDE. Better to miss a model than report false information.

**Examples:**

✅ **INCLUDE:**
- "Introducing GPT-5.3-Codex" on openai.com/blog with live API access
- "Claude Opus 4.6 is now available" on anthropic.com/news
- Official changelog entry showing new model deployed

❌ **EXCLUDE:**
- "Claude Sonnet 5 expected this week" (TechCrunch article)
- "Leaks suggest GPT-5.4 coming soon" (any source)
- "Industry sources say..." (speculation)
- "Waitlist open for Model X" (not released yet)
- Model mentioned only in unofficial blogs/forums

## Exa MCP Integration

Use `mcporter` to call the `exa` server:

```bash
mcporter call exa search --query "..." --startPublishedDate "YYYY-MM-DD"
```

Expected Exa response structure:
- `results[]` array with `title`, `url`, `publishedDate`, `text`

Parse results and filter by relevance (model names, company keywords).

## Notes

- This skill is designed for automated cron execution (daily at 09:00 MSK)
- Results should be sent to Telegram via the `message` tool
- Focus on **major releases only** — skip beta/preview unless widely covered
- Chinese models: DeepSeek, Qwen, ChatGLM, Baichuan, Yi
- US models: GPT (OpenAI), Claude (Anthropic), Gemini (Google), Llama (Meta), DALL-E (OpenAI), Midjourney, Stable Diffusion

**Quality over quantity:** Accuracy is paramount. Report only confirmed releases with official sources. Zero tolerance for speculation or rumors.
