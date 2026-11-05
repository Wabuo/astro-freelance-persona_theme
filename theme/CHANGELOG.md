# astro-freelance-persona_theme

## 0.1.1-beta.7

### Patch Changes

- bf3560d: fix messed up lancy eye, after the slight redisign and purge of old copys from the repo
- f84bc62: Fixes the Expressive Code copy button in two ways. On hover-capable devices the theme's `scale(0.55)` de-emphasis transform was global although it was tuned against the touch-layout geometry only: EC pairs `@media (hover: hover)` with its narrow 2rem hover-revealed button, and the theme's responsive root font size (<16px on large screens) shrinks that rem further, so desktop buttons rendered as ~12px specks instead of their native EC sizing. The shrink is now scoped to `@media (hover: none)` — mirroring EC's own interaction discrimination (including non-hover desktop-sized devices like landscape tablets/kiosks, which permanently show the full 2.5rem button in the reading flow) — so touch layouts keep their shipped look exactly while desktop gets the native ~21px hover-revealed button. Separately, the button's outline ring in dark mode was as opaque as in light (60%, a light-mode dial that the dark cases only overrode for color, not opacity) and read too bright on dark code backgrounds; the dark cases now dial the outline down to 30% via a `--copy-btn-outline-opa-dark` variable in both dark scenarios (OS-dark with untouched chooser, and forced dark).
- 92487b4: Fix the Lancy eye assembly being left behind in the renditions whose eye background/mouth moved up with the head-geometry refinement: the blue outline (`path5`) and the eyeball group (`g18`, pupil + sparkle) kept the old offsets, so the white poked out above the ring and the pupil sat low. Both are re-seated at the source rendition's canonical offsets (`translate(0,-1.6045879)` in each file's own frame, compensated per ancestor matrix for the pre-scaled variants: `lancy_blog.svg`'s 3.115×/1.17× chain, `avatar.svg`'s 1.84× matrix, `background.svg`'s `g3` chain). Affects `lancy_blog.svg`, `lancy_for_background.svg`, `avatar.svg` and `background.svg`; the intentional lateral gazes are preserved and `lancy.svg` was already correct. The same fixes are synced to the fabio site repo's copies of `lancy.svg`, `lancy_blog.svg` and `avatar.svg`.
- 2752468: The hero typewriter no longer clips mid-word on touch layouts. The typing script pins an inline `min-width` on the installed-text container to the longest typing item's width (desktop's CLS-guard: desktop renders each item on one line), but the ≤1023px block only overrides white-space — the forced width survived there, made the container wider than the phone, and the hero's `overflow: hidden` then sliced wrapped line tails (visibly: text cut off mid-item, then wrapping to the next line with letters missing — most obvious with the starter sample's "responsive and lightweight theme for resume" item). The mobile block now neutralizes the inline lock (`min-width: 0 !important`, beating the inline style) and pins `overflow-wrap: normal`, so wrapping only happens at spaces and hyphenations — a word is never split, and the longest single *word* of an item must fit the mobile typing size (contract now documented in the template's and consumers' `hero.md`; the starter sample's longest word `lightweight` fits trivially). Desktop behavior is untouched by design: the nowrap mode and the JS lock keep preventing typewriter reflow there.
- 37cc132: Packages that install the theme from npm now reliably get the MathJax CHTML fonts bundled into their build output. The fonts plugin used to derive the font directory from the plugin file's physical location (`theme/node_modules/mathjax-full/…`), which is only true inside the theme's own workspace: bun/npm hoist `mathjax-full` to the consumer's top-level `node_modules` on every published-package install, so the nested path did not exist there and the plugin warned ("MathJax font source not found at …") and skipped the copy — the built site then requested `/fonts/mathjax/*.woff` files that were never shipped. The plugin now resolves `mathjax-full` through the standard Node resolution walk from its own module context (`createRequire(import.meta.url)`), which is layout-agnostic: it finds the nested copy in the repo/workspace layout and the hoisted copy in consumer installs, and degrades to a clear warning if the dependency is genuinely absent.
- f38cc5d: Release plumbing only — no package contents changed. The `publish` workflow's hardened egress allowlist now matches GitHub's release-asset redirect target: `actions/setup-node` downloads Node from `github.com/actions/node-versions`, whose asset redirects moved from `objects.githubusercontent.com` to `release-assets.githubusercontent.com`; the old pinned list rejected the download with `ECONNREFUSED`, including the action's own `nodejs.org` fallback. Both hosts are now explicitly allowed (in addition to the existing ones), so release runs no longer die inside `setup-node` on either host — renovate's `setup-node`/`node-version` bumps had simply been the first run to hit the moved path. After merging, retrigger publication via workflow dispatch on `main` ("re-run failed jobs" on an old run would execute the pre-fix workflow file frozen at the release commit).
- 6f82465: Refine the Lancy mascot artwork: the lance tip and blade cage are re-traced (tip now flares outward with a concave silhouette, the cage spans wider with crisper corners) and the updated geometry is propagated to every rendition — the inline `LanceIcon` component, the starter's `lancy.svg`, `lancy_blog.svg`, `lancy_for_background.svg`, `avatar.svg`, `background.svg`, and the theme-aware `favicon.svg`. The re-traced cage sits ~0.46 units higher than the old one, so the eye/pupil/mouth paths are nudged up by the same world-space amount in each rendition (0.46 in the shared body frame; pre-scaled variants shifted per their ancestor matrix), restoring the previous eye/cage spacing exactly. The eye assembly itself is also refined — outline, eye background, and mouth offsets — with every rendition carrying the identical composition (verified numerically against the source rendition, frame-for-frame). The shaft, rung ladder, limbs, and all fills/styles are unchanged, so no layout or color behavior shifts; the head art simply matches the current master drawings everywhere.
- fc8a65b: bump deps

## 0.1.1-beta.6

### Patch Changes

- 74f775a: The tag badges inside blog category cards now sit halfway to the latest-posts separator: the tags→separator gap is halved (`.latest-posts` margin-top `3.9→1.95cqi`, i.e. 0.5rem at master) and that exact half is re-added as space above the tags (`.category-description` margin-bottom `1.95→3.9cqi`, 1rem at master). Verified at the master card that only the tags move — description top, separator, list rows and the bottom margin of the 403/562 shape are all pixel-identical, so the two changes read as one vertical nudge with no knock-ons.
- f4732f7: Dual-icon feature cards: the inter-icon gap now scales with the card (`1cqi`) instead of a fixed `0.25rem`. Below 1024px the true-linear root dial pins rem while the card shrinks, so the gap showed at double the icon-relative weight on phones and crowded the pair's inner slack. Desktop look is unchanged (~4px at the 1920×1080 master).
- d34ce37: Inline `code` gets a GitHub-ish chip that reuses the inactive tags' own background token (new `--code-inline-background: var(--tag-background)` dial in `base.css`), so inline code and tags read as one system — and because that tint is translucent, the chip follows the surface underneath it (plain page, callout box) instead of painting a flat grey. Its text gets a cool ink of its own instead of the old accent-blue, which read as a broken link: `--code-inline-color` is a new dialable mix of body ink toward `--text-muted` (50% default, ~7.5:1 on the chip in light and ~6.2:1 in dark) — a clear step off the prose colour without spending a hue, since accent stays reserved for things you can click. Code inside a link keeps that ink and gains a solid accent underline at all times, so the affordance survives even though the theme underlines links on hover only. Fenced code is explicitly reset (transparent background, no padding, no radius) so nothing doubles up inside Expressive Code frames, and `box-decoration-break: clone` keeps wrapped identifiers as per-line pills instead of one edge-to-edge band.
- 1b98db0: The blog category card's latest-posts rows now fit the fixed desktop shape with long titles. The card was sized for one-line post titles, so real-world two-line ones (~50-char headlines) overflowed the master `403/534` shape by 25–54px at 3-col desktop widths, and the card's own `overflow: hidden` sliced the last row off at the bottom edge (the Rhizophagy link lost its second line's lower half); phones were already handled by the documented taller per-override shapes. Fix pairs a leaner latest-posts rhythm (separator zone `5.84+6.23cqi → 3.9+3.7cqi`, row margin `2.72→1.9cqi`, description margin `2.43→1.95cqi`) with the missing desktop companion of those phone ratios — `--blog-desktop-ratio: 403/562`, applied ≥1024px only — measured as the denominator where the bottom overlapping rows regain the side-padding margin beneath the underlined last line at the master card (the same "documented per-override ratio, constitution §3" mechanism, that comment now also carries the measurement). The mid band (640–1023px) and phones are untouched by the ratio, and the stale "3 rows on phones" clamp comment now matches the code's uniform 2 lines.
- f1b8422: New nav font-size dial: `fonts.sizes.nav` maps to `--nav-font-size` (default 0.9375rem) and now drives the home sidenav, inner top nav, and dropdown label sizes. Starter demo bumps the nav scale for legibility: pill height / collapsed width `3.75rem` (was 3.5rem), collapsed sidebar width `9.375rem` (was 8.75rem), expanded pill width `11.25rem` (was 10.35rem), nav label font `1rem` (was 0.9375rem).
- 68237de: Every image now carries frontmatter `img_alt` — the accessibility description a visitor who cannot see the image relies on (screen readers, SEO, broken renders). Required whenever an image field is set: hero `background_image`, about `avatar`, `qualifications_sidebar[].image`, `categories[].image`, post `thumbnail`; a missing or empty value fails the build with a pointed message. Use `img_alt: "hidden"` for purely decorative graphics — they render `alt=""` + `aria-hidden` and stay silent. The figure system follows the same key (`<Figure img_alt=…>`, markdown alt, or the `img_alt` query param) and gains a separate `title` prop for the human-facing caption lead-in, so alt no longer doubles as the caption. Replaces the previous hardcoded/derived alts (`"Background"`, `"Profile Avatar"`, post title) and adds `image-alt.spec.ts` (5 tests).
- 07187c3: Home desktop sidenav: the theme switcher now reads as a quiet utility cluster — its icon rests in the muted text color (`--text-muted`), dimmed further in light mode via a scoped `--nav-quiet-color` token. Hover and menu-open keep the established white-on-accent look. Mobile drawer and inner-page top nav are unchanged.
- cb2cb68: Fix the hero typing font chain: `.hero p` now falls back to the mono role token `--font-mono` (was swallowing the nav face, which made `hero.css`'s mono default dead code and broke sites that set `fonts.monospace` without a frontmatter override). Raw in-code token default for `--font-mono` becomes deliberately conspicuous (`Comic Sans MS` stack) per the README Level-4 manifesto rule. Documentation and decision docs ride along: heading-regimes one-pager, updated Level-4 wording.

## 0.1.1-beta.5

### Patch Changes

- 8b72605: fix(ci): the changeset-presence gate no longer fails on the changesets release PR (which consumes all pending changesets by design — a guaranteed false positive), and counts files with `wc -l` instead of `grep -c` so a genuine zero prints the friendly error rather than aborting with a bare exit code under `bash -e`.
- 712d385: fix(ci): the publish workflow now fails fast with an actionable message when `theme/package.json`'s version already exists on npm, instead of surfacing npm's opaque `409 Conflict`. Guards against cutting a GitHub release before the changesets "Version Packages" PR has bumped the version (publish only publishes; it never bumps).

## 0.1.1-beta.4

### Patch Changes

- 88c176d: docs: document URL slug conventions — filenames are slugs (no frontmatter override), hyphen-lean naming with the honest underscore guidance, and the verified same-basename collision behavior. Adds an AGENT.md pointer to the user-facing `docs/` folder.
- 4361e8a: feat: hero uses small-viewport height (100svh). On phones 100vh includes the area under the browser URL bar, so bottom-anchored hero content starts below the fold and only appears after scrolling collapses the bar. svh is always the visible area — identical to vh on desktop.
- 30e7851: feat: mobile table treatments. Markdown tables on phones render via `visuals.tables.mobile_style`: **cards** (default — each row becomes a self-describing card, first column emphasized as the card header; per-column accents color the labels and add soft left bars so grouped columns are pattern-scannable, overridable via `--table-col-N-color`), **scroll** (compact spreadsheet-grade grid for structured data: 13px cells, thin column separators, pinned first column with zebra-matched background, right-edge swipe fade), or **native** (plain overflow). remarkTableDataLabels copies column headers onto cells as data-label attributes. Desktop untouched. Demo table in the starter's Hello World post; docs in docs/features/mobile-tables.md.
- 0637dac: feat: no-image post previews render as a miniature desktop view. The mock preview now uses a 1280×720 (16:9) desktop reference viewport scaled entirely in cqw — nav padding, centered content column, and badge chrome (padding/radius/margins now proportional instead of fixed-rem, which dwarfed the microscopic text in small thumbs). Uniform miniature at any thumb size, mobile rows included.
- d757d8f: fix: admonition subtitles take the box's semantic color (amber for warnings, green for tips, red for cautions, …) instead of the generic accent, matching the type title above them. Formatting (mono, size, weight) unchanged.
- e05be6b: fix(routing): duplicate post slugs are now a hard build failure. Since the filename is the URL slug and folders are organization-only, two posts with the same basename flatten to the same page — `BlogPost.astro`'s `getStaticPaths` detects this and throws with both source paths listed, instead of Astro's silent warn-and-drop (which left one post unreachable). Docs updated in `docs/url-slugs.md`.
- 41c9146: fix: reveal engine initial-fold pass. Elements visible in the real viewport at load reveal through a no-inset observer — the bottom threshold inset (rootMargin) could permanently suppress above-the-fold content whose top edge sits inside the excluded bottom zone, e.g. bottom-anchored hero text on phones, which only revealed after a tiny scroll collapsed the URL bar. Intersection timing is unchanged; elements below the fold keep the inset-gated observer exactly as before.
- 8b98fcd: fix(testing): config-fonts matrix font-size expectation is root-relative. The expectation hardcoded "40px" (2.5rem at the pre-dial fixed 16px root); with the true-linear root dial the computed size varies with the viewport, so the check now accepts rem expectations and resolves them against the live computed root size.
- 84de94f: fix(testing): config matrix honors TEST_PORT for its preview server. The runner spawned `astro preview` without `--port`, so the preview always bound 4321 while the readiness poll waited on TEST_PORT — every config reported "did not start in time" whenever the matrix ran on a non-default port.

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
