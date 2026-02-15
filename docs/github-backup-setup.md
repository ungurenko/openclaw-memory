# GitHub Backup Setup — Инструкция

## Что подготовлено:

1. ✅ `.gitignore` — исключает venv, логи, временные файлы
2. ✅ `scripts/git-backup.sh` — скрипт для автоматического commit + push
3. ✅ Промпт для Daily Synthesis в `docs/daily-synthesis-setup.md`

---

## Шаги для завершения настройки:

### 1. Создать GitHub репозиторий

**Александр создаёт:**
- Private repository на GitHub
- Название: например `openclaw-workspace-backup`
- Без README, без .gitignore (уже есть локально)

Получить SSH URL: `git@github.com:USERNAME/REPO.git`

---

### 2. Настроить SSH ключ

**На сервере (я сделаю):**

```bash
# Проверить существующий ключ
ls -la ~/.ssh/id_*.pub

# Если нет — создать новый
ssh-keygen -t ed25519 -C "openclaw-vps" -f ~/.ssh/id_openclaw -N ""

# Показать публичный ключ
cat ~/.ssh/id_openclaw.pub
```

**Александр добавляет:**
- GitHub → Settings → SSH and GPG keys → New SSH key
- Вставить содержимое `id_openclaw.pub`
- Title: "OpenClaw VPS"

**Настроить SSH config (я сделаю):**
```bash
cat >> ~/.ssh/config << EOF

Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_openclaw
  IdentitiesOnly yes
EOF
```

---

### 3. Инициализировать git и подключить remote

**Команды (я выполню):**

```bash
cd /root/.openclaw/workspace

# Инициализировать git (если ещё не сделано)
git init
git branch -M main

# Добавить remote
git remote add origin git@github.com:USERNAME/REPO.git

# Первый коммит
git add -A
git commit -m "Initial backup: OpenClaw workspace setup"

# Первый push
git push -u origin main
```

---

### 4. Настроить автоматический бэкап

**Cron-задача (я создам):**

```bash
openclaw cron add
```

**Job config:**
```json
{
  "name": "Nightly GitHub Backup",
  "schedule": {
    "kind": "cron",
    "expr": "0 3 * * *",
    "tz": "Europe/Moscow"
  },
  "sessionTarget": "main",
  "payload": {
    "kind": "systemEvent",
    "text": "exec: cd /root/.openclaw/workspace && ./scripts/git-backup.sh"
  },
  "enabled": true
}
```

---

## Проверка работоспособности:

```bash
# Тестовый запуск
cd /root/.openclaw/workspace
./scripts/git-backup.sh "Test backup"

# Проверить на GitHub — появился коммит
```

---

## Что нужно от Александра:

1. **GitHub repo URL** (после создания)
2. **Подтверждение добавления SSH ключа** (покажу публичный ключ)

Всё остальное сделаю автоматически.
