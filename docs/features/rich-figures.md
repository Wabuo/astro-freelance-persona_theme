# Rich Figures in MDX (`<Figure>`)

To support clean media presentation in MDX blog posts with strict attribution requirements, use the native `<Figure>` component.

---

## 1. Syntax

Import and use the component within any `.mdx` file:

```mdx
import Figure from '@freelance-persona/components/Figure.astro';
import myImage from './my-image.png';

<Figure
  src={myImage}
  img_alt="Detailed description of what the image shows."
  title="Short Caption Title"
  desc="This is a description of the image shown below the image card."
  width="15rem"
  float="right"
  credit="John Doe"
  creditUrl="https://example.com/johndoe"
  license="CC BY 4.0"
/>
```

---

## 2. Available Properties (validated via Zod)

The component parameters are validated using a Zod schema to ensure correct layout and formatting:

- **`src`**: Relative image path imported at the top, or a public string path.
- **`img_alt`**: Accessibility description — what a visitor who cannot see the
  image would miss. **Required** (a build error without it). Use `"hidden"` for
  purely decorative images: they render `alt=""` + `aria-hidden` and stay silent.
- **`title`**: Bold caption lead-in, the human-facing label for the visual.
  (This used to be the `alt` text doubling as the caption — `img_alt` is for
  accessibility, `title` is for humans.)
- **`width`**: A relative CSS unit (`%`, `rem`, `em`).
- **`float`**: Float layout (`"left"` or `"right"`).
- **`align`**: Text alignment when not floating (`"left"`, `"center"`, `"right"`).
- **`desc`**: Caption description text.
- **`credit`**: Name of the photographer or creator.
- **`creditUrl`**: Link to the creator's portfolio.
- **`license`**: Auto-links known licenses (`CC0`, `CC BY 4.0`, `MIT`, `Apache 2.0`, `GPL 3.0`, etc.).
- **`copyright`**: Copyright text (e.g. `"John Doe 2026"`).
