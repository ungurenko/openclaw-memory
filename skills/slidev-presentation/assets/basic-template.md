---
theme: default
background: https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920
class: text-center
highlighter: shiki
lineNumbers: false
title: [PRESENTATION TITLE]
---

# [Main Title]

[Subtitle or tagline]

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Start <carbon:arrow-right class="inline"/>
  </span>
</div>

---
layout: default
---

# Agenda

<v-clicks>

- 📋 **Topic 1** - Brief description
- 🔧 **Topic 2** - Brief description
- 💡 **Topic 3** - Brief description
- 🚀 **Conclusion** - Summary and next steps

</v-clicks>

---

# Main Point 1

<v-clicks>

- First important point
- Second important point
- Third important point

</v-clicks>

<div v-click class="mt-8 p-4 bg-blue-500 bg-opacity-20 rounded">
💡 <b>Key Takeaway:</b> Your main insight here
</div>

---
layout: two-cols
---

# Two Column Layout

Left column content here

::right::

Right column content here

---

# Code Example

```python
# Example code block
def example_function():
    """Demonstrate code highlighting"""
    return "Hello, World!"

result = example_function()
print(result)
```

<v-click>

**Key points:**
- Point about the code
- Another observation

</v-click>

---

# Visual Content

<div class="grid grid-cols-2 gap-8">

<div>

### Category A
- Item 1
- Item 2
- Item 3

</div>

<div>

### Category B
- Item 1
- Item 2
- Item 3

</div>

</div>

---
layout: center
---

# Key Statistics

<div class="grid grid-cols-3 gap-8 mt-12">
  <div>
    <div class="text-5xl font-bold text-blue-600">XX%</div>
    <div class="text-xl mt-2">Metric 1</div>
  </div>
  <div>
    <div class="text-5xl font-bold text-green-600">XX</div>
    <div class="text-xl mt-2">Metric 2</div>
  </div>
  <div>
    <div class="text-5xl font-bold text-purple-600">XX+</div>
    <div class="text-xl mt-2">Metric 3</div>
  </div>
</div>

---
layout: statement
---

# Important Statement

Big, impactful message here

---
layout: center
class: text-center
---

# Summary

<v-clicks>

- ✅ Key point 1
- ✅ Key point 2
- ✅ Key point 3

</v-clicks>

<div v-click class="mt-12">

**Next Steps**

Clear call-to-action or next steps

</div>

---
layout: end
---

# Thank You!

**Contact:** your@email.com  
**Website:** yourwebsite.com

<div class="mt-8 text-sm opacity-70">
Questions? Let's connect!
</div>
