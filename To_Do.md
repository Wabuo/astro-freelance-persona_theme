<!--
SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors

SPDX-License-Identifier: MIT
-->

# To Do
start using popover=hint for all tooltips and put them everywhere sensible, shit needs to explain what it does #88
basically check if there is a decent modern to do it and then use it.


## Deferred from Audit (May 2026)

- [ ] **README "YourGitHubName" placeholder**: Replace with actual org name once GitHub organisation is created
- [ ] **`index.js` vs `package.json` exports reconciliation**: The root `index.js` re-exports components but `package.json` `exports` field takes precedence — reconcile or remove `index.js`
- [ ] **`tsconfig.json` starter alias**: Currently points to `../src/freelance-persona/*` (monorepo-only). Update to point to npm package once published, with local dev fallback
- [x] **Icon migration (astro-icon)**: DONE (post-migration audit found zero
  `<i class="bi">` remaining — everything renders via `transformIcon()` +
  `<Icon>`, tree-shaken into per-page SVG sprites; the Bootstrap Icons font
  is gone). Custom icons: drop SVGs into `src/icons/` and use
  `<Icon name="myicon">` (astro-icon local collection). Revisit
  `@unocss/preset-icons` only if icons-in-markdown becomes a real need
  (mono-color mask trade-off + safelist design).
- [ ] **Unsplash license**: Consider adding `"Unsplash"` to `LICENSE_URLS` in `licenseUtils.ts` if user demand warrants it

## Deferred from UnoCSS Migration 3.4-fallout review (Aug 2026)

- [ ] **Blog hero `background.svg` bleed-through**: Present on the live pre-UnoCSS
  release too — upstream SVG asset issue, not a CSS regression. Fix the asset
  (transparency/edge bleed) whenever convenient.
- [ ] **Feature card fly-up button vs border overlay (optional polish)**: The
  accent `.feature-hover-action` slides up *beneath* the `.card-base::after`
  1px border overlay (`z-index` 5 < 10), so the border line crosses the button
  and its corner anti-aliasing can look unclean at bottom-right. Pixel-identical
  to the live release in both schemes (verified) — pre-existing, not a migration
  regression. Polish idea: raise the action above the overlay or clip it inside
  the border radius.
- [ ] **Icon strategy unification (post-migration)**: Decision (Aug 2026): keep
  `astro-icon` + `@iconify-json/bi` + `@iconify-json/academicons` for now;
  `src/icons/.gitkeep` reserves the dir. Evaluate after the UnoCSS migration:
  switch to `@unocss/preset-icons` to unify pipelines and drop astro-icon +
  iconify deps. Caveats to solve first: icon names arrive from content/config
  (`icon: "bi bi-search"`) so dynamic class names need a safelist or content-dir
  scan; custom SVGs (lance mascot, etc.) could then ship via `src/icons`
  custom collection. Bootstrap Icons font is already fully gone — this is only
  about the remaining astro-icon layer.
- [ ] **EC (Expressive Code) theming modernization**: `_code-blocks.css` carries
  compensation blocks because EC emits its own `@media (prefers-color-scheme)`
  switch (bypasses the page chooser; breaks only in the `OS dark + forced
  light` case — see the `!FixMe!` in that file). Follow-ups: (a) file an EC
  feature request — color-scheme-aware dual themes or selector-scoped media
  emission; (b) once CSS `if()` ships in Firefox/Safari (Chrome 137+ has it),
  replace the copy-button/compensation rules with `if(style(--theme: …))`
  querying the global theme state (see `!FixMe!` in `_code-blocks.css`).
- [ ] **Author widget (optional feature)**: the old Zola-era `.blog-author-widget`
  CSS was deleted in the post-migration audit (nothing rendered it; the About
  section already covers author identity). If a sidebar author card is ever
  wanted, build it as a proper `AuthorWidget.astro` component (config-driven,
  utilities + component CSS) — do not resurrect the orphaned stylesheet.
- [ ] **BaseLayout scroll-animation engine is an inline string (deliberate)**:
  the reveal/stagger engine is injected via `set:html` so it runs BEFORE first
  paint. A "modern" `<script>` module would be deferred and cause a
  flash-of-visible-then-hidden reveal (CLS/Lighthouse regression). The dead
  `utils/animations.ts` copy was deleted in the post-migration audit. Do not
  "modernize" this into a regression without solving the pre-paint timing
  problem first.
- [ ] **lightningcss: bump when anchored() support releases**: `container-type:
  anchored` / `@container anchored(fallback: …)` (anchor positioning L2 —
  used by the theme dropdown roll-up) fails to parse in lightningcss
  ≤1.33.0 ("Unexpected token Function(\"anchored\")"). Support is MERGED
  upstream (parcel-bundler/lightningcss#1218, fixes #1176) but unreleased
  as of 1.33.0. Until it ships: `build.cssMinify: false` in
  integration.ts + root package.json override pinning ^1.33.0. When
  released: `bun update lightningcss`, remove both, done.
- [ ] **Theme dropdown chevron flip (optional JS)**: when the home sidebar
  dropdown auto-flips above the toggle (anchor positioning), the toggle's
  chevron stays pointing down. Pure CSS cannot fix this — the flip state is
  only exposed to descendants of the positioned element via
  `@container anchored()` (css-anchor-position-2 §2.1), and the chevron is a
  sibling. If the zoom/small-window edge case proves common in practice, add
  a small optional JS enhancement that mirrors the engine's decision onto
  the chevron.
