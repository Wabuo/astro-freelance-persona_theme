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
