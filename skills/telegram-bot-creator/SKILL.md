---
name: telegram-bot-creator
description: Create and deploy Telegram bots with AI integration to Railway automatically. Use when user wants to create a new Telegram bot with OpenRouter AI, deploy bot to Railway, or set up webhook-based bot infrastructure. Handles all Railway CLI complexities including service linking and environment variables automatically. ALWAYS run as sub-agent with model zai/glm-5.
---

# Telegram Bot Creator

⚠️ **ВАЖНО:** Этот skill всегда запускать через sub-agent с моделью `zai/glm-5`.

**Команда для запуска:**
```bash
sessions_spawn с задачей: "Используй skill telegram-bot-creator для создания бота с параметрами: <параметры>"
Модель: zai/glm-5
```

Автоматическое создание и деплой Telegram-ботов с AI через OpenRouter на Railway.

## Что делает этот skill

1. Создаёт структуру проекта Telegram-бота
2. Настраивает webhook для надёжной работы
3. Интегрирует OpenRouter AI API
4. Автоматически деплоит на Railway с правильной установкой переменных

## Workflow

### Шаг 0: Запуск через Sub-Agent

**⚠️ КРИТИЧНО ВАЖНО:** Этот skill ВСЕГДА запускать через sessions_spawn!

**Правильный способ вызова:**
1. Напиши пользователю: "Запускаю создание бота в фоне 🦀"
2. Запусти sessions_spawn с параметрами:
   - `model: "zai/glm-5"`
   - `task: "Используй skill telegram-bot-creator. Создай Telegram бота с параметрами: [все параметры]"`
   - `label: "telegram-bot-creator"`

**НЕ делай в main сессии — всегда через sub-agent!**

### Шаг 0.1: Подготовка

**⚠️ Обязательно:** Railway API Token должен быть в переменной окружения:
```bash
export RAILWAY_API_TOKEN="<токен>"
```

Или передавай токен в каждой команде:
```bash
RAILWAY_API_TOKEN=<токен> railway <команда>
```

### Шаг 1: Сбор информации

**Требования:**
- Railway API Token (из переменной окружения `RAILWAY_API_TOKEN`)
- Telegram Bot Token (от @BotFather)
- OpenRouter API Key (от openrouter.ai)
- Имя бота (для Railway проекта)
- Описание бота (что он должен делать)
- Модель OpenRouter (по умолчанию: `openrouter/aurora-alpha`)

Спроси у пользователя:
- **Telegram Bot Token** (от @BotFather)
- **OpenRouter API Key** (от openrouter.ai)
- **Имя бота** (для Railway проекта)
- **Описание бота** (что он должен делать)
- **Модель OpenRouter** (по умолчанию: `openrouter/aurora-alpha`)

Пример запроса:
```
Создай бот для улучшения промптов
- Token: 8560371121:AAFmozc7xP44cte-FU49SFjXrG3EhGMIusE
- OpenRouter Key: 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
- Имя: PromptImproverBot
- Что делает: Улучшает промпты пользователей
- Модель: arcee-ai/trinity-large-preview:free
```

### Шаг 2: Создание проекта

```bash
# 1. Создаём папку проекта
mkdir -p ~/clawd/<bot-name>
cd ~/clawd/<bot-name>

# 2. Копируем шаблоны из assets/
cp ~/.openclaw/workspace/skills/telegram-bot-creator/assets/package.json .
cp ~/.openclaw/workspace/skills/telegram-bot-creator/assets/index.js .
cp ~/.openclaw/workspace/skills/telegram-bot-creator/assets/Procfile .
cp ~/.openclaw/workspace/skills/telegram-bot-creator/assets/.gitignore .

# 3. Настраиваем package.json (заменяем {{BOT_NAME}}, {{BOT_DESCRIPTION}})
# 4. Настраиваем index.js (заменяем плейсхолдеры {{...}})
# 5. Устанавливаем зависимости
npm install
```

### Шаг 3: Деплой на Railway

**⚠️ КРИТИЧНО ВАЖНО:** Правильный порядок установки переменных!

```bash
# 1. Инициализируем Railway проект
cd ~/clawd/<bot-name>
railway init --name <bot-name>

# 2. Первый деплой (создаёт сервис)
railway up --ci

# 3. Ждём завершения (30 сек)
sleep 30

# 4. СВЯЗЫВАЕМ СЕРВИС (обязательно!)
railway service link
# Если не сработает - найти service ID через railway status --json

# 5. Устанавливаем переменные
railway variables set \
  TELEGRAM_BOT_TOKEN="<token>" \
  OPENROUTER_API_KEY="<key>" \
  MODEL_NAME="<model>" \
  BOT_NAME="<bot-name>"

# 6. Получаем публичный домен
railway domain

# 7. Устанавливаем webhook URL
railway variables set WEBHOOK_URL="https://<domain>/telegram-webhook"

# 8. Перезапускаем сервис
railway restart --yes
```

### Шаг 4: Настройка Telegram webhook

```bash
# Устанавливаем webhook через Telegram API
curl -s "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<domain>/telegram-webhook"
```

## Автоматический деплой через скрипт

Для полного автоматизации используй скрипт:

```bash
cd ~/clawd/<bot-name>
python3 ~/.openclaw/workspace/skills/telegram-bot-creator/scripts/deploy_bot.py \
  . \
  <bot-name> \
  <bot-token> \
  <openrouter-key> \
  <model-name>
```

## Типичные ошибки и решения

### ❌ "No service linked"
**Проблема:** Переменные не устанавливаются
**Решение:** Сначала выполни `railway service link`, потом `variables set`

### ❌ "Conflict: terminated by other getUpdates request"
**Проблема:** Запущено несколько инстансов бота
**Решение:** Используй webhook вместо polling (уже в шаблоне)

### ❌ "Read timeout expired"
**Проблема:** Telegram не может достучаться до webhook
**Решение:** Проверь, что WEBHOOK_URL установлен правильно

### ❌ Модель долго отвечает
**Проблема:** Медленная модель
**Решение:** Замени на более быструю (aurora-alpha, trinity-large-preview:free)

## Шаблоны файлов

Все шаблоны находятся в `assets/`:
- `package.json` - зависимости (Telegraf, Express, node-fetch)
- `index.js` - основной код с webhook
- `Procfile` - команда запуска для Railway
- `.gitignore` - исключения для git

## Кастомизация бота

Для изменения функционала редактируй в `index.js`:
- `SYSTEM_PROMPT` - системный промпт для AI
- `START_MESSAGE` - приветственное сообщение
- `PROCESSING_MESSAGE` - сообщение во время обработки
- `ERROR_MESSAGE` - сообщение об ошибке

**Примеры ботов:** См. [references/examples.md](references/examples.md) для готовых примеров разных типов ботов и настроек.

## Переменные окружения

Обязательные:
- `TELEGRAM_BOT_TOKEN` - токен от BotFather
- `OPENROUTER_API_KEY` - ключ от OpenRouter
- `MODEL_NAME` - модель OpenRouter

Автоматические:
- `WEBHOOK_URL` - URL для webhook (устанавливается автоматически)
- `BOT_NAME` - имя бота (для логов)
- `PORT` - порт (Railway устанавливает автоматически)

## Проверка работы

```bash
# 1. Проверь, что бот отвечает
curl https://<domain>/

# 2. Проверь webhook
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo" | jq

# 3. Проверь логи Railway
railway logs --tail 50
```

## Успешный результат

После деплоя:
1. Бот доступен в Telegram: @<bot-username>
2. Webhook активен: https://<domain>/telegram-webhook
3. Переменные установлены корректно
4. Бот отвечает на сообщения
