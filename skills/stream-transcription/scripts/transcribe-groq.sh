#!/bin/bash
#
# Stream Transcription Script (Groq Whisper API)
# Fast cloud-based transcription
#
# Usage: ./transcribe-groq.sh <url> [--timestamps] [--lang <language>]
#

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Paths
TEMP_DIR="/tmp/transcribe-groq-$$"
OUTPUT_DIR="/root/.openclaw/media/transcriptions"
MEDIA_DIR="/root/.openclaw/media"
GROQ_API_KEY=$(cat ~/.config/groq/api_key)

# Default options
TIMESTAMPS=false
LANGUAGE="ru"

# Help
show_help() {
    cat << EOF
Stream Transcription Script (Groq Whisper API)

Usage: $0 <url> [options]

Options:
  --timestamps    Include timestamps in transcript
  --lang <lang>   Language code (default: ru for Russian)

Examples:
  $0 https://youtube.com/watch?v=XXX
  $0 https://youtube.com/watch?v=XXX --timestamps
  $0 https://example.com/video.mp4 --lang en

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

echo -e "${BLUE}🎬 Stream Transcription (Groq Whisper)${NC}"
echo "   URL: $URL"
echo "   Language: $LANGUAGE"
echo ""

# Step 1: Download
echo -e "${YELLOW}⬇️  Downloading...${NC}"
cd "$TEMP_DIR"

# Download with yt-dlp
yt-dlp -f 'bestaudio/best' --extract-audio --audio-format mp3 --audio-quality 0 \
    -o "downloaded.%(ext)s" --no-playlist --quiet --progress "$URL" 2>&1 | grep -v "WARNING"

# Find downloaded file
AUDIO_FILE=$(ls downloaded.* 2>/dev/null | head -1)

if [ -z "$AUDIO_FILE" ]; then
    echo -e "${RED}❌ Download failed${NC}"
    rm -rf "$TEMP_DIR"
    exit 1
fi

echo -e "${GREEN}✅ Downloaded: $AUDIO_FILE${NC}"
FILE_SIZE=$(ls -lh "$AUDIO_FILE" | awk '{print $5}')
echo "   Size: $FILE_SIZE"
echo ""

# Get video title for output filename
TITLE=$(yt-dlp --get-title --no-playlist "$URL" 2>/dev/null || echo "video")
# Sanitize filename (simple approach - just use timestamp)
SAFE_TITLE="transcript-$(date +%Y%m%d-%H%M%S)"

# Step 2: Transcribe with Groq
echo -e "${YELLOW}🎙️  Transcribing with Groq Whisper API...${NC}"
echo "   Model: whisper-large-v3-turbo"
echo "   This will be fast! ⚡"
echo ""

# Prepare request
RESPONSE_FORMAT="json"
if [ "$TIMESTAMPS" = true ]; then
    RESPONSE_FORMAT="verbose_json"
fi

# Call Groq API
RESPONSE=$(curl -s -X POST "https://api.groq.com/openai/v1/audio/transcriptions" \
    -H "Authorization: Bearer $GROQ_API_KEY" \
    -F "file=@$AUDIO_FILE" \
    -F "model=whisper-large-v3-turbo" \
    -F "language=$LANGUAGE" \
    -F "response_format=$RESPONSE_FORMAT" \
    -F "temperature=0")

# Check for errors
if echo "$RESPONSE" | grep -q "error"; then
    echo -e "${RED}❌ Groq API error:${NC}"
    echo "$RESPONSE" | jq -r '.error.message' 2>/dev/null || echo "$RESPONSE"
    rm -rf "$TEMP_DIR"
    exit 1
fi

echo -e "${GREEN}✅ Transcription complete${NC}"
echo ""

# Save transcript
TRANSCRIPT_OUT="$OUTPUT_DIR/${SAFE_TITLE}-transcript.txt"

if [ "$TIMESTAMPS" = true ]; then
    # Parse timestamps from verbose_json
    echo "$RESPONSE" | jq -r '.segments[] | "[" + (.start | tostring) + "s - " + (.end | tostring) + "s] " + .text' > "$TRANSCRIPT_OUT"
else
    # Just text
    echo "$RESPONSE" | jq -r '.text' > "$TRANSCRIPT_OUT"
fi

# Check if file was created
if [ ! -f "$TRANSCRIPT_OUT" ]; then
    echo -e "${RED}❌ Failed to save transcript${NC}"
    rm -rf "$TEMP_DIR"
    exit 1
fi

FILE_SIZE=$(wc -w "$TRANSCRIPT_OUT" | awk '{print $1}')
echo -e "${GREEN}📄 Transcript saved: ${TRANSCRIPT_OUT}${NC}"
echo "   Words: $FILE_SIZE"
echo ""

# Cleanup
echo -e "${YELLOW}🧹 Cleaning up...${NC}"
rm -rf "$TEMP_DIR"

echo ""
echo -e "${GREEN}✅ Done!${NC}"
echo ""
echo "Output file:"
echo "  📄 Transcript: $TRANSCRIPT_OUT"
echo ""
echo "Ready to send! 🚀"
