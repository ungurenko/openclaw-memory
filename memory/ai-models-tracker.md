# AI Models Tracker — ОФИЦИАЛЬНЫЕ ДАННЫЕ

**Последнее обновление:** 14 февраля 2026  
**Источники:** только официальные сайты компаний и OpenRouter

---

## 🤖 Актуальные LLM модели (февраль 2026)

### **Anthropic (Claude)**
**Источник:** docs.anthropic.com

#### Актуальные модели (рекомендуемые):
- ✅ **Claude Opus 4.6** — топовая модель для кодинга и агентов
  - API ID: `claude-opus-4-6`
  - Context: 200K tokens (beta: 1M)
  - Max output: 128K tokens
  - Pricing: $5 input / $25 output per 1M tokens
  - Extended thinking: Yes
  - Adaptive thinking: Yes

- ✅ **Claude Sonnet 4.5** — баланс скорости и интеллекта
  - API ID: `claude-sonnet-4-5` (alias) / `claude-sonnet-4-5-20250929`
  - Context: 200K tokens (beta: 1M)
  - Max output: 64K tokens
  - Pricing: $3 input / $15 output per 1M tokens
  - Extended thinking: Yes
  - Knowledge cutoff: Jan 2025

- ✅ **Claude Haiku 4.5** — самая быстрая модель
  - API ID: `claude-haiku-4-5` (alias) / `claude-haiku-4-5-20251001`
  - Context: 200K tokens
  - Max output: 64K tokens
  - Pricing: $1 input / $5 output per 1M tokens
  - Knowledge cutoff: Feb 2025

#### Устаревшие (доступны, но не рекомендуются):
- ⚠️ Claude Opus 4.5, 4.1, 4.0
- ⚠️ Claude Sonnet 4.0, 3.7
- ⚠️ Claude Haiku 3

---

### **OpenAI**
**Источник:** openai.com

- ✅ **GPT-5** — самая умная модель с built-in thinking
  - Релиз: 7 августа 2025
  - Context: 400K tokens
  - Max output: 128K tokens
  - Pricing: $1.25 input / $10.00 output per 1M tokens
  - Capabilities: Text & Vision

- ✅ **GPT-5 mini** — балансная версия
  - Context: 400K tokens
  - Max output: 128K tokens
  - Pricing: $0.25 input / $2.00 output per 1M tokens

- ✅ **GPT-5 nano** — самая дешёвая
  - Context: 400K tokens
  - Max output: 128K tokens
  - Pricing: $0.05 input / $0.40 output per 1M tokens

---

### **Google (Gemini)**
**Источник:** ai.google.dev

- ✅ **Gemini 3 Pro** (preview) — лучшая модель для мультимодального понимания
  - Model code: `gemini-3-pro-preview`
  - Latest update: November 2025
  - Context: 1,048,576 tokens
  - Max output: 65,536 tokens
  - Knowledge cutoff: January 2025
  - Capabilities: Text, Image, Video, Audio, PDF input → Text output
  - Thinking: Supported

- ✅ **Gemini 3 Flash** (preview) — баланс скорости и интеллекта
  - Model code: `gemini-3-flash-preview`
  - Latest update: November 2025
  - Context: 1,048,576 tokens
  - Max output: 65,536 tokens
  - Capabilities: Text, Image, Video, Audio, PDF input → Text output

- ✅ **Gemini 3 Pro Image** (preview) — генерация изображений
  - Model code: `gemini-3-pro-image-preview`
  - Context: 65,536 tokens (input)
  - Max output: 32,768 tokens
  - Capabilities: Image & Text input → Image & Text output

---

### **DeepSeek (Китай)**
**Источник:** api-docs.deepseek.com

- ✅ **DeepSeek-V3.2** — актуальная open-source модель
  - API models:
    - `deepseek-chat` (non-thinking mode)
    - `deepseek-reasoner` (thinking mode)
  - Context: 128K tokens
  - Max output: 4K (default), 8K (max) для chat | 32K (default), 64K (max) для reasoner
  - Pricing:
    - Input (cache miss): $0.28 / 1M tokens
    - Input (cache hit): $0.028 / 1M tokens
    - Output: $0.42 / 1M tokens
  - Features: JSON Output, Tool Calls, FIM Completion (chat only)

⚠️ **Важно:** API версия (V3.2) отличается от APP/WEB версии

---

### **Meta (Llama)**
**Источник:** llama.meta.com

- ✅ **Llama 4** — последняя версия
  - Open-source модель
  - Доступна для скачивания через Meta, Hugging Face, Kaggle

- ✅ **Llama Guard 4** — модель безопасности

- ✅ **Llama 3.3** — предыдущая версия (всё ещё актуальна)

- ✅ **Llama 3.2** — доступна (1B/3B quantized версии)

- ✅ **Llama 3.1** — доступна

⚠️ **Примечание:** На официальном сайте Meta не указаны точные параметры контекста и pricing для Llama 4 — нужно проверять через провайдеров (OpenRouter, HuggingFace).

---

## ❓ Модели требующие проверки

Следующие компании/модели существуют, но нужна проверка через официальные источники:

- **xAI (Elon Musk)** — Grok (нужен официальный сайт x.ai)
- **Mistral (Франция)** — Mistral Large (mistral.ai)
- **Cohere** — Command R+ (cohere.com)
- **Alibaba** — Qwen (нужен официальный сайт)
- **ByteDance** — Doubao (проверить официальные данные)

---

## 🧪 Личный опыт Александра (бенчмарки)

### GLM (Zai) — тест 18 фев 2026
- **glm-5** — 🏆 лучший в текстах (посты, живой стиль, образные формулировки). Медленный (~12-54с), зависит от задачи. Пост про вайб-кодинг от GLM-5 взят в реальный TG-канал.
- **glm-4.7** — хорош в тексте (2е место), быстрее ~24с, reasoning ~860 токенов
- **glm-4.7-flash** — средне по качеству, ~20с
- **glm-4.7-flashx** — быстрейший (~0.8с) но даёт 429 rate limit

---

## 🔄 План обновления

- **Автоматически:** еженедельный поиск через Exa MCP (только официальные сайты)
- **Вручную:** когда Александр сообщает об обновлениях
- **Источники:** ТОЛЬКО официальная документация компаний

---

## 📝 История изменений

### 2026-02-14 (ИСПРАВЛЕНО)
- ✅ Собраны ТОЛЬКО официальные данные
- ✅ Подтверждены: Claude Opus 4.6 / Sonnet 4.5 / Haiku 4.5
- ✅ Подтверждены: GPT-5 / GPT-5 mini / GPT-5 nano (релиз август 2025)
- ✅ Подтверждены: Gemini 3 Pro / 3 Flash / 3 Pro Image (preview, ноябрь 2025)
- ✅ Подтверждены: DeepSeek-V3.2 (chat + reasoner)
- ✅ Подтверждены: Llama 4 / 3.3 / 3.2 / 3.1
- ❌ Удалены: непроверенные данные из новостных порталов
- ❌ Удалены: домыслы про GPT-5.2, Gemini "3 Pro" из новостей (нет в официальной документации)
