# Markdown Admonitions & Pullquote

The theme parses markdown **container directives** (via the standard
`remark-directive` parser) into styled callout boxes.

## Syntax

```md
:::warning[Custom subtitle]
Body text. **Markdown works.**
:::
```

- `:::type` opens the box, `:::` closes it
- The **type name** ("Warning", "Info"…) renders as the box title
  (small caps, type-colored)
- The **bracketed line** is the subtitle — rendered as a row below
  the title in the theme's subtitle styling (mono, same
  size/weight as `.section-title em`) but in the box's semantic
  color so it matches the type title, brackets stripped automatically

## Available types

| Directive | Color | Use case |
| --- | --- | --- |
| `:::note` | neutral | FYI, asides |
| `:::info` | sky | Helpful context |
| `:::tip` | green | Tricks, best practice |
| `:::important` | accent | Must-know before proceeding |
| `:::warning` | amber | Risks, legal, caveats |
| `:::caution` | red | Danger, destructive actions |

Colors are fixed semantic hues (universal callout semantics) applied
via `color-mix`, so they adapt to both themes. Configure in
`_blog-post.css` (`.admonition-*` custom properties).

## Pullquote

For one-line quotes meant to pop (the old centered big-italic look):

```md
:::pullquote
Real stupidity beats artificial intelligence every time.
:::
```

The default `>` blockquote is deliberately paragraph-friendly
(left accent bar, left-aligned 17px) — see `blog-post.css`.

## Nesting

Nested blockquotes keep working and simply indent further (the design
is border-left based). For callouts, prefer a directive over nesting.
