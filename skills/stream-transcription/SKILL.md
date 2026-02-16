---
name: stream-transcription
description: Download and transcribe video/audio from URLs (YouTube, direct links) into text and structured summaries. Use when the user asks to transcribe a stream, эфир, video, podcast, or convert speech to text from a URL. Creates full transcripts with timestamps and optional summaries/notes.
---

# Stream Transcription

Download and transcribe video/audio content from URLs into text, summaries, and structured notes.

## Installation

Required tools (already installed):
- **yt-dlp** — Download from YouTube and other platforms
- **ffmpeg** — Extract audio from video
- **Whisper** — Speech-to-text transcription (local, no API)

Location: `/root/.openclaw/workspace/venv-whisper/`

## Quick Start

**Recommended (Fast - Groq API):**

```bash
/root/.openclaw/workspace/skills/stream-transcription/scripts/transcribe-groq.sh <url> [options]
```

**Alternative (Slow - Local Whisper):**

```bash
/root/.openclaw/workspace/skills/stream-transcription/scripts/transcribe.sh <url> [options]
```

**Note:** Always prefer `transcribe-groq.sh` - it's 10x faster and more reliable.

## Important: File Size Limits

Groq API has a **25 MB file size limit**. For long videos:

1. Download audio
2. Compress to 16kHz mono: `ffmpeg -i input.mp3 -ar 16000 -ac 1 -b:a 32k output.mp3`
3. If still > 25 MB, split into parts: `ffmpeg -i input.mp3 -f segment -segment_time 1800 -c copy part_%03d.mp3`
4. Transcribe each part separately
5. Combine results

This is handled automatically by the script.

## Workflow

### 1. Get URL from user

Ask for:
- **URL** — Direct video/audio link or YouTube URL
- **Output format** — Full transcript, summary, notes?
- **Language** — Russian (default), English, etc.

### 2. Run transcription script

```bash
scripts/transcribe.sh <url> [--summary] [--notes] [--timestamps]
```

The script will:
1. Download video/audio (yt-dlp)
2. Extract audio if needed (ffmpeg)
3. Transcribe to text (Whisper)
4. Generate summary if requested
5. Save to `/root/.openclaw/media/`

### 3. Send results to user

The script outputs:
- `transcript.txt` — Full transcription
- `summary.txt` — Summary (if --summary)
- `notes.md` — Structured notes (if --notes)

## Options

### Basic Transcription

```bash
scripts/transcribe.sh https://example.com/video.mp4
```

Output: `transcript.txt` with full text

### With Timestamps

```bash
scripts/transcribe.sh https://example.com/video.mp4 --timestamps
```

Output: Transcript with [MM:SS] timestamps

### With Summary

```bash
scripts/transcribe.sh https://example.com/video.mp4 --summary
```

Output: `transcript.txt` + `summary.txt` (AI-generated summary)

### Structured Notes

```bash
scripts/transcribe.sh https://example.com/video.mp4 --notes
```

Output: `notes.md` with:
- Key points
- Main topics
- Action items
- Quotes

### All Options

```bash
scripts/transcribe.sh https://example.com/video.mp4 --timestamps --summary --notes
```

## Supported Sources

### YouTube
```bash
scripts/transcribe.sh https://youtube.com/watch?v=VIDEO_ID
scripts/transcribe.sh https://youtu.be/VIDEO_ID
```

### Direct Video Links
```bash
scripts/transcribe.sh https://example.com/video.mp4
scripts/transcribe.sh https://example.com/stream.webm
```

### Direct Audio Links
```bash
scripts/transcribe.sh https://example.com/podcast.mp3
scripts/transcribe.sh https://example.com/audio.ogg
```

## Output Location

All outputs are saved to `/root/.openclaw/media/transcriptions/`

Files are named based on video title or timestamp:
- `эфир-название-transcript.txt`
- `эфир-название-summary.txt`
- `эфир-название-notes.md`

## Languages

Whisper supports multiple languages. Default: Russian

Change language:
```bash
scripts/transcribe.sh <url> --lang English
```

Supported: Russian, English, Spanish, French, German, Chinese, Japanese, etc.

## Creating Конспект (Summary Notes)

For educational streams (эфиры), use `--notes` option:

```bash
scripts/transcribe.sh <url> --notes
```

This creates a structured конспект with:
- 📋 **Main Topics** — Key subjects covered
- 💡 **Key Points** — Important takeaways
- ✅ **Action Items** — Things to do
- 💬 **Quotes** — Notable statements
- 🔗 **References** — Mentioned resources

Perfect for students!

## Typical Workflow for ВАЙБС эфир

1. User: "Транскрибируй эфир https://youtube.com/watch?v=XXX"

2. Run script:
```bash
scripts/transcribe.sh https://youtube.com/watch?v=XXX --timestamps --notes
```

3. Wait for processing (shows progress)

4. Send results:
   - Full transcript (with timestamps)
   - Structured notes (конспект for students)

5. Optional: Create presentation from notes using slidev-presentation skill

## Processing Time

Depends on video length:
- 1-hour video: ~5-10 minutes on this server
- 2-hour эфир: ~10-20 minutes

Whisper base model is used (balance of speed/quality)

## Quality

Whisper base model provides good quality for:
- Clear speech (эфиры, podcasts)
- Russian and English
- Standard recording conditions

For better quality (slower), can upgrade to Whisper medium or large.

## Troubleshooting

**Download fails:**
- Check URL is accessible
- Some platforms block yt-dlp (rare)
- Try direct video link instead

**Transcription empty/bad:**
- Check audio quality in downloaded file
- Ensure language is correct (`--lang Russian`)
- Very noisy audio may need cleanup first

**Out of disk space:**
- Large videos take space temporarily
- Script cleans up after completion
- Check `/tmp/` if issues persist

## Best Practices

1. **YouTube links:** Always work best with yt-dlp
2. **Long videos:** Be patient, processing takes time
3. **Multiple эфиры:** Process one at a time
4. **Storage:** Transcripts are small, originals deleted after
5. **Review output:** Always check transcript quality before sharing

## When to Use This Skill

Use when the user asks to:
- "Транскрибируй эфир [URL]"
- "Сделай текст из видео"
- "Конспект этого эфира"
- "Transcribe this podcast"
- "Convert video to text"
- "Сделай summary из [video]"
- Any request to extract text/speech from video/audio URL

## See Also

- `references/examples.md` — Complete examples
- `scripts/transcribe.sh` — Main processing script
