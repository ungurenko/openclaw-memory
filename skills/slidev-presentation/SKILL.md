---
name: slidev-presentation
description: Create professional presentations using Slidev (Markdown-based presentation tool). Use when the user asks to create a presentation, slides, pitch deck, or any slide-based content. Supports code highlighting, animations, diagrams (Mermaid), themes, and exports to PDF/HTML. Ideal for technical presentations, course materials, demos, and pitch decks.
---

# Slidev Presentation Creator

Create professional, modern presentations from Markdown using Slidev.

> 📖 Official docs: https://sli.dev/guide/

## Installation Location

Slidev is installed at: `/root/.openclaw/workspace/slidev-presentations/`

All presentation files should be created in this directory.

## Quick Start

1. Create a new `.md` file in `/root/.openclaw/workspace/slidev-presentations/`
2. Write slides in Markdown format (see references/examples.md)
3. Export to PDF using the export command
4. Send the PDF to the user

## Workflow

### 1. Gather Requirements

Ask the user for:
- **Topic/theme** - What is the presentation about?
- **Number of slides** - How many slides? (default: 6-10)
- **Target audience** - Technical? Business? General?
- **Language** - Russian or English? (affects font choice!)
- **Style** - Light/dark? Accent color? Theme?
- **Format needed** - PDF (default), PPTX, PNG, or HTML?

### 2. Create Presentation File

Create a new `.md` file in `/root/.openclaw/workspace/slidev-presentations/` with a descriptive name.

**File structure:**
```markdown
---
theme: default
title: Your Presentation Title
highlighter: shiki
colorSchema: light
fonts:
  sans: 'Roboto'
  mono: 'Fira Code'
---

# Title Slide

Subtitle

---

# Slide 2

Content here...
```

See `references/examples.md` for complete examples and `references/features.md` for advanced features.

### 3. Export to PDF

Run the export command:

```bash
cd /root/.openclaw/workspace/slidev-presentations && \
npx slidev export <filename>.md --output <output-name>.pdf --timeout 180000
```

**Important:** Always use `--timeout 180000` to avoid timeout errors on large presentations.

### 4. Copy to Media and Send

```bash
cp /root/.openclaw/workspace/slidev-presentations/<output-name>.pdf /root/.openclaw/media/
```

Then use the `message` tool to send the file to the user.

---

## Themes

Use a theme by adding to the headmatter:
```yaml
---
theme: seriph
---
```

**Official themes (install automatically on first use):**
| Theme | Style |
|-------|-------|
| `default` | Clean, minimal, professional |
| `seriph` | Elegant serif font, dark |
| `apple-basic` | Apple-style minimalism |
| `shibainu` | Playful and colorful |
| `bricks` | Bold geometric |
| `neversink` | Modern dark |
| `penguin` | Academic, clean |

**Install theme manually:**
```bash
npm install @slidev/theme-seriph
```

**Custom styling without a theme** — use `<style>` blocks and UnoCSS utility classes directly (most flexible, recommended for branded presentations).

---

## Fonts — Russian / Cyrillic Support

Fonts are loaded automatically from Google Fonts. Configure in headmatter:

```yaml
---
fonts:
  sans: 'Roboto'          # main body text
  serif: 'PT Serif'       # serif variant
  mono: 'Fira Code'       # code blocks
---
```

**Best Google Fonts for Russian/Cyrillic:**
| Font | Style | Use for |
|------|-------|---------|
| `Roboto` | Modern sans-serif | Body, UI |
| `Inter` | Clean geometric | Tech, business |
| `Nunito` | Friendly rounded | Education, casual |
| `PT Sans` | Russian-optimized | Any |
| `PT Serif` | Russian-optimized serif | Classic, editorial |
| `Montserrat` | Bold headings | Impact titles |
| `Source Sans 3` | Neutral, readable | Long text |
| `Raleway` | Elegant, thin | Design-heavy |

**Custom font weights:**
```yaml
fonts:
  sans: 'Roboto'
  weights: '300,400,600,700,900'
  italic: true
```

---

## Layouts (built-in)

Set layout per slide in frontmatter:
```markdown
---
layout: center
---
```

| Layout | Description |
|--------|-------------|
| `default` | Standard slide with title + content |
| `cover` | Title/cover page |
| `center` | Everything centered on screen |
| `end` | Final slide |
| `fact` | Big number/fact prominently displayed |
| `full` | Uses all screen space, no padding |
| `image-left` | Image left, content right |
| `image-right` | Image right, content left |
| `image` | Full-screen image |
| `iframe-left` | Web page left, content right |
| `iframe-right` | Web page right, content left |
| `iframe` | Full-screen embedded web page |
| `intro` | Presentation introduction |
| `none` | No styling at all |
| `quote` | Prominent quotation |
| `section` | Section divider |
| `statement` | Big bold statement |
| `two-cols` | Two equal columns |
| `two-cols-header` | Header spanning both columns, then two cols |

**Two-cols example:**
```markdown
---
layout: two-cols
---

# Left Column
Left content

::right::

# Right Column
Right content
```

---

## Export Formats

### PDF (recommended)
```bash
npx slidev export file.md --output out.pdf --timeout 180000
```

### PPTX (PowerPoint)
```bash
npx slidev export file.md --format pptx --output out.pptx --timeout 180000
```
> Note: slides are exported as images in PPTX, text won't be selectable.

### PNG (individual slides)
```bash
npx slidev export file.md --format png --timeout 180000
```

### Dark mode export
```bash
npx slidev export file.md --dark --output out.pdf
```

### With click animations (multi-page)
```bash
npx slidev export file.md --with-clicks --output out.pdf
```

### Export specific slides
```bash
npx slidev export file.md --range 1,3-5,8 --output out.pdf
```

### Fixing timeout/render issues
```bash
# Increase wait time for slow slides
npx slidev export file.md --timeout 300000 --wait 3000

# If networkidle causes timeouts:
npx slidev export file.md --wait-until domcontentloaded --timeout 180000
```

---

## Content Guidelines

### Slide Structure

- **Title slide** - Main title + subtitle
- **Content slides** - 1 main idea per slide
- **Visual hierarchy** - Use headings, bullets, emphasis
- **Code examples** - Use code blocks with language highlighting
- **Conclusion** - Summary or CTA slide

### Styling Best Practices

- Use `<style>` block at the top for global CSS
- Use inline `style=` for one-off adjustments
- UnoCSS utility classes work everywhere (`flex`, `grid-cols-2`, `text-center`, etc.)
- For pixel-perfect control — write raw CSS in `<style>` block

### Russian Language Tips

1. Always use a **Cyrillic-compatible font** (Roboto, Inter, PT Sans, Nunito)
2. Set `weights: '400,600,700,900'` for headings to look bold
3. Avoid decorative/handwritten fonts — they often lack Cyrillic glyphs
4. Test export early to catch font loading issues

---

## Troubleshooting

**Export fails / blank PDF:**
- Increase timeout: `--timeout 300000`
- Add wait: `--wait 5000`
- Try `--wait-until domcontentloaded`

**Fonts not showing (Cyrillic broken):**
- Confirm font name is exactly as on Google Fonts
- Add `--wait 3000` to give fonts time to load
- Try fallback: `fonts: { sans: 'Roboto', provider: 'google' }`

**Slides look broken:**
- Validate YAML frontmatter syntax (no tabs, correct indentation)
- Check for unclosed `<div>` or `<style>` tags
- Ensure proper blank lines around `---` slide separators

---

## References

- **examples.md** - Complete presentation examples
- **features.md** - Advanced features: animations, diagrams, custom layouts, UnoCSS
- **assets/basic-template.md** - Starter template

## Official Resources

- Docs: https://sli.dev/guide/
- Layouts: https://sli.dev/builtin/layouts
- Themes: https://sli.dev/resources/theme-gallery
- Fonts: https://sli.dev/custom/config-fonts
- Export: https://sli.dev/guide/exporting
