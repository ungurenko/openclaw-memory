---
name: cover-generator
description: "Generate horizontal Telegram channel post covers via kie.ai API (GPT Image 1.5 and Nano Banana Pro). Use when Александр asks to generate, create, or make a cover/обложку for a post. Input is post text or topic, output is image file sent back to Telegram. Triggers on phrases like сделай обложку, обложка для поста, cover for post, сгенерируй обложку."
---

# Cover Generator — Telegram Post Covers via kie.ai

## Workflow

1. **Analyze post text** → extract core topic and emotion
2. **Write cover headline** (2–5 Russian words, punchy)
3. **Choose style** + **write image prompt** (see style guide)
4. **Select model** (default: gpt4o)
5. **Run script** → download image → send to Telegram

---

## Step 0: Ask for Model

**ALWAYS ask Александр which model to use before generating:**

> "Какую модель использовать?
> **A) GPT Image 1.5** — лучше рендерит русский текст, надёжнее
> **B) Nano Banana Pro** — лучше для художественных/стилизованных визуалов"

Wait for the answer before proceeding.

---

## Step 1: Read Style Guide

Before generating, read `references/style-guide.md` to pick the right style and prompt pattern.

---

## Step 2: Create Headline + Prompt

### Headline rules
- 2–5 words in Russian, ALL CAPS
- Captures the key hook, not the full title
- Optional accent: 1 word in different style (e.g. "ПРОВАЛ?" as red italic)

### Prompt rules
- Write in English
- Include: scene/object + lighting + style + text instruction + format
- Example: `Dark background, glowing 3D robot holding a coin, red neon lighting, dramatic shadows, holographic particles. Bold white Russian text "ДЕНЬГИ НА ВАЙБЕ" top-left. 16:9 horizontal Telegram cover.`

---

## Step 3: Run the Script

```bash
export KIE_API_KEY=d46b34762504b9d8d6422a8157c2ce43
mkdir -p /root/.openclaw/workspace/covers

python3 /root/.openclaw/workspace/skills/cover-generator/scripts/generate_cover.py \
  --title "ЗАГОЛОВОК НА РУССКОМ" \
  --prompt "detailed visual prompt in English" \
  --model gpt4o \
  --output /root/.openclaw/workspace/covers/cover_$(date +%Y-%m-%d_%H-%M).jpg
```

**Model options:** `gpt4o` (default, better text) | `nano-banana` (better artistic visuals)

---

## Step 4: Send Result

After script completes, send the image file via `message` tool:
```
message(action=send, filePath=/root/.openclaw/workspace/covers/cover_YYYY-MM-DD_HH-MM.jpg, caption="Обложка готова 🎨")
```

---

## API Details

- **GPT Image 1.5:** POST `https://api.kie.ai/api/v1/gpt4o-image/generate` → poll `/record-info?taskId=`
- **Nano Banana:** POST `https://api.kie.ai/api/v1/jobs/createTask` (model: `google/nano-banana`) → poll `/api/v1/jobs/task-detail?taskId=`
- Auth: `Authorization: Bearer KIE_API_KEY`
- Both async — script polls every 8s until done (max 5 min)

---

## Troubleshooting

- **401 error** → check KIE_API_KEY env var
- **No image URLs** → Nano Banana response structure may vary; check `images[]` or `result_urls[]`
- **Russian text garbled** → switch to `gpt4o` model (better at Cyrillic)
- **timeout** → kie.ai can be slow under load; retry once

See full style reference: `references/style-guide.md`
