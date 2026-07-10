# Phase 1: Test Suite Stabilization — Implementation Plan

## Goal
Make the visual regression suite **deterministic, fast, and trustworthy** so it serves as the "golden master" diff target for the UnoCSS migration.

---

## Current Pain Points
- Flaky screenshots from animation timing, font rasterization differences, typing cursor variance
- Tests inject CSS via `page.addStyleTag` inconsistently
- Contact form test skips Firefox, mocks all POSTs indiscriminately
- Theme toggle test fails on Firefox Dark due to `colorScheme` + `:has()` interaction
- No config variation coverage — only tests starter's single config
- 404/403 have autonomous mascot animation (can be removed)
- Baselines are gitignored build artifacts (correct) but no traceability to commit

---

## Phase 1 Scope

### 1. Test-Mode Injection via Integration Hook
**Files**: `theme/src/freelance-persona/integration.ts`, `theme/src/freelance-persona/layouts/BaseLayout.astro`, `theme/src/freelance-persona/styles/base.scss`

**Mechanism**:
- Integration reads `process.env.PLAYWRIGHT_TEST === 'true'` (set in Playwright webServer command)
- Defines `import.meta.env.TEST_MODE = true` via Vite `define`
- BaseLayout renders `<html data-test-mode="true">`
- All test-mode CSS lives in `base.scss` under `[data-test-mode="true"]` selector

**CSS Rules** (add to end of `base.scss`):
```scss
[data-test-mode="true"] {
  *,
  *::before,
  *::after {
    transition: none !important;
    animation: none !important;
    scroll-behavior: auto !important;
  }

  [data-reveal] {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }

  .typed-cursor {
    display: none !important;
  }
  .typing-lock,
  .typed {
    opacity: 1 !important;
    visibility: visible !important;
  }

  .mascot-container {
    animation: none !important;
  }

  ::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
}
```

**Playwright Config** (`playwright.config.ts`):
```typescript
webServer: {
  command: 'PLAYWRIGHT_TEST=true bun run build && bun run preview',
  // ...
}
```

### 2. Remove All Runtime CSS Injection from Tests
**Files**: All `*.spec.ts` in `starter/testing/tests/`

Delete every `page.addStyleTag({ content: ... })` block. The test-mode CSS handles:
- Reveal animations
- Transitions/animations
- Scroll behavior
- Typing cursor
- Mascot animation

### 3. Expand Masks in Full-Page Screenshots
**Files**: `home.spec.ts`, `blog.spec.ts`, `hover.spec.ts`, `theme.spec.ts`, `error.spec.ts`, `legal.spec.ts`

**Standard Mask** for any `fullPage: true` screenshot:
```typescript
mask: [
  page.locator('.typing-lock'),
  page.locator('.typed-cursor'),
  page.locator('.mascot-container'),
  page.locator('.hero .typing-wrapper'), // Wider mask for typing area
]
```

### 4. Fix Flaky Tests

#### `contact.spec.ts`
- Remove `testInfo.project.name.includes('firefox')` skip
- Fix route mock: only intercept the configured provider endpoint
```typescript
const provider = themeConfig.contact_form?.provider || 'formspark';
const providerUrls = {
  formspark: 'submit.formspark.io',
  web3forms: 'api.web3forms.com',
  ntfy: 'ntfy.sh',
  netlify: 'netlify.com',
  mailto: null, // No interception needed
  custom: themeConfig.contact_form?.action,
};
await page.route(`**/${providerUrls[provider]}**`, async (route) => {
  if (route.request().method() === 'POST') {
    await route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
  } else {
    await route.continue();
  }
});
```

#### `theme.spec.ts` Firefox Dark
- For toggle tests, force light colorScheme in Firefox Dark project:
```typescript
test.use({ colorScheme: 'light' }); // Only for toggle tests in firefox-dark
```
Or mock checkbox state directly via `page.evaluate()`.

#### `hero-safety.spec.ts`
- Expand mask to cover full `.hero .typing-wrapper`

### 5. Static Config Matrix (5 Config Files)

**Location**: `starter/testing/configs/` (new folder)

| File | Proves | High-Contrast Values |
|------|--------|---------------------|
| `config-colors.ts` | Color CSS vars propagate | `dark: { background: '#ff0000', accent: '#00ff00', surface: '#0000ff', heading: '#ffff00' }` |
| `config-fonts.ts` | Font stack + CSS vars | `headings: 'Courier New', body: 'Georgia', navigation: 'Impact', monospace: 'Monospace'` |
| `config-noanim.ts` | Animations disabled at config level | `visuals: { scroll_animations: { enabled: false } }` |
| `config-contact.ts` | Contact provider switching | `contact_form: { provider: 'mailto', action: 'mailto:test@test.com' }` |
| `config-hero.ts` | Hero layout positioning | `visuals: { layout: { page_margin_left: '2rem', nav_pill_expanded_width: '8rem' } }` + hero.md overrides via config |

**Each config file exports a complete `PersonaConfig`** that can be imported by the test runner.

### 6. Config Matrix Test Runner

**File**: `starter/testing/tests/config-matrix.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const CONFIG_DIR = path.resolve(__dirname, '../configs');
const configs = fs.readdirSync(CONFIG_DIR).filter(f => f.endsWith('.ts'));

for (const configFile of configs) {
  const configName = configFile.replace('.ts', '');
  
  test.describe(`Config Matrix: ${configName}`, () => {
    test('Homepage renders with config applied', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveScreenshot(`config-matrix-${configName}-home.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.1,
        mask: [
          page.locator('.typing-lock'),
          page.locator('.typed-cursor'),
          page.locator('.mascot-container'),
        ],
      });
    });
  });
}
```

**Local Execution**: Sequential — run one config at a time:
```bash
# Build with specific config
TEST_CONFIG=config-colors bun run build && bun run preview &
# Run tests against it
bun x playwright test config-matrix.spec.ts --project=chromium
```

**CI** (optional/nice-to-have): Sequential jobs, each builds + tests one config.

### 7. Remove 404/403 Autonomous Animation
**Files**: `theme/src/freelance-persona/pages/404.astro`, `theme/src/freelance-persona/pages/403.astro`

- Remove mascot animation CSS/JS
- Keep static SVG only
- Test-mode CSS already disables it, but cleaner to remove source

### 8. Baseline Traceability
- Baselines remain gitignored (build artifacts) ✓
- CI (when used): `bun run test --update-snapshots` on main after review
- Local baseline update: `cp -r playground/testing/tests/*-snapshots/ theme/starter/testing/tests/`
- Document: Add `TEST_BASELINE_COMMIT` in CI env to track which commit baselines belong to

---

## Execution Checklist

| Step | Task | Files Modified | Verification |
|------|------|----------------|--------------|
| 1 | Add TEST_MODE define + BaseLayout attribute | `integration.ts`, `BaseLayout.astro` | `data-test-mode="true"` in HTML during test |
| 2 | Add test-mode CSS to base.scss | `base.scss` | Animations disabled in test run |
| 3 | Remove all `page.addStyleTag` from tests | All `*.spec.ts` | Clean test code, no injected CSS |
| 4 | Expand masks in full-page tests | `home.spec.ts`, `blog.spec.ts`, `hover.spec.ts`, `theme.spec.ts`, `error.spec.ts`, `legal.spec.ts` | No cursor/mascot diffs |
| 5 | Fix contact.spec.ts (Firefox + mock) | `contact.spec.ts` | Passes on all 4 projects |
| 6 | Fix theme.spec.ts Firefox Dark | `theme.spec.ts` | Passes on firefox-dark |
| 7 | Create configs/ folder + 5 config files | `starter/testing/configs/*.ts` | TypeScript compiles |
| 8 | Create config-matrix.spec.ts | `starter/testing/tests/config-matrix.spec.ts` | 5×4 = 20 new baselines generated |
| 9 | Remove 404/403 mascot animation | `404.astro`, `403.astro` | No autonomous movement |
| 10 | Run 10× clean locally | — | Zero flakes across all projects |
| 11 | Record golden master traces | CI artifact (optional) | Migration diff target exists |

---

## Out of Scope (Phase 2+)
- Config matrix generator (TypeScript schema-driven) — static files first
- Parallel CI execution — sequential locally is fine
- WebKit/Safari testing — enable in CI when dependencies available
- Performance budgets — Lighthouse CI is Phase 4
- UnoCSS migration — this plan prepares the test bed for it

---

## Success Criteria
- [ ] `bun run test --reporter=list` passes 10 consecutive times with zero flakes
- [ ] All 4 projects (chromium, Mobile Chrome, firefox-dark, noscript) pass
- [ ] 5 config matrix baselines generated per project (20 total)
- [ ] No `page.addStyleTag` remains in test files
- [ ] Test-mode CSS handles all animation/transition disabling
- [ ] Contact form test passes on Firefox
- [ ] Theme toggle test passes on Firefox Dark
- [ ] Baselines traceable to commit hash

---

## Next Phase (After This Plan Completes)
Phase 2: UnoCSS Migration Planning — with a stable, deterministic test suite as the regression safety net.