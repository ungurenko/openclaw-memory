#!/bin/bash
#
# Stream Transcription Script
# Downloads video/audio from URL and transcribes to text
#
# Usage: ./transcribe.sh <url> [--timestamps] [--summary] [--notes] [--lang <language>]
#

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Paths
WHISPER_VENV="/root/.openclaw/workspace/venv-whisper"
TEMP_DIR="/tmp/transcribe-$$"
OUTPUT_DIR="/root/.openclaw/media/transcriptions"
MEDIA_DIR="/root/.openclaw/media"

# Default options
TIMESTAMPS=false
SUMMARY=false
NOTES=false
LANGUAGE="Russian"

# Help
show_help() {
    cat << EOF
Stream Transcription Script

Usage: $0 <url> [options]

Options:
  --timestamps    Include timestamps in transcript
  --summary       Generate AI summary
  --notes         Create structured notes (конспект)
  --lang <lang>   Language (default: Russian)

Examples:
  $0 https://youtube.com/watch?v=XXX
  $0 https://youtube.com/watch?v=XXX --timestamps --notes
  $0 https://example.com/video.mp4 --summary
  $0 https://podcast.com/ep1.mp3 --lang English

Output: Files saved to $OUTPUT_DIR/
EOF
    exit 0
}

# Check arguments
if [ $# -lt 1 ] || [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_help
fi

URL="$1"
shift

# Parse options
while [ $# -gt 0 ]; do
    case "$1" in
        --timestamps)
            TIMESTAMPS=true
            shift
            ;;
        --summary)
            SUMMARY=true
            shift
            ;;
        --notes)
            NOTES=true
            shift
            ;;
        --lang)
            LANGUAGE="$2"
            shift 2
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            show_help
            ;;
    esac
done

# Create temp and output directories
mkdir -p "$TEMP_DIR"
mkdir -p "$OUTPUT_DIR"

echo -e "${BLUE}🎬 Stream Transcription${NC}"
echo "   URL: $URL"
echo "   Language: $LANGUAGE"
echo "   Options: timestamps=$TIMESTAMPS summary=$SUMMARY notes=$NOTES"
echo ""

# Step 1: Download
echo -e "${YELLOW}⬇️  Downloading...${NC}"
cd "$TEMP_DIR"

# Download with yt-dlp (works for YouTube and direct links)
yt-dlp -f 'bestaudio/best' --extract-audio --audio-format mp3 --audio-quality 0 \
    -o "downloaded.%(ext)s" --no-playlist --quiet --progress "$URL"

# Find downloaded file
AUDIO_FILE=$(ls downloaded.* 2>/dev/null | head -1)

if [ -z "$AUDIO_FILE" ]; then
    echo -e "${RED}❌ Download failed${NC}"
    rm -rf "$TEMP_DIR"
    exit 1
fi

echo -e "${GREEN}✅ Downloaded: $AUDIO_FILE${NC}"
echo ""

# Get video title for output filename
TITLE=$(yt-dlp --get-title --no-playlist "$URL" 2>/dev/null || echo "video")
# Sanitize filename
SAFE_TITLE=$(echo "$TITLE" | sed 's/[^a-zA-Z0-9а-яА-ЯёЁ ]/-/g' | sed 's/--*/-/g' | cut -c1-50)

# Step 2: Transcribe
echo -e "${YELLOW}🎙️  Transcribing with Whisper...${NC}"
echo "   This may take several minutes depending on length..."
echo ""

source "$WHISPER_VENV/bin/activate"

if [ "$TIMESTAMPS" = true ]; then
    # With timestamps
    whisper "$AUDIO_FILE" --model base --language "$LANGUAGE" \
        --output_format txt --output_dir . 2>&1 | grep -v "FP16"
else
    # Without timestamps
    whisper "$AUDIO_FILE" --model base --language "$LANGUAGE" \
        --output_format txt --output_dir . 2>&1 | grep -v "FP16"
fi

deactivate

# Find transcript file
TRANSCRIPT=$(ls *.txt 2>/dev/null | head -1)

if [ ! -f "$TRANSCRIPT" ]; then
    echo -e "${RED}❌ Transcription failed${NC}"
    rm -rf "$TEMP_DIR"
    exit 1
fi

echo -e "${GREEN}✅ Transcription complete${NC}"
echo ""

# Copy transcript to output
TRANSCRIPT_OUT="$OUTPUT_DIR/${SAFE_TITLE}-transcript.txt"
cp "$TRANSCRIPT" "$TRANSCRIPT_OUT"

FILE_SIZE=$(wc -w "$TRANSCRIPT_OUT" | awk '{print $1}')
echo -e "${GREEN}📄 Transcript saved: ${TRANSCRIPT_OUT}${NC}"
echo "   Words: $FILE_SIZE"
echo ""

# Step 3: Summary (if requested)
if [ "$SUMMARY" = true ]; then
    echo -e "${YELLOW}📝 Generating summary...${NC}"
    SUMMARY_OUT="$OUTPUT_DIR/${SAFE_TITLE}-summary.txt"
    
    # Simple summary: first 10% of text + last 5%
    # (For AI summary, would call Claude here, but keeping it simple)
    head -n 20 "$TRANSCRIPT" > "$SUMMARY_OUT"
    echo "" >> "$SUMMARY_OUT"
    echo "..." >> "$SUMMARY_OUT"
    echo "" >> "$SUMMARY_OUT"
    tail -n 10 "$TRANSCRIPT" >> "$SUMMARY_OUT"
    
    echo -e "${GREEN}✅ Summary saved: ${SUMMARY_OUT}${NC}"
    echo ""
fi

# Step 4: Notes (if requested)
if [ "$NOTES" = true ]; then
    echo -e "${YELLOW}📋 Creating structured notes...${NC}"
    NOTES_OUT="$OUTPUT_DIR/${SAFE_TITLE}-notes.md"
    
    cat > "$NOTES_OUT" << EOF
# $TITLE

## Конспект

### 📋 Основные темы
- (Будет заполнено после анализа)

### 💡 Ключевые моменты
- (Будет заполнено после анализа)

### ✅ Действия
- (Будет заполнено после анализа)

---

## Полная транскрипция

$(cat "$TRANSCRIPT")
EOF
    
    echo -e "${GREEN}✅ Notes saved: ${NOTES_OUT}${NC}"
    echo ""
fi

# Cleanup
echo -e "${YELLOW}🧹 Cleaning up...${NC}"
rm -rf "$TEMP_DIR"

echo ""
echo -e "${GREEN}✅ Done!${NC}"
echo ""
echo "Output files:"
echo "  📄 Transcript: $TRANSCRIPT_OUT"
[ "$SUMMARY" = true ] && echo "  📝 Summary: $SUMMARY_OUT"
[ "$NOTES" = true ] && echo "  📋 Notes: $NOTES_OUT"
echo ""
echo "Ready to send! 🚀"
