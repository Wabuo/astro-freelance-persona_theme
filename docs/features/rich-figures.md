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
  alt="Detailed Alt Text"
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
- **`alt`**: Descriptive alt text for screen readers.
- **`width`**: A relative CSS unit (`%`, `rem`, `em`).
- **`float`**: Float layout (`"left"` or `"right"`).
- **`align`**: Text alignment when not floating (`"left"`, `"center"`, `"right"`).
- **`desc`**: Caption description text.
- **`credit`**: Name of the photographer or creator.
- **`creditUrl`**: Link to the creator's portfolio.
- **`license`**: Auto-links known licenses (`CC0`, `CC BY 4.0`, `MIT`, `Apache 2.0`, `GPL 3.0`, etc.).
- **`copyright`**: Copyright text (e.g. `"John Doe 2026"`).
