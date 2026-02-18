---
name: image-generator
description: "Generate images via kie.ai API using z-image (Tongyi-MAI) model. Use when Александр asks to generate, create, or make an image/изображение/картинку. Input is a prompt describing the image, output is image file sent back to Telegram. Triggers on phrases like сгенерируй изображение, создай картинку, нарисуй, generate image."
---

# Image Generator via kie.ai z-image

## Model Info

**z-image** by Tongyi-MAI (Alibaba) — photorealistic output, fast Turbo performance, bilingual text rendering (EN/ZH). Cost: ~$0.004/image.

## Workflow

1. **Understand the request** → extract subject, style, mood from the user's description
2. **Write a good prompt** (see below)
3. **Choose aspect ratio**
4. **Run script** → download image → send to Telegram

---

## Step 1: Write the Prompt

### Rules
- Write in **English**
- Be descriptive: subject + lighting + style + mood + composition
- For images with text: specify text in quotes and placement
- Example: `Futuristic workspace with glowing monitors, dark background, neon blue lighting, a developer typing code, cinematic 4K quality`

### Aspect Ratio Guide
- `1:1` — square (Instagram, profile pics)
- `16:9` — horizontal widescreen (covers, banners, YouTube thumbnails)
- `9:16` — vertical (stories, TG posts portrait)
- `4:3` — classic photo
- `3:4` — portrait photo

---

## Step 2: Run the Script

```bash
export KIE_API_KEY=d46b34762504b9d8d6422a8157c2ce43
mkdir -p /root/.openclaw/workspace/images

python3 /root/.openclaw/workspace/skills/image-generator/scripts/generate_image.py \
  --prompt "your detailed prompt in English" \
  --ratio 16:9 \
  --output /root/.openclaw/workspace/images/image_$(date +%Y-%m-%d_%H-%M).png
```

**Ratio options:** `1:1` | `4:3` | `3:4` | `16:9` | `9:16`

---

## Step 3: Send Result

```
message(action=send, filePath=/root/.openclaw/workspace/images/image_YYYY-MM-DD_HH-MM.png, caption="Готово 🎨")
```

---

## API Details

- **Submit:** POST `https://api.kie.ai/api/v1/jobs/createTask`
  ```json
  {
    "model": "z-image",
    "userPath": "z-image",
    "input": "{\"prompt\": \"...\", \"aspect_ratio\": \"16:9\"}"
  }
  ```
- **Poll:** GET `https://api.kie.ai/api/v1/jobs/recordInfo?taskId=<id>`
  - States: `waiting` → `success` / `fail`
  - Success: `resultJson.resultUrls[0]`
- **Auth:** `Authorization: Bearer KIE_API_KEY`
- **Generation time:** ~50-120 seconds

---

## Troubleshooting

- **code 422 "model not supported"** → must include both `model` AND `userPath` fields
- **input must be JSON string** → the `input` field must be a stringified JSON, not an object
- **timeout** → z-image can take up to 2 min; retry once
