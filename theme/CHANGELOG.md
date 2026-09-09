# astro-freelance-persona_theme

## 0.1.1-beta.3

### Patch Changes

- 211fb8c: fix: bump @astrojs/markdown-remark to ^7.3.0. Required by @astrojs/mdx v8 — Renovate's mdx major bump landed without its matching companion, and mdx v8 rejects markdown-remark < 7.3 with "`@astrojs/markdown-remark` is too old to render `.mdx` files" during the playground build.

## 0.1.1-beta.2

### Patch Changes

- cc38ee7: fix: about page float. The floating avatar/certificate block uses container-edge-relative margins so the float survives narrow containers (was viewport-relative).
- cc38ee7: feat: category cards expose readability floor dials (`--blog-desc-floor`, `--blog-tag-floor`, `--latest-link-floor`, `--mini-*`) — tune the card typography in one block.
- cc38ee7: feat: clamped post tags with native expand/collapse. Blog-post tag lists clamp to one row on mobile and two rows on desktop with a native checkbox reveal ("Show all tags" / "Show fewer tags" — theme-consistent with the radio theme switcher, works without JS, resizes for free). A bottom mask reveals the next row's badge tops while collapsed. The label renders server-side only when the tag count can overflow (desktop fits 11 tags in two rows, mobile ~3 in one — ≤3 = no toggle, 4–11 = mobile-only, ≥12 = always).
- cc38ee7: feat: feature cards expose readability floor dials (`--feature-*-floor`) and hover effects are gated behind `(hover: hover)` with touch-device fallbacks.
- cc38ee7: feat: mobileOrder — phone-grid card ordering. Feature cards accept an optional `mobileOrder` (1..n) that re-pairs the 2-col phone grid without touching desktop or DOM order, and the phone grid now re-pairs automatically by reading the desktop 3-col matrix in 2-column bands (first two columns of every row, then the last column). Applied via static per-card CSS rules — not inline custom properties (CSP-safe).
- cc38ee7: feat: feature cards accept an optional `subtitle` (rendered as a subtitle row) and the icons align to the card's right edge on phones.
- cc38ee7: feat: markdown admonitions + pullquote. `:::note`, `:::tip`, `:::info`, `:::important`, `:::warning`, `:::caution` render as styled callout boxes (fixed semantic hues, dark-mode safe via color-mix), with an optional custom subtitle via `:::warning[Label]` and `:::pullquote` for the pop-quote look. Built on the standard `remark-directive` parser — no new dependencies. Demo usage in the starter's "Hello World" post; docs in docs/features/admonitions.md.
- cc38ee7: fix: blog-post quotes and tables. Blockquotes are paragraph-friendly (left-aligned 17px, accent bar stays; `:::pullquote` for the pop look), and post tables clamp to the article with horizontal scroll instead of overflowing the page on phones.
- cc38ee7: fix: contact checkbox links. Checkbox labels (and other inline-markdown surfaces) resolve links through the theme's link pipeline — `[Privacy Policy](/legal/…)` honors `BASE_URL`, fixing 404s on subpath deployments.
- cc38ee7: fix: CSP inline styles. The default CSP combined Astro's auto-generated style hashes with `'unsafe-inline'` on style-src — per spec a hash makes `'unsafe-inline'` ignored, silently blocking every non-hashed inline style (set:html style blocks, nudges, define:vars, Shiki colors). The theme now re-declares `style-src-elem` / `style-src-attr` explicitly so they take effect.
- cc38ee7: fix: 50% smaller copy button. The Expressive Code copy button shrinks visually via `transform: scale(0.5)` (anchored top-right) — EC keeps rendering at its native box so the icon and copied-state feedback stay intact and the 40px layout box doubles as the click target. Resizing the box externally breaks both.
- cc38ee7: fix: footer quote size on phones. `.footer .quote` was missing from the footer's mobile typography block and stayed at a fixed 16px; it now uses the standard mobile clamp.
- cc38ee7: fix: post-card tag rail. Tag rails on post cards (home news, category cards, inner list rows) clamp to a single scrollable row — scrollbars hidden, the mid-badge cutoff at the date's edge acting as the affordance — and the date can no longer deform. The news UI restructures into two stacks (text over tag rail, thumb over date) so the rail's cutoff sits exactly at the thumb's left edge. News-UI typography is now dial-driven (`--fp-news-*-size` mobile / `--fp-news-desktop-*-size` desktop), and the desktop rows thumbs are uniform 13.5rem (mock rows floored).
- cc38ee7: fix: reveal elements taller than one viewport rendered blank. The scroll-reveal observer used a ratio threshold (0.1): an element taller than 10 viewports can never reach 10% visibility, so long blog posts rendered blank until scrolled far enough. The observer now fires on any intersection, with the configured threshold translated into a height-independent bottom viewport inset.
- cc38ee7: fix(testing): deterministic category-card hover screenshots. The hover test settles the scroll-reveal (900ms after scrollIntoView) before hovering and waits out the hover transition — reveal lift + hover lift racing produced load-dependent 2-3px ghost diffs.
- cc38ee7: fix: true-linear desktop root dial. The root font-size scales strictly linearly with the viewport on ≥1024px — identical line breaks at every 16:9 width. Documented in docs/decisions/2026-09-06-proportional-desktop-scaling.md.

## 0.1.1-beta.1

### Minor Changes

- Proportional card constitution: every card type carries a fixed aspect ratio (no card can deform) and scales as one system from the desktop master; internals, corners and badges are container-relative.
- News-row (heise-style) teaser UI as a shared consumable: used by the home feed on mobile and by the inner blog list pages at all viewports.
- Mobile density pass: contact info box, hairline separators, fluid sections, feature grid at full outer-edge width, 768px breakpoint audit for tablet consistency.
# 0.1.0-alpha.7

### Minor Changes

- Bump to Astro7 and small UI fixes

### Minor Changes

- Bump to Astro7 and small UI fixes

## 0.1.0-alpha.6

### Minor Changes

- Fix UI clipping issue, and made favicon theme aware.

## 0.1.0-alpha.5

### Minor Changes

- Implement dynamic build-time version introspection and token replacement in the footer, qualifications, and features.

## 0.1.0-alpha.2

### Patch Changes

- fix(deps): resolve KaTeX version mismatch dynamically via Rehype wrapper

## 0.1.0-alpha.1

### Patch Changes

- e84ec2e: Preload above-the-fold hero background and blog post thumbnail images in HTML head, reduce preloader fadeout transition from 600ms to 250ms, and adjust scroll animations duration from 800ms to 500ms for snappier mobile performance.
- e825a8e: Optimize mobile PageSpeed score by preloading critical fonts, speeding up the preloader fadeout, and initializing scroll animations synchronously.

## 0.1.0-alpha.0

### Minor Changes

- Initial alpha release
