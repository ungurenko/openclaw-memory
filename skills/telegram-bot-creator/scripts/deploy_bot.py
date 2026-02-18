#!/usr/bin/env python3
"""
Автоматический деплой Telegram-бота на Railway.
Исправляет проблемы с переменными окружения.
"""

import subprocess
import sys
import os
import time

def run_command(cmd, check=True, capture_output=False):
    """Выполняет команду в shell."""
    print(f"🔧 Выполняю: {cmd}")

    # Добавляем Railway API token если есть
    env = os.environ.copy()
    if 'RAILWAY_API_TOKEN' in os.environ:
        env['RAILWAY_API_TOKEN'] = os.environ['RAILWAY_API_TOKEN']

    result = subprocess.run(
        cmd,
        shell=True,
        check=False,
        capture_output=capture_output,
        text=True,
        env=env
    )
    if check and result.returncode != 0:
        print(f"❌ Ошибка: {result.stderr if capture_output else 'команда завершилась с ошибкой'}")
        sys.exit(1)
    return result

def deploy_bot(project_path, bot_name, bot_token, openrouter_key, model_name="openrouter/aurora-alpha", railway_token=None):
    """
    Деплой бота на Railway.

    Args:
        project_path: Путь к папке с ботом
        bot_name: Имя проекта на Railway
        bot_token: Telegram Bot Token
        openrouter_key: OpenRouter API Key
        model_name: Модель OpenRouter (по умолчанию aurora-alpha)
        railway_token: Railway API Token (опционально, из env если не указан)
    """

    # Устанавливаем Railway токен
    if railway_token:
        os.environ['RAILWAY_API_TOKEN'] = railway_token
    elif 'RAILWAY_API_TOKEN' not in os.environ:
        print("❌ Ошибка: RAILWAY_API_TOKEN не найден!")
        print("Установите переменную окружения или передайте как параметр")
        sys.exit(1)

    os.chdir(project_path)

    # 1. Проверяем, что railway CLI доступен
    print("📦 Проверяю Railway CLI...")
    run_command("railway --version", check=False)

    # 2. Инициализируем Railway проект (если ещё не)
    print(f"🚀 Инициализирую Railway проект: {bot_name}")
    result = run_command(
        f'railway init --name {bot_name}',
        check=False,
        capture_output=True
    )

    # Если проект уже существует - это нормально
    if "already exists" in result.stderr or result.returncode == 0:
        print("✅ Проект уже существует или создан")
    else:
        print("✅ Проект создан")

    # 3. Первый деплой для создания сервиса
    print("📤 Делаю первый деплой...")
    run_command("railway up --ci", check=True)

    # 4. Ждём завершения деплоя
    print("⏳ Жду завершения деплоя (30 сек)...")
    time.sleep(30)

    # 5. Получаем список сервисов и выбираем нужный
    print("🔍 Ищу созданный сервис...")
    result = run_command(
        "railway status --json",
        capture_output=True,
        check=False
    )

    # 6. Связываем сервис (это ключевой шаг для возможности установки переменных!)
    print("🔗 Связываю сервис...")
    link_result = run_command(
        f"railway service link",
        check=False,
        capture_output=True
    )

    # Если не удалось связать автоматически, пробуем найти ID сервиса
    if link_result.returncode != 0:
        print("⚠️ Не удалось связать автоматически, ищу сервис...")
        # Парсим вывод railway status для получения service ID
        # (это сложный случай, обычно link работает)
        print("ℹ️ Попробую установить переменные напрямую...")

    # 7. Устанавливаем переменные окружения
    print("⚙️ Устанавливаю переменные окружения...")
    run_command(
        f'railway variables set '
        f'TELEGRAM_BOT_TOKEN="{bot_token}" '
        f'OPENROUTER_API_KEY="{openrouter_key}" '
        f'MODEL_NAME="{model_name}" '
        f'BOT_NAME="{bot_name}"',
        check=True
    )

    # 8. Получаем домен
    print("🌐 Получаю публичный домен...")
    domain_result = run_command(
        "railway domain",
        capture_output=True,
        check=False
    )

    if domain_result.returncode == 0:
        domain = domain_result.stdout.strip()
        webhook_url = f"https://{domain}/telegram-webhook"
        print(f"✅ Домен: {domain}")

        # 9. Устанавливаем webhook URL как переменную
        print(f"🔗 Устанавливаю webhook URL: {webhook_url}")
        run_command(
            f'railway variables set WEBHOOK_URL="{webhook_url}"',
            check=True
        )

    # 10. Перезапускаем сервис с новыми переменными
    print("🔄 Перезапускаю сервис...")
    run_command("railway restart --yes", check=False)

    print("\n✅ Деплой завершён!")
    print(f"🤖 Бот: @{bot_name}")
    if domain_result.returncode == 0:
        print(f"📡 Webhook: {webhook_url}")

    return True

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Использование: python deploy_bot.py <project_path> <bot_name> <bot_token> <openrouter_key> [model_name]")
        print("\nПеременные окружения:")
        print("  RAILWAY_API_TOKEN - Railway API токен (обязательно)")
        sys.exit(1)

    project_path = sys.argv[1]
    bot_name = sys.argv[2]
    bot_token = sys.argv[3]
    openrouter_key = sys.argv[4]
    model_name = sys.argv[5] if len(sys.argv) > 5 else "openrouter/aurora-alpha"

    # Railway токен из переменной окружения
    railway_token = os.environ.get('RAILWAY_API_TOKEN')

    deploy_bot(project_path, bot_name, bot_token, openrouter_key, model_name, railway_token)
