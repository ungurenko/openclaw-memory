# Playwright Screenshots - Examples

## Basic Examples

### 1. Simple Website Screenshot

```bash
npx playwright screenshot https://example.com /root/.openclaw/media/example.png
```

Output: Standard desktop screenshot (default viewport ~1280x720)

---

### 2. Full-Page Screenshot

```bash
npx playwright screenshot --full-page https://docs.openclaw.ai /root/.openclaw/media/docs-full.png
```

Captures the entire scrollable page, including content below the fold.

---

### 3. Mobile Screenshot (iPhone)

```bash
npx playwright screenshot --device "iPhone 13" https://example.com /root/.openclaw/media/iphone.png
```

Emulates iPhone 13 viewport and user agent.

---

### 4. Tablet Screenshot (iPad)

```bash
npx playwright screenshot --device "iPad Pro" https://example.com /root/.openclaw/media/ipad.png
```

---

### 5. Custom Viewport Size

```bash
npx playwright screenshot --viewport-size 1200,630 https://example.com /root/.openclaw/media/social-preview.png
```

Perfect for social media previews (1200x630 is optimal for Telegram/Twitter/Facebook)

---

## Advanced Examples

### 6. Dark Mode Screenshot

```bash
npx playwright screenshot --color-scheme dark https://example.com /root/.openclaw/media/dark.png
```

Forces dark mode (if the site supports `prefers-color-scheme: dark`)

---

### 7. Wait for Images to Load

```bash
npx playwright screenshot --wait-for-selector "img" https://example.com /root/.openclaw/media/with-images.png
```

Ensures all `<img>` tags are present before capturing (doesn't guarantee they're loaded)

---

### 8. Wait 3 Seconds Before Capture

```bash
npx playwright screenshot --wait-for-timeout 3000 https://example.com /root/.openclaw/media/delayed.png
```

Useful for sites with slow-loading dynamic content

---

### 9. Ignore HTTPS Errors

```bash
npx playwright screenshot --ignore-https-errors https://self-signed.badssl.com /root/.openclaw/media/insecure.png
```

For sites with invalid/self-signed certificates

---

### 10. Multiple Screenshots with Different Viewports

```bash
# Desktop
npx playwright screenshot --viewport-size 1920,1080 https://example.com /root/.openclaw/media/desktop.png

# Tablet
npx playwright screenshot --viewport-size 1024,768 https://example.com /root/.openclaw/media/tablet.png

# Mobile
npx playwright screenshot --viewport-size 375,667 https://example.com /root/.openclaw/media/mobile.png
```

---

## Real-World Use Cases

### Use Case 1: Social Media Preview

**Task:** Create a preview image for a Telegram post about a new website

```bash
npx playwright screenshot --viewport-size 1200,630 --wait-for-timeout 2000 https://newsite.com /root/.openclaw/media/newsite-preview.png
```

Then send via message tool:
```javascript
message({
  action: "send",
  filePath: "/root/.openclaw/media/newsite-preview.png",
  caption: "🌐 Проверьте новый сайт!"
})
```

---

### Use Case 2: Competitor Analysis

**Task:** Capture a competitor's homepage for analysis

```bash
npx playwright screenshot --full-page https://competitor.com /root/.openclaw/media/competitor-homepage.png
```

---

### Use Case 3: Mobile vs Desktop Comparison

**Task:** Show how a site looks on different devices

```bash
# Desktop
npx playwright screenshot --viewport-size 1920,1080 https://mysite.com /root/.openclaw/media/mysite-desktop.png

# Mobile
npx playwright screenshot --device "iPhone 13" https://mysite.com /root/.openclaw/media/mysite-mobile.png
```

Then send both images to compare

---

### Use Case 4: Documentation Screenshot

**Task:** Capture a specific section of documentation

```bash
npx playwright screenshot --wait-for-selector ".documentation" --full-page https://docs.example.com/api /root/.openclaw/media/api-docs.png
```

---

### Use Case 5: Landing Page Preview

**Task:** Get a quick preview of a landing page for design review

```bash
npx playwright screenshot --viewport-size 1440,900 --wait-for-timeout 3000 https://landingpage.com /root/.openclaw/media/landing.png
```

---

## Common Viewport Sizes

### Desktop
- **Full HD:** `1920,1080`
- **Standard:** `1440,900`
- **Laptop:** `1280,720`

### Tablet
- **iPad Pro:** `1024,1366`
- **iPad:** `768,1024`
- **Generic Tablet:** `800,1280`

### Mobile
- **iPhone 13:** `390,844`
- **iPhone SE:** `375,667`
- **Galaxy S9:** `360,740`
- **Pixel 5:** `393,851`

### Social Media
- **Twitter/Facebook card:** `1200,630`
- **Instagram post:** `1080,1080`
- **YouTube thumbnail:** `1280,720`

---

## Device Presets

Playwright includes many device presets. Use `--device "<name>"`:

**Popular iPhones:**
- `iPhone 13`
- `iPhone 13 Pro`
- `iPhone 13 Pro Max`
- `iPhone 12`
- `iPhone SE`

**iPads:**
- `iPad Pro`
- `iPad (gen 7)`
- `iPad Mini`

**Android:**
- `Pixel 5`
- `Pixel 4`
- `Galaxy S9+`
- `Galaxy Tab S4`

**Desktop:**
- `Desktop Chrome`
- `Desktop Firefox`
- `Desktop Safari`

---

## Troubleshooting Examples

### Problem: Screenshot is blank/white

**Solution:** Add wait timeout
```bash
npx playwright screenshot --wait-for-timeout 5000 https://dynamic-site.com /root/.openclaw/media/loaded.png
```

---

### Problem: Timeout error on slow site

**Solution:** Increase timeout
```bash
npx playwright screenshot --timeout 60000 https://slow-site.com /root/.openclaw/media/slow.png
```

---

### Problem: Need to capture after specific element loads

**Solution:** Wait for selector
```bash
npx playwright screenshot --wait-for-selector "#main-content" https://site.com /root/.openclaw/media/content.png
```

---

### Problem: Site detects automation and shows CAPTCHA

**Solution:** Try custom user agent (may or may not work)
```bash
npx playwright screenshot --user-agent "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" https://protected-site.com /root/.openclaw/media/custom-ua.png
```

**Note:** Many anti-bot systems can't be bypassed

---

## Workflow Example

**Task from user:** "Сделай скриншот главной страницы openclaw.ai для поста"

**Steps:**

1. Capture screenshot with social media dimensions:
```bash
npx playwright screenshot --viewport-size 1200,630 --wait-for-timeout 2000 https://openclaw.ai /root/.openclaw/media/openclaw-homepage.png
```

2. Verify file created:
```bash
ls -lh /root/.openclaw/media/openclaw-homepage.png
```

3. Send to user:
```javascript
message({
  action: "send",
  channel: "telegram",
  target: "user_id",
  filePath: "/root/.openclaw/media/openclaw-homepage.png",
  caption: "🦞 Скриншот главной страницы OpenClaw"
})
```

4. Respond: "✅ Скриншот готов и отправлен!"

---

## Tips & Best Practices

1. **For social posts:** Use `--viewport-size 1200,630`
2. **For mobile demos:** Use `--device "iPhone 13"`
3. **For long pages:** Use `--full-page` (but check file size)
4. **For dynamic sites:** Add `--wait-for-timeout 2000-3000`
5. **Always save to /root/.openclaw/media/** for easy access
6. **Use descriptive filenames:** `sitename-mobile.png`, `docs-fullpage.png`
7. **Check file size** before sending (very long full-page screenshots can be huge)

---

## Script Integration

For repeated tasks, you can create a helper script in `scripts/` directory. But for most use cases, the CLI is sufficient and more flexible.
