# Internal Links in Markdown-Controlled Content

Some theme features accept raw Markdown strings from user config/content and
render them inline — e.g. the contact form checkbox labels
(`contact_form.checkboxes[].label` in `freelance-persona.config.ts`):

```ts
label: "I have read and agree to the [Privacy Policy](/legal/privacy-policy)."
```

These strings are parsed with [`marked`](https://marked.js.org/)'s
`parseInline()`. **`parseInline()` knows nothing about your site's `BASE_URL`.**

## The Problem

A root-absolute link like `/legal/privacy-policy` is emitted verbatim:

```html
<a href="/legal/privacy-policy">Privacy Policy</a>
```

On a domain root (`https://example.com/`) this works. On subpath hosting
(e.g. GitHub Pages at `https://user.github.io/repo/`) it points at the
domain root instead of your site → 404.

## The Fix

Route the parsed HTML through `resolveParsedInline()` from
`@freelance-persona/utils/linkUtils`:

```astro
---
import { parseInline } from "marked";
import { resolveParsedInline } from "@freelance-persona/utils/linkUtils";
const html = resolveParsedInline(parseInline(label));
---

<label set:html={html} />
```

`resolveParsedInline()` rewrites `href="/path"` to
`href="{BASE_URL}path"` and leaves everything else untouched:

- `https://…` / `http://…` — external, unchanged
- `mailto:`, `tel:`, `#fragment` — unchanged
- protocol-relative `//host/…` and empty hrefs — unchanged

For building `href` values in templates directly (not from parsed Markdown),
use plain `resolveLink()` instead — `resolveParsedInline()` is only the
post-processing wrapper for rendered HTML strings.

> **Rule of thumb:** any internal link that originates from markdown text
> must pass through `resolveParsedInline()`; any internal link you construct
> in code must pass through `resolveLink()`.
