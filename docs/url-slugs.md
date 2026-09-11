<!--
SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors

SPDX-License-Identifier: MIT
-->

# URL Slugs & Post Filenames

> Loose snippet — part of the `docs/` pile, to be folded into the real
> documentation later.

## How post URLs are derived

- The **filename is the slug**: `blog_posts/beekeeping/split_and_treat.mdx`
  → `/posts/split_and_treat`.
- Folders are **organization only**. `BlogPost.astro` flattens content IDs
  (`post.id.split('/').pop()`), so nesting never shows up in the URL — see
  AGENT.md "Flat Blog Routing".
- There is **no `slug` frontmatter field**, by design. To change a URL,
  rename the file. One source of truth, and the ID → URL mapping stays
  trivial.

## Hyphens vs underscores

- **Lean hyphen (kebab-case)** for new files: `split-and-treat.mdx`.
- Hyphens are the documented best practice (Google Search Central URL
  guidance) and read as word separators in browsers, SERPs and analytics.
- **Modern search engines handle underscores fine** — this is a style
  preference, not a ranking difference. Don't migrate existing files over it.
- **Consistency is the bigger, human-side thing**: pick one separator and
  stick to it so filenames, links and your own greps stay predictable.
  Mixed separators across a site have no known crawl or ranking penalty.

### Coining a technique or product name

For a multi-word technique name (e.g. "Split and Treat"):

- Prefer `split-and-treat` in the URL. The name is coined in the prose and
  headings; hyphens just keep the URL readable and easily tokenizable.
- The main reason to avoid underscores is cosmetic: they can visually vanish
  under link underlines, and some third-party tools treat them as
  word-joiners.
- Once a slug is public, prefer not to change it (link stability), even in
  early beta. If you must, add a redirect.

## Collision behavior (hard build failure)

Two posts with the **same basename** in different folders (e.g.
`a/post.mdx` and `b/post.mdx`) both flatten to `/posts/post`. This is a
**hard build failure** — `BlogPost.astro`'s `getStaticPaths` detects the
duplicate and throws:

```
Duplicate post slug(s): the filename is the URL slug and folders are
organization-only, so these would render to the same page (Astro would
silently drop one). Rename one file per pair:
  /posts/post
    - a/post.mdx
    - b/post.mdx
```

Rename one file in each pair. (Background: without the guard Astro merely
emits `[WARN] Could not render '/posts/post' ... conflicts with higher
priority route` and writes only **one** page — the other post silently
disappears. That trap is why the guard exists.)

## Related code

- `theme/src/freelance-persona/pages/posts/BlogPost.astro` — route + ID flattening
- `theme/src/freelance-persona/utils/slugify.ts` — categories/features derive
  slugs from titles and always produce **kebab-case** (a contrast worth noting)
- Link builders: `FilteredPostsSection`, `BlogCategoriesSection`,
  `[BlogCategory]`, `BlogSidebar`
