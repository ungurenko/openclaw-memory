---
name: telegram-post-formatter
description: Format raw text into professionally styled Telegram channel posts following Александр's editorial style. Use when Александр needs to prepare content for his Telegram channel — transforming draft text into clean, scannable posts with proper Markdown formatting, emoji placement, visual structure, and brand voice. Handles heading hierarchy, lists, quotes, CTA formatting, and code blocks.
---

# Telegram Post Formatter

## Overview

Transform raw text into professionally formatted Telegram channel posts following Александр's editorial style: clean, scannable, visually structured with strategic emoji usage and Markdown formatting.

**Important:** Return ONLY the formatted text with Markdown syntax. Do NOT wrap output in code blocks (```). The output should be ready to send directly via Telegram.

## Formatting Rules

Apply these rules strictly when formatting posts:

### Critical Constraints

- **ONLY Markdown syntax** — `**bold**`, `*italic*`, `` `code` ``, `> quote`
- **NEVER HTML tags** — no `<b>`, `<i>`, `<u>`, etc.
- **Never wrap output in code blocks** — return ONLY clean formatted text
- **Russian quotes only** — always use «елочки» («»), never single/double ASCII quotes
- **Markdown limitation:** NO underline available — use ***bold italic*** for strong emphasis instead

### Structure & Readability

**Абзацы:**
- Split text into short blocks: 1-3 sentences per paragraph
- Empty line between paragraphs for breathing room
- Regular narrative paragraphs: NO bold, NO emoji — just clean text

**Заголовок поста:**
- First line of message: ALWAYS wrap entirely in `**...**`

**Подзаголовки:**
- If explicit headings exist in source text → add emoji + `**...**`
- When paragraph starts new semantic block → emoji + bold FIRST 3-7 WORDS only, rest is regular text
- Example: `🧩 **Claude хорош для профессиональных задач** — остальной текст обычный.`
- DO NOT invent new headings — work only with existing text

### Lists & Bullets

**Format:**
- Emoji + `**Name**` + dash + regular text

**Emoji variety for lists:**
🔺, 🔸, 🔹, 💥, ⚡, 👉, 🎯, ✅, ✨, 🌟, 💫, 🔜, 📌, 🔖, 🏷️

**Examples:**
- `🔺 **Perplexity** - сначала относился скептически, теперь использую постоянно.`
- `🔸 **Claude** - лучший для длинных документов и анализа.`

**Final summary lists:**
- Use `◆` symbol + emoji:
```
✨ ◆ **Итог 1** - описание
✨ ◆ **Итог 2** - описание
```

### Emoji Usage

**Use emoji ONLY on:**
- Title (first line)
- Section headings
- List items
- CTA (call to action)

**DO NOT use emoji on:**
- Regular narrative paragraphs

**Emoji categories:**

**Мышление, идеи:** 🧠, 💡, 🔎, 💭, 🎯, 🪞, 🔮, 🧩, 🗝️, 🧭
**Действие, результат:** 🔥, 🚀, ⚡, 👉, 🏃, 💪, 🎬, 🆙, 📈, ✅, 💯
**Проблема, ошибка:** ❌, 🛑, ⚠️, 🚫, ⛔, 🔴, ⚡, 🆘
**Структура, итоги:** 📋, 🔗, 📌, 🏷️, 📑, 📊, 📆, 📅, 🗂️, ✅
**Инструменты:** 🧩, 🔺, 🔸, 🔹, 💥, ⚙️, 🛠️, 🔧, 📱, 💻, 🖥️
**Деньги, успех:** 💰, 📈, 💎, 🏆, 🥇, 💵, 🤑, 📊, 🎁, 🎯
**Личное, эмоции:** ❤️, 😊, 😎, 🙌, 🤝, 🙏, 🥰, 🎉, 🌟
**Обучение:** 📚, 🎓, 💪, 🧘, 🗺️, 🏫, 📖, 💬, 👂
**CTA:** 😎, 👉, 🔜, 📢, 🎯, ✅, 💪, 🙌, 🔥

**Important:** Vary emoji! Don't repeat the same ones.

### Semantic Emphasis

**`*Курсив*`:**
- Personal remarks, inner voice ("если честно", "по-моему")
- Quotes in «...» — wrap entire quoted text: `«*Она не напишет так, как я. Это будет видно*»`

**`***Жирный курсив***`:**
- Key emotional phrases that carry core message (replaces underline from original HTML style)
- Examples: `***Перестанут доверять. Перестанут покупать***`, `***не забота о качестве***`, `***это обычный страх***`
- Use sparingly: 1-3 times per post, on strongest moments
- Also use in CTA on key words

### Quotes & Key Thoughts

If post contains one key conclusion/insight — format as quote:

```
> Я разделил так: ChatGPT - личное, Claude - профессиональное.
```

### Code Blocks & Prompts

For ChatGPT/Claude prompts or code snippets:
- Inline code: wrap in `` `code` ``
- Multi-line code block: wrap in triple backticks
- INSIDE code blocks: NO formatting (no `**bold**`, `*italic*`, no emoji)
- DO NOT put emoji directly before code block

**Example:**
```
Промт для ChatGPT:

\`\`\`
Ты — эксперт по маркетингу.
Проанализируй этот текст...
\`\`\`
```

### CTA (Call to Action)

Format: Emoji + text with key words in ***bold italic***

**Examples:**
- `😎 ***Сохраняйте себе, тестируйте*** и делитесь с теми, кто ещё переплачивает за подписки.`
- `👉 ***Подписывайтесь*** и получайте больше таких разборов!`
- `🚀 ***Попробуйте сегодня*** — результат вас удивит.`

### Punctuation

- NO long dash (—) → use short dash with spaces (` - `) or comma
- Thousand separator: space only (1 450 000)
- Quotes: always «елочки»

## Workflow

1. Read the raw text
2. Identify structure: title, sections, lists, quotes, CTA
3. Apply Markdown formatting rules systematically
4. Ensure visual breathing room (paragraph spacing)
5. Return ONLY clean Markdown-formatted text (no code blocks, no explanations)

## What NOT to Change

- DO NOT change meaning
- DO NOT add/remove words
- DO NOT invent new headings or subheadings
- ONLY: arrange Markdown syntax, emoji, punctuation, paragraph breaks
