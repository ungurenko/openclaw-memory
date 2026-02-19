#!/usr/bin/env python3
"""
Проверка новых релизов OpenClaw и Claude Code на GitHub.
Использует GitHub API для получения последних релизов.
"""

import requests
import os
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional

# Репозитории для отслеживания
REPOS = [
    {"owner": "openclaw", "name": "openclaw", "display": "OpenClaw"},
    {"owner": "anthropics", "name": "claude-code", "display": "Claude Code"}
]

# Файл для хранения последних проверенных релизов
STATE_FILE = os.path.expanduser("~/.openclaw/workspace/skills/github-releases-tracker/last_check.json")


def load_state() -> Dict:
    """Загрузить состояние последней проверки."""
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, 'r') as f:
                return json.load(f)
        except:
            pass
    return {}


def save_state(state: Dict):
    """Сохранить состояние последней проверки."""
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    with open(STATE_FILE, 'w') as f:
        json.dump(state, f, indent=2)


def get_latest_release(owner: str, name: str) -> Optional[Dict]:
    """Получить последний релиз из GitHub API."""
    url = f"https://api.github.com/repos/{owner}/{name}/releases/latest"
    
    headers = {}
    github_token = os.getenv("GITHUB_TOKEN")
    if github_token:
        headers["Authorization"] = f"token {github_token}"
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 404:
            # Нет релизов, попробуем получить список тегов
            return get_latest_tag(owner, name, headers)
    except Exception as e:
        print(f"Ошибка при получении релиза {owner}/{name}: {e}")
    
    return None


def get_latest_tag(owner: str, name: str, headers: Dict) -> Optional[Dict]:
    """Получить последний тег если нет релизов."""
    url = f"https://api.github.com/repos/{owner}/{name}/tags"
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            tags = response.json()
            if tags:
                return {
                    "tag_name": tags[0]["name"],
                    "name": tags[0]["name"],
                    "html_url": tags[0].get("commit", {}).get("url", ""),
                    "body": "Описание недоступно (только тег)",
                    "published_at": None,
                    "is_tag": True
                }
    except Exception as e:
        print(f"Ошибка при получении тегов {owner}/{name}: {e}")
    
    return None


def format_release_info(repo_display: str, release: Dict, is_new: bool) -> str:
    """Форматировать информацию о релизе."""
    tag = release.get("tag_name", "unknown")
    name = release.get("name", tag)
    url = release.get("html_url", "")
    body = release.get("body", "Описание отсутствует")
    published = release.get("published_at")
    
    # Дата публикации
    date_str = ""
    if published:
        try:
            dt = datetime.fromisoformat(published.replace("Z", "+00:00"))
            date_str = dt.strftime("%d.%m.%Y %H:%M")
        except:
            date_str = published
    
    # Формирование сообщения
    status = "🆕 НОВЫЙ РЕЛИЗ" if is_new else "📦 Текущий релиз"
    
    result = f"\n{'='*60}\n"
    result += f"{status}: {repo_display}\n"
    result += f"{'='*60}\n"
    result += f"📌 Версия: {tag}\n"
    if name != tag:
        result += f"📝 Название: {name}\n"
    if date_str:
        result += f"📅 Дата: {date_str}\n"
    result += f"🔗 Ссылка: {url}\n\n"
    
    # Обработка body
    if body and body != "Описание отсутствует":
        result += "📋 Что нового:\n"
        result += format_body(body)
    else:
        result += "📋 Описание отсутствует\n"
    
    return result


def translate_text(text: str, target_lang: str = "ru") -> str:
    """Перевести текст на указанный язык через MyMemory API."""
    import urllib.parse
    
    # Ограничиваем размер для перевода (MyMemory лимит ~500 символов за запрос)
    max_chunk = 450
    original_text = text
    
    try:
        # Разбиваем на чанки если текст длинный
        if len(text) <= max_chunk:
            chunks = [text]
        else:
            chunks = []
            lines = text.split("\n")
            current = ""
            for line in lines:
                if len(current) + len(line) + 1 <= max_chunk:
                    current = current + "\n" + line if current else line
                else:
                    if current:
                        chunks.append(current)
                    current = line
            if current:
                chunks.append(current)
        
        translated_chunks = []
        for chunk in chunks:
            url = f"https://api.mymemory.translated.net/get?q={urllib.parse.quote(chunk)}&langpair=en|{target_lang}"
            response = requests.get(url, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("responseStatus") == 200:
                    translated_chunks.append(result["responseData"]["translatedText"])
                else:
                    # Fallback на оригинал для этого чанка
                    translated_chunks.append(chunk)
            else:
                translated_chunks.append(chunk)
        
        if translated_chunks:
            return "\n".join(translated_chunks) + "\n\n📝 _Машинный перевод_"
    except Exception:
        pass
    
    # Fallback: возвращаем оригинал с пометкой
    return original_text + "\n\n📝 _Оригинал на английском_"


def format_body(body: str) -> str:
    """Форматировать тело релиза для читаемости."""
    # Ограничиваем размер
    max_length = 1500
    if len(body) > max_length:
        body = body[:max_length] + "\n\n... (полное описание по ссылке выше)"
    
    # Переводим на русский
    translated_body = translate_text(body)
    
    # Добавляем отступы
    lines = translated_body.split("\n")
    formatted_lines = ["  " + line for line in lines]
    
    return "\n".join(formatted_lines) + "\n"


def main():
    """Основная функция проверки релизов."""
    state = load_state()
    new_releases_found = False
    output = []
    
    output.append("\n🔍 ПРОВЕРКА ОБНОВЛЕНИЙ GITHUB\n")
    output.append(f"⏰ Время проверки: {datetime.now().strftime('%d.%m.%Y %H:%M:%S')}\n")
    
    for repo in REPOS:
        owner = repo["owner"]
        name = repo["name"]
        display = repo["display"]
        repo_key = f"{owner}/{name}"
        
        release = get_latest_release(owner, name)
        
        if not release:
            output.append(f"\n❌ {display}: не удалось получить информацию о релизах\n")
            continue
        
        tag = release.get("tag_name")
        last_tag = state.get(repo_key)
        
        is_new = (last_tag is None or tag != last_tag)
        
        if is_new:
            new_releases_found = True
        
        output.append(format_release_info(display, release, is_new))
        
        # Обновляем состояние
        state[repo_key] = tag
    
    # Сохраняем состояние
    save_state(state)
    
    # Итоговое сообщение
    if new_releases_found:
        output.append("\n" + "="*60)
        output.append("✅ Найдены новые релизы! См. выше.")
        output.append("="*60 + "\n")
    else:
        output.append("\n" + "="*60)
        output.append("ℹ️  Новых релизов не обнаружено с момента последней проверки.")
        output.append("="*60 + "\n")
    
    # Вывод всего результата
    result = "\n".join(output)
    print(result)
    
    return 0 if not new_releases_found else 1


if __name__ == "__main__":
    exit(main())
