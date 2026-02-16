---
name: playwright-screenshots
description: Capture screenshots and automate web pages using Playwright. Use when the user asks to take a screenshot of a website, capture a webpage, get a preview of a URL, or automate browser actions. Supports full-page screenshots, mobile device emulation, custom viewport sizes, and waiting for specific elements.
---

# Playwright Screenshots & Web Automation

Capture screenshots and automate web pages using Playwright CLI.

## Installation

Playwright is installed globally and ready to use:
- **Chromium browser:** Installed at `/root/.cache/ms-playwright/chromium-1208`
- **CLI:** Available via `npx playwright`

## Quick Start

### Basic Screenshot

```bash
npx playwright screenshot <url> <output-file>
```

Example:
```bash
npx playwright screenshot https://example.com /root/.openclaw/media/screenshot.png
```

### Full-Page Screenshot

Capture the entire scrollable page:

```bash
npx playwright screenshot --full-page <url> <output-file>
```

Example:
```bash
npx playwright screenshot --full-page https://docs.openclaw.ai /root/.openclaw/media/docs-full.png
```

## Common Use Cases

### 1. Website Preview for Posts

```bash
npx playwright screenshot --viewport-size 1200,630 https://example.com /root/.openclaw/media/preview.png
```

Best for: Telegram/social media posts (1200x630 is optimal for previews)

### 2. Mobile Screenshot

```bash
npx playwright screenshot --device "iPhone 13" https://example.com /root/.openclaw/media/mobile.png
```

Available devices: iPhone 13, iPad Pro, Pixel 5, Galaxy S9+, and more

### 3. Full-Page Capture

```bash
npx playwright screenshot --full-page https://longpage.com /root/.openclaw/media/full.png
```

Best for: Capturing entire articles, documentation pages, or long content

### 4. Wait for Element

```bash
npx playwright screenshot --wait-for-selector ".main-content" https://example.com /root/.openclaw/media/loaded.png
```

Best for: Dynamic sites that load content asynchronously

### 5. Dark Mode Screenshot

```bash
npx playwright screenshot --color-scheme dark https://example.com /root/.openclaw/media/dark.png
```

## Workflow

1. **Identify URL** - What website to capture?
2. **Choose options** - Full-page? Mobile? Specific viewport?
3. **Run command** - Execute with appropriate flags
4. **Save to media** - Always save to `/root/.openclaw/media/` for easy access
5. **Send to user** - Use `message` tool with filePath

## Important Options

### Viewport Size
```bash
--viewport-size <width>,<height>
```

Common sizes:
- `1920,1080` - Full HD desktop
- `1200,630` - Social media preview
- `800,600` - Standard tablet
- `375,667` - Mobile (iPhone SE)

### Devices
```bash
--device "<device-name>"
```

Popular devices:
- `iPhone 13`
- `iPhone 13 Pro Max`
- `iPad Pro`
- `Pixel 5`
- `Galaxy S9+`
- `Desktop Chrome`

### Full-Page
```bash
--full-page
```

Captures entire scrollable area (warning: can be very tall for long pages)

### Wait Options
```bash
--wait-for-selector <selector>    # Wait for CSS selector
--wait-for-timeout <ms>           # Wait specific time
```

Examples:
```bash
--wait-for-selector "img"         # Wait for images to load
--wait-for-timeout 3000           # Wait 3 seconds
```

### Color Scheme
```bash
--color-scheme <light|dark>
```

Emulates user's preferred color scheme

### Timeout
```bash
--timeout <ms>
```

Default is 30 seconds. Increase for slow-loading sites:
```bash
--timeout 60000  # 60 seconds
```

## Advanced Usage

### Custom User Agent
```bash
npx playwright screenshot --user-agent "Custom Bot 1.0" https://example.com output.png
```

### Ignore HTTPS Errors
```bash
npx playwright screenshot --ignore-https-errors https://self-signed-cert.com output.png
```

### Proxy
```bash
npx playwright screenshot --proxy-server http://proxy:3128 https://example.com output.png
```

## Output Location

Always save screenshots to `/root/.openclaw/media/` for easy access and sending:

```bash
/root/.openclaw/media/<descriptive-name>.png
```

Examples:
- `/root/.openclaw/media/homepage-screenshot.png`
- `/root/.openclaw/media/mobile-preview.png`
- `/root/.openclaw/media/docs-fullpage.png`

## Sending Screenshots

After capturing, use the `message` tool:

```javascript
message({
  action: "send",
  channel: "telegram",
  target: "user_id",
  filePath: "/root/.openclaw/media/screenshot.png",
  caption: "Screenshot of example.com"
})
```

## Troubleshooting

**Timeout errors:**
- Increase timeout: `--timeout 60000`
- Wait for specific element: `--wait-for-selector "main"`

**Blank/white screenshot:**
- Add wait timeout: `--wait-for-timeout 3000`
- Wait for images: `--wait-for-selector "img"`

**Site blocks automation:**
- Try different user agent: `--user-agent "Mozilla/5.0..."`
- Some sites detect and block automation

## Examples

See `references/examples.md` for complete examples and use cases.

## Best Practices

1. **Always use descriptive filenames** - Easier to find later
2. **Save to /root/.openclaw/media/** - Centralized location
3. **Use --full-page carefully** - Can create huge images
4. **Add wait-for-timeout for dynamic sites** - Ensure content loads
5. **Choose appropriate viewport** - Match target platform

## Limitations

- Cannot bypass CAPTCHAs or bot protection
- Some sites detect and block automation
- Very long pages may timeout or create huge files
- JavaScript-heavy sites may need longer wait times

## When to Use This Skill

Use this skill when the user asks to:
- "Take a screenshot of [URL]"
- "Show me what [website] looks like"
- "Capture [page]"
- "Get a preview of [site]"
- "Screenshot [URL] on mobile"
- "Full-page screenshot of [site]"
- Any request involving website screenshots or previews
