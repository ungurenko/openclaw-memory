# Advanced Slidev Features

## Table of Contents
1. Themes and Styling
2. Layouts
3. Animations and Transitions
4. Diagrams (Mermaid)
5. Interactive Elements
6. Custom Components
7. Speaker Notes
8. Export Options

---

## 1. Themes and Styling

### Available Themes

**Built-in themes:**
- `default` - Clean, professional
- `seriph` - Elegant serif font
- `apple-basic` - Apple-style minimalism
- `shibainu` - Playful and colorful

**Usage:**
```yaml
---
theme: default
---
```

### Custom Background

**Solid color:**
```yaml
---
background: '#1e293b'
---
```

**Gradient:**
```yaml
---
background: 'linear-gradient(to right, #667eea, #764ba2)'
---
```

**Image:**
```yaml
---
background: 'https://images.unsplash.com/photo-XXXX'
---
```

### Text Classes

```markdown
---
class: 'text-center text-white'
---
```

**Common classes:**
- `text-center` - Center text
- `text-left` - Left align
- `text-right` - Right align
- `text-white` - White text
- `text-sm` - Small text
- `text-lg` - Large text
- `text-2xl`, `text-3xl`, etc. - Extra large

---

## 2. Layouts

### Available Layouts

**`default`** - Standard layout with title and content
```markdown
---
layout: default
---

# Title
Content here
```

**`center`** - Centered content
```markdown
---
layout: center
---

# Centered Title
Centered content
```

**`two-cols`** - Two columns
```markdown
---
layout: two-cols
---

# Left Column

Content for left

::right::

# Right Column

Content for right
```

**`image-right`** - Image on the right
```markdown
---
layout: image-right
image: 'https://example.com/image.jpg'
---

# Content on Left

Image shows on right
```

**`statement`** - Big statement slide
```markdown
---
layout: statement
---

# Big Important Statement

Large, centered, impactful
```

**`quote`** - Quote slide
```markdown
---
layout: quote
---

"This is a quote"

— Author Name
```

**`end`** - Closing slide
```markdown
---
layout: end
---

# Thank You!

Contact info here
```

---

## 3. Animations and Transitions

### Progressive Disclosure

**Basic `<v-clicks>`:**
```markdown
<v-clicks>

- First item
- Second item
- Third item

</v-clicks>
```

**Inline clicks:**
```markdown
<v-click>

This appears first

</v-click>

<v-click>

This appears second

</v-click>
```

**Click-based styling:**
```markdown
<div v-click class="bg-blue-500 p-4 rounded">
This box appears on click
</div>
```

**Conditional content:**
```markdown
<div v-click="1">Appears first</div>
<div v-click="2">Appears second</div>
<div v-click="3">Appears third</div>
```

### Slide Transitions

**Set transition in frontmatter:**
```yaml
---
transition: slide-left
---
```

**Available transitions:**
- `slide-left`
- `slide-right`
- `slide-up`
- `slide-down`
- `fade`
- `zoom`
- `none`

**Per-slide transition:**
```markdown
---
transition: fade
---

# This slide fades in
```

---

## 4. Diagrams (Mermaid)

### Flowcharts

```markdown
```mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
```
\```
```

### Sequence Diagrams

```markdown
```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant Database
    
    Client->>Server: Request data
    Server->>Database: Query
    Database->>Server: Result
    Server->>Client: Response
```
\```
```

### Pie Charts

```markdown
```mermaid
pie
    title Market Share
    "Product A" : 45
    "Product B" : 30
    "Product C" : 25
```
\```
```

### Gantt Charts

```markdown
```mermaid
gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    
    section Phase 1
    Planning    :a1, 2024-01-01, 30d
    Design      :a2, after a1, 20d
    
    section Phase 2
    Development :a3, after a2, 45d
    Testing     :a4, after a3, 15d
```
\```
```

---

## 5. Interactive Elements

### Buttons and Links

```markdown
<div class="pt-12">
  <span @click="$slidev.nav.next" 
        class="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer">
    Next Slide →
  </span>
</div>
```

### Grid Layouts

```markdown
<div class="grid grid-cols-3 gap-4">
  <div class="p-4 bg-blue-100 rounded">Box 1</div>
  <div class="p-4 bg-green-100 rounded">Box 2</div>
  <div class="p-4 bg-red-100 rounded">Box 3</div>
</div>
```

### Cards

```markdown
<div class="p-6 bg-white shadow-lg rounded-lg">
  <h3 class="text-xl font-bold mb-2">Card Title</h3>
  <p>Card content goes here</p>
</div>
```

---

## 6. Custom Components

### Icons (Carbon Icons)

```markdown
<carbon:arrow-right class="inline"/>
<carbon:checkmark class="text-green-600"/>
<carbon:warning class="text-yellow-600"/>
```

### Badges

```markdown
<span class="px-2 py-1 bg-blue-600 text-white text-sm rounded">
  New
</span>
```

### Highlighting

```markdown
This is <mark>highlighted text</mark>

<div class="bg-yellow-200 p-2 inline-block">
  Important note
</div>
```

---

## 7. Speaker Notes

Add notes visible only in presenter mode:

```markdown
---

# Slide Title

Slide content here

<!--
These are speaker notes.
Only visible in presenter mode.
Remind yourself to:
- Mention the key point
- Tell the story about X
- Demo the feature
-->
```

**Access presenter mode:**
- Start dev server: `npm run dev`
- Open browser to localhost
- Press `P` key for presenter view

---

## 8. Export Options

### PDF Export

**Basic:**
```bash
npx slidev export presentation.md --output output.pdf
```

**With timeout (recommended):**
```bash
npx slidev export presentation.md --output output.pdf --timeout 180000
```

**Dark mode:**
```bash
npx slidev export presentation.md --dark --output output.pdf
```

### HTML Export

**Build static site:**
```bash
npx slidev build presentation.md
```

Output: `dist/` folder with HTML/CSS/JS

**Deploy options:**
- Upload to GitHub Pages
- Deploy to Netlify/Vercel
- Host on any static server

### PNG Export

**Export all slides as images:**
```bash
npx slidev export presentation.md --format png --output slides/
```

Creates `slides/001.png`, `slides/002.png`, etc.

**Single slide:**
```bash
npx slidev export presentation.md --format png --range 1
```

---

## Advanced Styling with UnoCSS

Slidev uses UnoCSS for utility classes:

### Spacing
- `p-4` - Padding
- `m-8` - Margin
- `mt-4` - Margin top
- `px-2` - Padding left/right
- `py-6` - Padding top/bottom

### Colors
- `bg-blue-500` - Background color
- `text-red-600` - Text color
- `border-green-300` - Border color

### Flexbox
- `flex` - Enable flexbox
- `justify-center` - Center horizontally
- `items-center` - Center vertically
- `flex-col` - Column direction

### Grid
- `grid` - Enable grid
- `grid-cols-2` - 2 columns
- `grid-cols-3` - 3 columns
- `gap-4` - Gap between items

### Typography
- `font-bold` - Bold text
- `text-xl` - Extra large
- `text-center` - Center align
- `leading-relaxed` - Line height

### Effects
- `shadow-lg` - Large shadow
- `rounded` - Rounded corners
- `rounded-lg` - Large rounded corners
- `opacity-50` - 50% opacity

### Responsive Design
- `sm:` - Small screens
- `md:` - Medium screens
- `lg:` - Large screens

Example:
```markdown
<div class="p-4 md:p-8 lg:p-12 bg-blue-100 rounded-lg shadow">
  Responsive padding
</div>
```

---

## Best Practices

### Performance
- Optimize images (compress, use appropriate sizes)
- Limit animations on slides with heavy content
- Test export early to catch issues

### Accessibility
- Use sufficient color contrast
- Include alt text for images
- Don't rely solely on color to convey meaning
- Keep text readable (minimum 18pt font)

### Content
- One main idea per slide
- Use visuals to support text
- Keep bullet points concise
- Test readability from a distance

### Technical
- Always specify language for code blocks
- Use `--timeout` flag for large presentations
- Test presenter notes before presenting
- Keep Markdown syntax clean and consistent
