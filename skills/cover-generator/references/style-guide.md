# Telegram Cover Style Guide — Александр's Channel

## Visual Patterns (from real covers)

### Dark dramatic (most common)
- Near-black background (#0a0a0a – #1a1a1a)
- White bold headline + red italic accent word
- Central 3D object related to topic
- Hand-drawn decorations: arrows, circles, question marks (red/orange)
- Optional tool badges bottom-left/right (pill shape, dark fill)
- Example: brain + neural connections for AI topic; computer screen for coding

### Gold/luxury
- Dark textured background
- Gold 3D dripping lettering (main word huge, subtext smaller)
- No extra objects — typography IS the visual

### Bright pop
- Solid vivid background (red, coral, electric blue)
- White or dark ultra-bold headline (left side, 2-3 lines)
- 3D object right side (product mockup, character, icon)
- Minimal decoration

### Clean tech (light)
- White/light gray background with subtle grid
- Dark blue/navy sans-serif headline
- Holographic/liquid chrome 3D elements floating around text
- Star/sparkle decorations
- Bottom ticker strip (same text repeated, small)

---

## Text on Cover Rules

- **Headline: 2–5 words MAX.** Punchy, not the full post title.
- Font style: bold sans-serif (white on dark) OR decorative script (gold style)
- Accent word: different color (red, gold, orange) or italic
- Subtext: optional, 1 short phrase below headline
- Language: RUSSIAN always

### Good headline examples
| Post topic | Cover text |
|---|---|
| Как я заработал 100к на вайб-кодинге | ДЕНЬГИ НА ВАЙБЕ |
| Новый Claude 4 вышел | CLAUDE 4 ЗДЕСЬ |
| Как настроить Cursor AI | CURSOR ЗА 5 МИНУТ |
| Мой провал с запуском | ПРОВАЛ? |
| Обзор лучших AI инструментов 2025 | ТОП ИИ 2025 |

---

## Prompt Construction Rules

### For GPT Image 1.5 (4o)
- Strong with text instructions — good at rendering Russian text
- Template: `[visual scene], bold Russian text "[HEADLINE]" prominently displayed, [style], 3:2 horizontal format`
- Add: `photorealistic 3D render` or `dark dramatic lighting` or `vibrant colors`

### For Nano Banana
- Better for artistic/stylized visuals
- Template: `[detailed visual description], horizontal 16:9 banner, [style], with large Russian text "[HEADLINE]" overlay`
- Add style keywords: `cinematic`, `high contrast`, `professional design`

---

## Model Selection Guide

| Situation | Model |
|---|---|
| Needs accurate Russian text rendering | GPT Image 1.5 |
| Artistic/3D visual style | Nano Banana |
| Gold/luxury typography | GPT Image 1.5 |
| Bright pop colors, clean design | Nano Banana |
| Default choice | GPT Image 1.5 |

---

## Output Specs
- Format: JPEG
- Aspect: 16:9 (horizontal)
- Min width: 1280px
- Saved to: `/root/.openclaw/workspace/covers/` (create if missing)
- Filename: `cover_YYYY-MM-DD_HH-MM.jpg`
