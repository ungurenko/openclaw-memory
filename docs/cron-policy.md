# Cron Policy — Правила настройки cron-задач

**Цель:** Избежать повторяющихся проблем с cron задачами.

## Модели

**✅ Разрешённые модели для cron:**
- `zai/glm-4.7` — основная модель для всех задач
- `zai/glm-5` — ТОЛЬКО если Александр явно попросил (daily-reflection, Макс)

**❌ Запрещённые модели:**
- `google-gemini-cli/gemini-2.5-flash` — не в allowlist
- Любые другие модели без явного разрешения

## Delivery

**Обязательно для всех задач:**
```json
{
  "delivery": {
    "mode": "announce",
    "channel": "telegram",
    "to": "275175013",
    "bestEffort": true
  }
}
```

**Без этого — ошибка "Action send requires a target"**

## Timeout

| Тип задачи | Timeout |
|------------|---------|
| Простые проверки | 60 сек |
| Веб-поиск / API | 120 сек |
| Сложный анализ | 240-300 сек |
| Daily Synthesis | 300 сек |
| model-releases-tracker | 300 сек |

## Payload

**Обязательно:**
- `message` — понятная инструкция для агента
- `model` — `zai/glm-4.7` (default)
- `timeoutSeconds` — адекватный задаче

**Инструкция должна содержать:**
- Конкретный action (Read X, Run skill Y)
- Способ доставки ("send to Александр via message tool with to=275175013")

## Чеклист перед созданием/изменением cron

1. [ ] Модель = `zai/glm-4.7` (или glm-5 если явно попросил)
2. [ ] Delivery = announce + channel=telegram + to=275175013
3. [ ] Timeout адекватный задаче
4. [ ] Payload.message содержит способ доставки

## История проблем

| Дата | Задача | Проблема | Решение |
|------|--------|----------|---------|
| 18.02 | 5 задач | "model not allowed" | Перевёл на glm-4.7 |
| 18.02 | daily-reflection | "Action send requires a target" | Добавил delivery.to |
| 18.02 | Daily Synthesis | Timeout 120 сек | Увеличил до 300 сек |

---

*Последнее обновление: 18 февраля 2026*
