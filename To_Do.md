<!--
SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors

SPDX-License-Identifier: MIT
-->

# To Do

## Deferred from Audit (May 2026)

- [ ] **README "YourGitHubName" placeholder**: Replace with actual org name once GitHub organisation is created
- [ ] **`index.js` vs `package.json` exports reconciliation**: The root `index.js` re-exports components but `package.json` `exports` field takes precedence — reconcile or remove `index.js`
- [ ] **`tsconfig.json` starter alias**: Currently points to `../src/freelance-persona/*` (monorepo-only). Update to point to npm package once published, with local dev fallback
- [ ] **Icon migration (astro-icon)**: Infrastructure is ready (`astro-icon`, `@iconify-json/*`, `transformIcon()`, `<Icon>` imports in 10 files) but never activated. Replace all `<i class="bi bi-...">` with `<Icon name="bi:..." />`, remove Bootstrap Icons font import from `main.scss`. Estimated ~30 locations.
- [ ] **Unsplash license**: Consider adding `"Unsplash"` to `LICENSE_URLS` in `licenseUtils.ts` if user demand warrants it
 