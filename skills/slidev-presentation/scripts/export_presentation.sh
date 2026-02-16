#!/bin/bash
#
# Export Slidev presentation to PDF
# Usage: ./export_presentation.sh <markdown-file> [output-name]
#

set -e

SLIDEV_DIR="/root/.openclaw/workspace/slidev-presentations"
MEDIA_DIR="/root/.openclaw/media"

# Check arguments
if [ $# -lt 1 ]; then
    echo "Usage: $0 <markdown-file> [output-name]"
    echo "Example: $0 my-presentation.md"
    echo "Example: $0 my-presentation.md custom-output"
    exit 1
fi

INPUT_FILE="$1"
BASENAME=$(basename "$INPUT_FILE" .md)

# Use custom output name if provided, otherwise use input basename
if [ $# -ge 2 ]; then
    OUTPUT_NAME="$2"
else
    OUTPUT_NAME="$BASENAME"
fi

OUTPUT_PDF="${OUTPUT_NAME}.pdf"

# Check if input file exists
if [ ! -f "$SLIDEV_DIR/$INPUT_FILE" ]; then
    echo "Error: File not found: $SLIDEV_DIR/$INPUT_FILE"
    exit 1
fi

echo "📊 Exporting presentation..."
echo "   Input: $INPUT_FILE"
echo "   Output: $OUTPUT_PDF"
echo ""

# Navigate to slidev directory
cd "$SLIDEV_DIR"

# Export to PDF with timeout
echo "🔄 Running Slidev export..."
npx slidev export "$INPUT_FILE" --output "$OUTPUT_PDF" --timeout 180000

# Check if export succeeded
if [ ! -f "$SLIDEV_DIR/$OUTPUT_PDF" ]; then
    echo "❌ Export failed: PDF not created"
    exit 1
fi

# Copy to media directory
echo "📁 Copying to media directory..."
cp "$SLIDEV_DIR/$OUTPUT_PDF" "$MEDIA_DIR/"

# Get file size
FILE_SIZE=$(ls -lh "$MEDIA_DIR/$OUTPUT_PDF" | awk '{print $5}')

echo ""
echo "✅ Export complete!"
echo "   Location: $MEDIA_DIR/$OUTPUT_PDF"
echo "   Size: $FILE_SIZE"
echo ""
echo "Ready to send to user! 🚀"
