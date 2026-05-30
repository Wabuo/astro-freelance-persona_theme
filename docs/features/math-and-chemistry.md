# Math and Chemistry Reference Guide

This theme features a high-performance, server-side rendered **Single-Pass MathJax CHTML Pipeline** that compiles both inline and block equations statically at build time.

- **Fast, Lightweight CommonHTML** for all formulas (inline and display blocks) to ensure optimized page weight and minimal build overhead.
- **Zero-CLS Rendering** to prevent layout shifts as pages load.
- **No Client-side JS** is loaded for math rendering.

---

## 1. Enabling Math on a Page

To enable the MathJax pipeline on a blog post, set `tex: true` in your post's frontmatter:

```yaml
---
title: "Quantum Physics & Organic Chemistry"
date: 2026-05-30
tags: ["physics", "chemistry"]
tex: true # <--- MUST be true to load MathJax
---
```

---

## 2. Basic Syntax

The theme uses markdown directive syntax for inline math and standard fenced code blocks for equations.

### Inline Math
Write inline math using the `:math[...]` directive:
```markdown
The famous mass-energy equivalence is represented as :math[E = mc^2].
```
*Renders inline:* The famous mass-energy equivalence is represented as $E = mc^2$.

### Inline Chemistry
Write chemical formulas using the `:chem[...]` directive (powered by `mhchem`):
```markdown
Programmers run on a special chemical compound called caffeine: :chem[C8H10N4O2].
```
*Renders inline:* Programmers run on a special chemical compound called caffeine: $\ce{C8H10N4O2}$.

### Block Math
Write display equations using a ` ```math ` code fence:
```markdown
```math
\lim_{x \to \infty} \left( 1 + \frac{1}{x} \right)^x = e
```
```

### Block Chemistry
Write chemical equations using a ` ```chem ` code fence:
```markdown
```chem
CO2 + H2O <=> H2CO3
```
```

---

## 3. Bundled Extensions (First-Class Citizens)

To give you the most powerful technical portfolio out of the box, we bundle five major MathJax extensions. They are active by default:

### A. Chemistry (`mhchem`)
Provides the `\ce{...}` helper for typesetting chemical equations easily:
- Syntax: `:chem[H2O]` or `:chem[CO2 + H2O -> H2CO3]`
- Example reactant reaction:
  ```markdown
  ```chem
  2H2 + O2 -> 2H2O
  ```
  ```

### B. Physics (`physics`)
Simplifies complex mathematical physics formulas, including Dirac bra-ket notation, vectors, and differentials:
- Operators: `\bra{\psi}`, `\ket{\phi}`, `\braket{\psi | \phi}`, `\dd{x}`, `\pdv{f}{x}`
- Example Schrödinger equation:
  ```markdown
  ```math
  i\hbar\frac{\partial}{\partial t}\ket{\psi(t)} = \hat{H}\ket{\psi(t)}
  ```
  ```

### C. Color (`color`)
Allows you to highlight terms or color-code equations using CSS variables. Perfect for theme-aware equations that adapt dynamically to dark and light modes:
- Syntax: `\color{colorName}{term}`
- Example:
  ```markdown
  ```math
  \color{var(--accent-color)}{a^2} + b^2 = c^2
  ```
  ```

### D. Cancel (`cancel`)
Allows striking through terms in equations, great for illustrating algebraic simplifications or chemical reaction cancellations:
- Syntax: `\cancel{x}`, `\bcancel{x}`, `\xcancel{x}`, `\cancelto{value}{expression}`
- Example:
  ```markdown
  ```math
  \frac{x(y+1)}{\cancel{x}} = y + 1
  ```
  ```

### E. Mathtools (`mathtools`)
Adds advanced alignment tools, extensible arrows, and paired delimiters:
- Syntax: `\xleftarrow[under]{over}`, `\xrightarrow[under]{over}`, `\coloneqq`
- Example:
  ```markdown
  ```math
  A \xleftarrow{\text{mapping}} B \coloneqq C
  ```
  ```

---

## 4. Customizing Extensions

If you need a highly specialized, exotic MathJax extension (e.g., `extpfeil` or `cases`), you can add it without modifying the theme source code.

Simply edit your `src/freelance-persona.config.ts` configuration file:

```typescript
// src/freelance-persona.config.ts
export const themeConfig = {
  // ...
  mathjax: {
    // Add your exotic extensions to the list:
    packages: ['mhchem', 'physics', 'color', 'cancel', 'mathtools', 'extpfeil'],
  },
};
```

---

## 5. Limitations and Future Rust Tooling

As the web and Markdown ecosystems evolve, rendering math statically (SSG) involves trade-offs. Below are details on known limitations, our design decisions, and future plans.

### Text Selection Limitation
MathJax CommonHTML (CHTML) outputs highly accurate mathematical layouts using CSS pseudo-elements (e.g., `content: "\e012"`) referencing custom web fonts.
- **Consequence**: The browser's text-selection engine does not recognize these pseudo-elements as select-and-copyable text characters. 
- **Workaround**: Users can still copy raw LaTeX or view equations through standard assistive tech, but they cannot drag-select parts of the formulas as native browser text.

### Rationale: Dropping SVG Blocks
In previous versions, a double-pass architecture rendered block equations as SVGs and inline equations as HTML. However:
1. **No "Save Image As" support**: SVGs rendered inline into the DOM do not trigger browser image-saving contexts. A visitor cannot right-click to download them.
2. **Page Weight**: Generating large SVG path definitions directly inside the HTML markup dramatically increases SSG output size compared to the lightweight, CSS-driven CHTML output.
3. **Complexity**: Managing two separate compilation passes and post-processing steps (like `rehypeRevealMath`) added unnecessary build-time complexity.

### Migration Towards the Rust Tooling Bubble
The wider web-development and Markdown ecosystems are actively migrating towards native Rust-based tools (such as *Sätteri* and other compiler-level AST processors) to replace JavaScript-heavy unified-engine pipelines. 
- **Future Integration**: We are monitoring the maturity of the native Rust compiler bubble in this space. Once math/chemistry parsing libraries in Rust reach complete feature parity and layout compatibility with standard MathJax (e.g., full support for `mhchem`, `physics`, etc.) and integrate natively into Astro, this theme will migrate to a pure Rust compiler toolchain, removing the Node/Unified pipeline entirely.

