#!/bin/bash
# Транскрипция аудио через Whisper

AUDIO_FILE="$1"
MODEL="${2:-base}"  # default: base model (faster, good enough)

if [ -z "$AUDIO_FILE" ]; then
    echo "Usage: $0 <audio-file> [model]"
    echo "Models: tiny, base, small, medium, large"
    exit 1
fi

if [ ! -f "$AUDIO_FILE" ]; then
    echo "Error: File not found: $AUDIO_FILE"
    exit 1
fi

# Активируем venv с whisper
VENV_PATH="/root/.openclaw/workspace/venv-whisper"
source "$VENV_PATH/bin/activate"

# Запускаем whisper
whisper "$AUDIO_FILE" --model "$MODEL" --language ru --output_format txt --output_dir /tmp

# Извлекаем имя файла без расширения
BASENAME=$(basename "$AUDIO_FILE" | sed 's/\.[^.]*$//')

# Выводим результат
if [ -f "/tmp/${BASENAME}.txt" ]; then
    cat "/tmp/${BASENAME}.txt"
    rm "/tmp/${BASENAME}.txt"
else
    echo "Error: Transcription failed"
    exit 1
fi
