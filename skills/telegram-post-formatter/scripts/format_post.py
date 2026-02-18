#!/usr/bin/env python3
"""
Telegram Post Formatter — использует zai/glm-5
Использование: python3 format_post.py "сырой текст"
             или: cat raw.txt | python3 format_post.py
"""

import sys
import json
import urllib.request
import os

# API config
API_KEY = "123ecc7bfee04d58b7404b8712d7607b.dn9jUrwetSK65S7n"
BASE_URL = "https://api.z.ai/api/coding/paas/v4/chat/completions"
MODEL = "zai/glm-5"

SYSTEM_PROMPT = """Ты форматируешь Telegram-посты по строгим правилам.

ПРАВИЛА:
- Только Markdown: **жирный**, *курсив*, ***жирный курсив***, `код`, > цитата
- НЕ используй HTML теги
- Верни ТОЛЬКО готовый текст поста — без объяснений и без обёртки в ```
- Русские кавычки «елочки», не ASCII
- Заголовок поста (первая строка) — ВСЕГДА целиком в **...**
- Обычные абзацы — без эмодзи и без жирного, просто текст
- Подзаголовки: эмодзи + **первые 3-7 слов жирным**, остальное обычным текстом
- Списки: эмодзи + **Название** - описание обычным текстом
- Эмодзи ТОЛЬКО на: заголовке, подзаголовках, элементах списков, CTA
- ***Жирный курсив*** — только для 1-3 ключевых эмоциональных фраз
- CTA: эмодзи + текст с ключевыми словами в ***жирном курсиве***
- Тире длинное (—) заменяй на короткое с пробелами ( - )
- НЕ меняй смысл и слова — только оформление"""


def format_post(raw_text: str) -> str:
    payload = json.dumps({
        "model": "glm-5",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"ОТФОРМАТИРУЙ ЭТОТ ТЕКСТ:\n\n{raw_text}"}
        ],
        "max_tokens": 6000
    }).encode()

    req = urllib.request.Request(
        BASE_URL,
        data=payload,
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        method="POST"
    )

    with urllib.request.urlopen(req, timeout=180) as resp:
        data = json.loads(resp.read())
        return data["choices"][0]["message"].get("content", "")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        raw = " ".join(sys.argv[1:])
    elif not sys.stdin.isatty():
        raw = sys.stdin.read()
    else:
        print("Использование: python3 format_post.py 'текст' или cat raw.txt | python3 format_post.py")
        sys.exit(1)

    result = format_post(raw)
    print(result)
