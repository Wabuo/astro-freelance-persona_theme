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
- [ ] **Icon migration (astro-icon)**: Infrastructure is ready (`astro-icon`, `@iconify-json/*`, `transformIcon()`, `<Icon>` imports in 10 files) but never activated. Replace all `<i class="bi bi-...">` with `<Icon name="bi:..." />`, remove Bootstrap Icons font import from `main.scss`. Estimated ~30 locations.
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
