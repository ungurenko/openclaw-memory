#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <audio-file> [language:auto]" >&2
  exit 1
fi

AUDIO_FILE="$1"
LANG="${2:-auto}"
MODEL="/opt/whisper.cpp/models/ggml-base.bin"

if [[ ! -f "$AUDIO_FILE" ]]; then
  echo "Audio file not found: $AUDIO_FILE" >&2
  exit 1
fi

if [[ ! -f "$MODEL" ]]; then
  echo "Whisper model not found: $MODEL" >&2
  exit 1
fi

TMP_WAV="$(mktemp --suffix=.wav)"
cleanup() { rm -f "$TMP_WAV"; }
trap cleanup EXIT

ffmpeg -y -i "$AUDIO_FILE" -ac 1 -ar 16000 "$TMP_WAV" >/dev/null 2>&1

whisper-cli -m "$MODEL" -l "$LANG" -nt "$TMP_WAV" 2>/dev/null \
  | sed '/^$/d' \
  | sed 's/^\[[^]]*\]  //'
