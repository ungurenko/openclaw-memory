---
name: slidev-presentation
description: Create professional presentations using Slidev (Markdown-based presentation tool). Use when the user asks to create a presentation, slides, pitch deck, or any slide-based content. Supports code highlighting, animations, diagrams (Mermaid), themes, and exports to PDF/HTML. Ideal for technical presentations, course materials, demos, and pitch decks.
---

# Slidev Presentation Creator

Create professional, modern presentations from Markdown using Slidev.

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
- **Special requirements** - Code examples? Diagrams? Specific style?
- **Format needed** - PDF (default), HTML, or both?

### 2. Create Presentation File

Create a new `.md` file in `/root/.openclaw/workspace/slidev-presentations/` with a descriptive name (e.g., `vaib-coding-intro.md`, `pitch-deck-2026.md`).

**File structure:**
```markdown
---
theme: default
background: https://images.unsplash.com/photo-XXXX (optional)
class: text-center
highlighter: shiki
title: Your Presentation Title
---

# Title Slide

Subtitle or tagline

---

# Slide 2

Content here...

---

# Slide 3

More content...
```

See `references/examples.md` for complete examples and `references/features.md` for advanced features.

### 3. Export to PDF

Run the export command:

```bash
cd /root/.openclaw/workspace/slidev-presentations && \
npx slidev export <filename>.md --output <output-name>.pdf --timeout 180000
```

**Important:** Use `--timeout 180000` to avoid timeout errors on large presentations.

### 4. Copy to Media and Send

```bash
cp /root/.openclaw/workspace/slidev-presentations/<output-name>.pdf /root/.openclaw/media/
```

Then use the `message` tool to send the file to the user.

## Content Guidelines

### Slide Structure

- **Title slide** - Main title + subtitle
- **Content slides** - 1 main idea per slide
- **Visual hierarchy** - Use headings, bullets, emphasis
- **Code examples** - Use code blocks with language highlighting
- **Conclusion** - Summary or CTA slide

### Markdown Features

**Text formatting:**
```markdown
**Bold text**
*Italic text*
`Inline code`
```

**Lists:**
```markdown
- Bullet point
- Another point
  - Nested point

1. Numbered item
2. Another item
```

**Code blocks:**
````markdown
```python
def hello():
    print("Hello, World!")
```
````

**Images:**
```markdown
![Alt text](https://example.com/image.jpg)
```

**Links:**
```markdown
[Link text](https://example.com)
```

### Animations

Use `<v-clicks>` for progressive disclosure:

```markdown
<v-clicks>

- First item appears
- Then second
- Then third

</v-clicks>
```

### Layouts

Common layouts:
- `default` - Standard slide
- `center` - Centered content
- `two-cols` - Two columns
- `statement` - Big statement slide
- `end` - Closing slide

Example:
```markdown
---
layout: center
---

# Centered Content
```

## Troubleshooting

**Export fails:**
- Increase timeout: `--timeout 300000`
- Check for syntax errors in Markdown
- Ensure all image URLs are accessible

**Slides look broken:**
- Validate YAML frontmatter syntax
- Check for unclosed code blocks
- Ensure proper spacing around `---` slide separators

## References

- **examples.md** - Complete presentation examples
- **features.md** - Advanced features (diagrams, themes, custom layouts)

## Best Practices

1. **One idea per slide** - Don't overload with information
2. **Visual hierarchy** - Use headings, bullets, spacing
3. **Code highlighting** - Always specify language for code blocks
4. **Progressive disclosure** - Use `<v-clicks>` for bullet points
5. **Consistent style** - Use the same layout patterns throughout
6. **Test export early** - Export a draft to catch issues early

## Export Options

**PDF (default):**
```bash
npx slidev export presentation.md --output presentation.pdf
```

**HTML (interactive):**
```bash
npx slidev build presentation.md
# Output: dist/ folder with HTML files
```

**PNG (individual slides):**
```bash
npx slidev export presentation.md --format png
```

## When to Use This Skill

Use this skill when the user asks for:
- "Create a presentation about X"
- "Make slides for Y"
- "Build a pitch deck"
- "Presentation on Z topic"
- "Slides for my course/talk/demo"
- Any request involving slides, decks, or presentations
