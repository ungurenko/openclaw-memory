#!/bin/bash
# Wrapper для транскрипции через Whisper
# OpenClaw передаёт путь к аудиофайлу как последний аргумент
# Скрипт выводит чистый текст в stdout

set -e

INPUT_FILE="$1"

if [ -z "$INPUT_FILE" ]; then
    echo "Error: no input file provided" >&2
    exit 1
fi

if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: file not found: $INPUT_FILE" >&2
    exit 1
fi

# Создаём временную директорию для вывода
TMPDIR=$(mktemp -d)
trap "rm -rf $TMPDIR" EXIT

# Запускаем whisper
/root/.openclaw/workspace/venv-whisper/bin/whisper \
    "$INPUT_FILE" \
    --model base \
    --language ru \
    --output_format txt \
    --output_dir "$TMPDIR" \
    --fp16 False \
    2>/dev/null

# Находим и выводим текстовый файл
TXT_FILE=$(find "$TMPDIR" -name "*.txt" | head -1)

if [ -n "$TXT_FILE" ] && [ -f "$TXT_FILE" ]; then
    cat "$TXT_FILE"
else
    echo "Error: transcription output not found" >&2
    exit 1
fi
