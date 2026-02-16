#!/bin/bash
#
# Playwright Screenshot Helper
# Usage: ./screenshot.sh <url> [options]
#

set -e

MEDIA_DIR="/root/.openclaw/media"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Help message
show_help() {
    cat << EOF
Playwright Screenshot Helper

Usage: $0 <url> [options]

Options:
  --full              Full-page screenshot
  --mobile            Mobile (iPhone 13) screenshot
  --tablet            Tablet (iPad Pro) screenshot
  --social            Social media preview (1200x630)
  --dark              Dark mode
  --wait <ms>         Wait timeout in milliseconds
  --output <name>     Custom output filename (without path)

Examples:
  $0 https://example.com
  $0 https://example.com --full
  $0 https://example.com --mobile
  $0 https://example.com --social --output preview.png
  $0 https://example.com --dark --wait 3000

Output: All screenshots are saved to $MEDIA_DIR/
EOF
    exit 0
}

# Check arguments
if [ $# -lt 1 ] || [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_help
fi

URL="$1"
shift

# Default options
FULL_PAGE=""
DEVICE=""
VIEWPORT=""
COLOR_SCHEME=""
WAIT=""
OUTPUT_NAME=""

# Parse options
while [ $# -gt 0 ]; do
    case "$1" in
        --full)
            FULL_PAGE="--full-page"
            shift
            ;;
        --mobile)
            DEVICE="--device \"iPhone 13\""
            shift
            ;;
        --tablet)
            DEVICE="--device \"iPad Pro\""
            shift
            ;;
        --social)
            VIEWPORT="--viewport-size 1200,630"
            shift
            ;;
        --dark)
            COLOR_SCHEME="--color-scheme dark"
            shift
            ;;
        --wait)
            WAIT="--wait-for-timeout $2"
            shift 2
            ;;
        --output)
            OUTPUT_NAME="$2"
            shift 2
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            show_help
            ;;
    esac
done

# Generate output filename if not provided
if [ -z "$OUTPUT_NAME" ]; then
    # Extract domain from URL
    DOMAIN=$(echo "$URL" | sed -E 's~https?://~~; s~/.*~~; s/www\.//; s/[^a-zA-Z0-9.-]/-/g')
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    OUTPUT_NAME="${DOMAIN}-${TIMESTAMP}.png"
fi

# Ensure .png extension
if [[ ! "$OUTPUT_NAME" =~ \.png$ ]]; then
    OUTPUT_NAME="${OUTPUT_NAME}.png"
fi

OUTPUT_PATH="$MEDIA_DIR/$OUTPUT_NAME"

echo -e "${BLUE}📸 Capturing screenshot...${NC}"
echo "   URL: $URL"
echo "   Output: $OUTPUT_PATH"
[ -n "$FULL_PAGE" ] && echo "   Mode: Full-page"
[ -n "$DEVICE" ] && echo "   Device: $DEVICE"
[ -n "$VIEWPORT" ] && echo "   Viewport: $VIEWPORT"
[ -n "$COLOR_SCHEME" ] && echo "   Color: $COLOR_SCHEME"
[ -n "$WAIT" ] && echo "   Wait: $WAIT"
echo ""

# Build and run command
CMD="npx playwright screenshot $FULL_PAGE $DEVICE $VIEWPORT $COLOR_SCHEME $WAIT \"$URL\" \"$OUTPUT_PATH\""

eval $CMD

# Check if file was created
if [ -f "$OUTPUT_PATH" ]; then
    FILE_SIZE=$(ls -lh "$OUTPUT_PATH" | awk '{print $5}')
    echo ""
    echo -e "${GREEN}✅ Screenshot saved!${NC}"
    echo "   Location: $OUTPUT_PATH"
    echo "   Size: $FILE_SIZE"
    echo ""
    echo "Ready to send! 🚀"
else
    echo -e "${RED}❌ Error: Screenshot not created${NC}"
    exit 1
fi
