# Config Matrix & Two-Tier Test Suite

## Goal
Get the test suite into a state where it's useful for the upcoming UnoCSS migration: a fast iterative tier for dev loops, a comprehensive tier for pre-release, and a config matrix that proves every user-facing knob actually works. All verification must be CSS-tooling-agnostic (CSS custom properties are the stable contract regardless of Bootstrap/UnoCSS/raw CSS).

---

## Current State (Post Phase 1)

- **Done:** Test-mode injection (`PLAYWRIGHT_TEST` → `data-test-mode` → CSS kills animations), no `page.addStyleTag` anywhere, 19 active test files, 4 Playwright projects (chromium, Mobile Chrome, firefox-dark, noscript)
- **Dormant:** `config-matrix.spec.ts.skip` (renamed, never executed), 5 placeholder config files in `testing/configs/`
- **Missing:** `verify-config.ts`, build-per-config mechanism, expectations, proper project structure for two tiers

---

## 1. Playwright Project Restructure

### New Projects (replace current 4)

| Project Name | Device | Color Scheme | Tier |
|---|---|---|---|
| `firefox-light` | Desktop Firefox | `light` | quick + full |
| `chrome-mobile-dark` | Pixel 5 | `dark` | quick + full |
| `firefox-dark` | Desktop Firefox | `dark` | full only |
| `chrome-light` | Desktop Chrome | `light` | full only |
| `firefox-mobile-light` | Mobile Firefox (Android) | `light` | full only |
| `noscript` | Desktop Chrome | — (JS off) | full only |

**Rationale:** Quick tier (2 projects) covers one desktop + one mobile, one light + one dark. Full tier runs all 6 projects for comprehensive cross-browser/device/scheme coverage. Noscript stays in full only (not needed for fast feedback).

### Snapshot Impact
All existing baselines become orphaned (project names change). This is acceptable — baselines will be regenerated after the UnoCSS migration anyway. The config matrix baselines are also fresh.

---

## 2. Two-Tier Test Commands

### `bun run test` (Quick — iterative dev)
```bash
cd theme/starter && bunx playwright test \
  --project=firefox-light --project=chrome-mobile-dark \
  --reporter=list
```
- 2 projects × ~19 test files = fast feedback
- Default starter config only
- Catches layout breakage, visual regressions, interaction failures

### `bun run test:full` (Pre-release)
```bash
cd theme/starter && bunx playwright test --reporter=list
```
- All 6 projects × all test files
- Default starter config only
- Catches cross-browser/device/scheme regressions

### `bun run test:matrix` (Config matrix)
```bash
cd theme/starter && bun run scripts/test-config-matrix.ts
```
- Builds once per config, runs matrix tests against each
- Separate Playwright config (`playwright.matrix.config.ts`)
- Can run standalone or appended to `test:full`

### `bun run test:release` (Everything)
```bash
bun run test:full && bun run test:matrix
```

---

## 3. Config Matrix Infrastructure

### 3a. Modify `virtualConfig.ts` — Add `THEME_CONFIG_PATH` support

**File:** `theme/src/freelance-persona/plugins/virtualConfig.ts`

Two lines changed in `configResolved` and `load` hooks:
```typescript
// Before (hardcoded):
const configPath = path.join(projectRoot, 'src', 'freelance-persona.config.ts');

// After (env var override):
const configPath = process.env.THEME_CONFIG_PATH
  ? path.resolve(process.env.THEME_CONFIG_PATH)
  : path.join(projectRoot, 'src', 'freelance-persona.config.ts');
```

Both the `configResolved` hook (for `parseConfig`) and the `load` hook (for full config content) must use the same path resolution. This is backward-compatible — if `THEME_CONFIG_PATH` is not set, behavior is identical to today.

### 3b. Matrix Build Script

**File:** `theme/starter/scripts/test-config-matrix.ts`

```
For each config file in testing/configs/*.ts (sorted):
  1. Resolve absolute path to config file
  2. Derive CONFIG_NAME from filename (e.g., config-colors.ts → config-colors)
  3. Kill any existing server: fuser -k 4321/tcp 2>/dev/null
  4. Set THEME_CONFIG_PATH=<absolute-path>
  5. Run: PLAYWRIGHT_TEST=true THEME_CONFIG_PATH=<path> bun run build
  6. Start preview server on port 4321
  7. Wait for server ready
  8. Run: CONFIG_NAME=<name> bunx playwright test --config=playwright.matrix.config.ts
  9. Kill preview server
  10. Report pass/fail for this config
```

Error handling: always kill preview server in `finally` block. If a config fails, continue to next (don't abort entire matrix).

### 3c. Matrix Playwright Config

**File:** `theme/starter/playwright.matrix.config.ts`

```typescript
export default defineConfig({
  testDir: './testing/tests',
  testMatch: /config-matrix\.spec\.ts/,  // Only matrix tests
  fullyParallel: false,                    // Sequential within config
  retries: 0,
  reporter: [['html', { outputFolder: 'testing/playwright-report-matrix' }], ['list']],
  outputDir: './testing/test-results-matrix',

  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },

  expect: {
    toHaveScreenshot: {
      threshold: 0.3,
      maxDiffPixels: 200,
      animations: 'disabled',
    },
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox-dark', use: { ...devices['Desktop Firefox'], colorScheme: 'dark' } },
  ],

  webServer: {
    command: 'echo "Server managed by test-config-matrix.ts"',
    url: 'http://localhost:4321',
    reuseExistingServer: true,  // Matrix script manages the server
    timeout: 5 * 1000,
  },
});
```

**Why only 2 projects for matrix?** The config matrix tests programmatic verification (CSS vars, DOM attributes) + visual regression. Cross-browser visual differences are handled by the full tier. The matrix just needs to prove "different config → different output." Chromium catches layout/color issues; firefox-dark catches dark mode color propagation.

### 3d. Verification Utility

**File:** `theme/starter/testing/utils/verify-config.ts`

```typescript
import { expect, type Page, type TestInfo } from '@playwright/test';

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export interface ConfigExpectation {
  // CSS custom property values (checked via getComputedStyle on :root)
  // Only verified in light-scheme projects
  cssVars?: Record<string, string>;

  // Dark mode CSS vars (checked only in dark-scheme projects)
  darkCssVars?: Record<string, string>;

  // Font families (checked via getComputedStyle on target elements)
  fonts?: Record<'headings' | 'body' | 'navigation' | 'monospace', string>;

  // Font sizes (checked via getComputedStyle on target elements)
  // Keys are CSS selectors, values are computed pixel values (e.g., "40px")
  fontSizes?: Record<string, string>;

  // Contact form (checked via DOM attributes)
  contactForm?: {
    action?: string;
    provider?: string;
    checkboxCount?: number;
  };

  // Animation config (checked via data-animations attribute on <html>)
  // Requires BaseLayout change to emit data-animations="disabled" when disabled
  animationsEnabled?: boolean;

  // Page title (checked via page.title())
  title?: string;
}

export async function verifyConfigApplied(page: Page, expected: ConfigExpectation, testInfo: TestInfo) {
  // Determine project color scheme
  const isDarkProject = testInfo.project.name.includes('dark') || 
                        testInfo.project.use?.colorScheme === 'dark';

  // 1. CSS Custom Properties — computed on :root (light mode only)
  //    CSS-tooling-agnostic: works with Bootstrap, UnoCSS, raw CSS, anything
  //    Only verify light mode vars in light-scheme projects (dark mode overrides them in dark projects)
  if (!isDarkProject) {
    for (const [varName, expectedValue] of Object.entries(expected.cssVars ?? {})) {
      const actual = await page.evaluate((name) =>
        getComputedStyle(document.documentElement).getPropertyValue(name).trim(), varName);
      expect(actual).toBe(expectedValue);
    }
  }

  // 2. Dark mode CSS vars — only verify in dark-scheme projects
  if (expected.darkCssVars && isDarkProject) {
    for (const [varName, expectedValue] of Object.entries(expected.darkCssVars)) {
      const actual = await page.evaluate((name) =>
        getComputedStyle(document.documentElement).getPropertyValue(name).trim(), varName);
      expect(actual).toBe(expectedValue);
    }
  }

  // 3. Font families — computed on target elements
  const fontTargets = {
    headings: 'h1',
    body: 'body',
    navigation: 'nav a',
    monospace: 'code',
  };
  for (const [role, font] of Object.entries(expected.fonts ?? {})) {
    const selector = fontTargets[role];
    const actual = await page.locator(selector).first().evaluate(
      el => getComputedStyle(el).fontFamily);
    expect(actual).toContain(font);
  }

  // 4. Font sizes — computed on target elements
  //    Values must be in computed pixels (e.g., "40px" not "2.5rem")
  for (const [selector, expectedSize] of Object.entries(expected.fontSizes ?? {})) {
    const actual = await page.locator(selector).first().evaluate(
      el => getComputedStyle(el).fontSize);
    expect(actual).toBe(expectedSize);
  }

  // 5. Contact form
  if (expected.contactForm) {
    const form = page.locator('form.contact-form');
    if (expected.contactForm.provider) {
      await expect(form).toHaveAttribute('data-provider', expected.contactForm.provider);
    }
    if (expected.contactForm.action) {
      await expect(form).toHaveAttribute('action', expected.contactForm.action);
    }
    if (expected.contactForm.checkboxCount !== undefined) {
      const count = await form.locator('input[type="checkbox"]').count();
      expect(count).toBe(expected.contactForm.checkboxCount);
    }
  }

  // 6. Animation config — check data-animations attribute on <html>
  //    Requires BaseLayout to emit data-animations="disabled" when scroll_animations.enabled === false
  if (expected.animationsEnabled === false) {
    await expect(page.locator('html')).toHaveAttribute('data-animations', 'disabled');
  }

  // 7. Page title
  if (expected.title) {
    await expect(page).toHaveTitle(new RegExp(escapeRegex(expected.title)));
  }
}
```

**Key design decisions:**
- `getComputedStyle` is the universal API — doesn't care what CSS tool generates the styles
- CSS vars are the contract between config and rendered output
- DOM checks only for things CSS vars can't capture (form actions, checkbox counts)
- No class-name assertions, no framework-specific selectors

### 3e. Expectations File

**File:** `theme/starter/testing/configs/expectations.ts`

One file mapping config names to their expectations. Co-located with configs, single place to review/edit.

```typescript
import type { ConfigExpectation } from '../utils/verify-config';

export const expectations: Record<string, ConfigExpectation> = {
  'config-colors': {
    title: 'Config: Colors',
    cssVars: {
      // Light mode (verified in light-scheme projects only)
      '--accent-color': '#e63946',
      '--background-color': '#ffffff',
      '--surface-color': '#ffffff',
      '--default-color': '#272829',
      '--heading-color': '#45505b',
    },
    darkCssVars: {
      // Dark mode neon values (verified only in dark-scheme projects)
      '--background-color': '#ff0000',
      '--surface-color': '#00ff00',
      '--default-color': '#ffff00',
      '--heading-color': '#00ffff',
      '--accent-color': '#ff00ff',
      '--card-background': '#0000ff',
    },
  },

  'config-fonts': {
    title: 'Config: Fonts',
    fonts: {
      headings: 'Courier New',
      body: 'Georgia',
      navigation: 'Impact',
      monospace: 'Monospace',
    },
    fontSizes: {
      '.section-title h2': '40px',  // 2.5rem computed (vs default 2rem = 32px)
    },
  },

  'config-layout': {
    title: 'Config: Layout',
    cssVars: {
      '--global-margin-left': '2rem',
      '--global-margin-right': '1rem',
      '--nav-pill-expanded-width': '8rem',
      '--nav-menu-width': '6rem',  // vs default 8.75rem
    },
  },

  'config-contact': {
    title: 'Config: Contact',
    contactForm: {
      provider: 'mailto',
      action: 'mailto:contact-test@example.com',
      checkboxCount: 2,  // vs starter's 1
    },
  },

  'config-noanim': {
    title: 'Config: No Animations',
    animationsEnabled: false,
  },
};
```

---

## 4. Config Redesign (5 configs)

The existing 5 configs are placeholder quality from Nemotron. Issues:
- `config-colors.ts` line 116: Unicode quote corruption (`"Sole Proprietor"`)
- `config-colors.ts` light mode values are nearly identical to starter defaults
- `config-hero.ts` is misnamed — tests layout, not hero-specific
- None test `fonts.sizes.*`
- `mathjax.packages` uses `nocomplain` (not a real package)
- All use `mailto` for contact (no differentiation)

### Redesigned Configs

#### 4a. `config-colors.ts` — Color Pipeline
**Proves:** All `colors.light.*` and `colors.dark.*` → CSS custom properties

- Light: Keep realistic values but make accent distinctly different from default (`#e63946` red instead of `#0563bb` blue)
- Dark: Neon high-contrast (keep the red/green/yellow/cyan/magenta/blue scheme — it's unmistakable)
- Verify: ~10 key CSS vars in light mode, ~10 in dark mode (not all 25+ — pick the ones that prove the pipeline works)
- Fonts/layout: Use defaults (don't test multiple things at once)

#### 4b. `config-fonts.ts` — Font Pipeline
**Proves:** `fonts.headings/body/navigation/monospace` + `fonts.sizes.*` → CSS custom properties

- Use comma-containing font stacks to test the BaseLayout comma-detection logic:
  - `headings: '"Courier New", Courier, monospace'`
  - `body: '"Georgia", serif'`
  - `navigation: '"Impact", "Arial Black", sans-serif'`
  - `monospace: '"Monospace", monospace'`
- Add `fonts.sizes` overrides:
  - `heading: "2.5rem"` (40px, vs default 2rem/32px)
  - `title: "3rem"` (48px, vs default 4rem/64px)
- **Programmatic verification**: `getComputedStyle` checks:
  - Font family on `h1`, `body`, `nav a`, `code` — verifies CSS vars propagated
  - Font size on `.section-title h2` — verifies `--heading-font-size` (computed as `"40px"`)
- **Visual regression**: The weird/distinct fonts (Courier New, Georgia, Impact) make any "this text is using the wrong font" issue glaringly obvious. If a text area that should use body font suddenly uses heading font, the visual diff will catch it immediately.

#### 4c. `config-layout.ts` (renamed from config-hero) — Layout Pipeline
**Proves:** `visuals.layout.*` → CSS custom properties

- `page_margin_left: "2rem"` (vs default `8.875rem`) — dramatic visual difference
- `page_margin_right: "1rem"` (tests the right margin var too)
- `nav_pill_expanded_width: "8rem"` (vs default `10.35rem`)
- `nav_menu_width: "6rem"` (vs default `8.75rem`)
- Verify: `--global-margin-left`, `--global-margin-right`, `--nav-pill-expanded-width`, `--nav-menu-width`

#### 4d. `config-contact.ts` — Contact Form Pipeline
**Proves:** `contact_form.provider` + `checkboxes` → DOM output

- `provider: "mailto"`, `action: "mailto:contact-test@example.com"`
- 2 checkboxes (vs starter's 1) to prove count differs
- Verify: form `action` attribute, checkbox count

#### 4e. `config-noanim.ts` — Animation Pipeline
**Proves:** `visuals.scroll_animations.enabled: false` → DOM attribute

- Only config difference: `scroll_animations.enabled: false`
- **Requires BaseLayout change**: Add `data-animations="disabled"` to `<html>` when config disables animations
- Verify: `await expect(page.locator('html')).toHaveAttribute('data-animations', 'disabled')`
- Visual regression: should look identical to default (test mode already disables animations via CSS)

---

## 5. `config-matrix.spec.ts` Rewrite

**File:** `theme/starter/testing/tests/config-matrix.spec.ts` (remove `.skip`)

```typescript
import { test, expect } from '@playwright/test';
import { expectations } from '../configs/expectations';
import { verifyConfigApplied } from '../utils/verify-config';

// CONFIG_NAME is set by the matrix build script
const configName = process.env.CONFIG_NAME;

if (configName && expectations[configName]) {
  const expected = expectations[configName];

  test.describe(`Config Matrix: ${configName}`, () => {
    test('Config settings propagate correctly (programmatic)', async ({ page }, testInfo) => {
      await page.goto('/');
      await page.waitForLoadState('load');
      await verifyConfigApplied(page, expected, testInfo);
    });

    test('Homepage renders with config (visual)', async ({ page }, testInfo) => {
      await page.goto('/');
      await page.waitForLoadState('load');
      if (testInfo.project.name !== 'noscript') {
        await page.evaluate(() => document.fonts.ready).catch(() => {});
      }
      await page.waitForTimeout(500);
      await expect(page).toHaveScreenshot(`matrix-${configName}-home.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.15,
        mask: [
          page.locator('.typing-lock'),
          page.locator('.typed-cursor'),
          page.locator('.mascot-container'),
          page.locator('.hero .typing-wrapper'),
        ],
      });
    });

    test('Blog post renders with config (visual)', async ({ page }, testInfo) => {
      await page.goto('/posts/lancy-intro');
      await page.waitForLoadState('load');
      if (testInfo.project.name !== 'noscript') {
        await page.evaluate(() => document.fonts.ready).catch(() => {});
      }
      await page.waitForTimeout(500);
      await expect(page).toHaveScreenshot(`matrix-${configName}-blog-post.png`, {
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
} else {
  test.skip('Config matrix not active (set CONFIG_NAME env var)', () => {});
}
```

---

## 6. Implementation Order

| # | Task | Files | Est. |
|---|------|-------|------|
| 1 | Restructure Playwright projects in `playwright.config.ts` | `playwright.config.ts` | 30min |
| 2 | Add `test`, `test:full`, `test:matrix`, `test:release` scripts | `package.json` (starter) | 15min |
| 3 | Add `THEME_CONFIG_PATH` to `virtualConfig.ts` | `virtualConfig.ts` | 15min |
| 4 | Add `data-animations` attribute to `<html>` in BaseLayout | `BaseLayout.astro` | 15min |
| 5 | Create `playwright.matrix.config.ts` | new file | 30min |
| 6 | Create `testing/utils/verify-config.ts` | new file | 1h |
| 7 | Create `testing/configs/expectations.ts` | new file | 30min |
| 8 | Redesign 5 config files (fix issues, add font sizes, rename hero→layout) | `testing/configs/*.ts` | 1h |
| 9 | Rewrite `config-matrix.spec.ts` (remove .skip) | `config-matrix.spec.ts` | 1h |
| 10 | Create `scripts/test-config-matrix.ts` | new file | 1.5h |
| 11 | Update `AGENT.md` with new test commands | `AGENT.md` | 15min |
| 12 | Run quick tier, fix failures, generate baselines | — | 1h |
| 13 | Run full tier, fix failures, generate baselines | — | 1h |
| 14 | Run matrix, fix failures, generate baselines | — | 2h+ |
| **Total** | | | **~9-10h** |

---

## 7. Open Questions

1. **`astroMajorVersion` import resolution**: The config files import `astroMajorVersion` from `astro-freelance-persona_theme/utils/buildInfo`. When the config file is outside `src/` via `THEME_CONFIG_PATH`, Vite resolves package imports from the project root's `node_modules`. This should work, but needs verification during implementation. If it fails, we can hardcode the version string in test configs (it's only used for the title).

---

## 8. Implementation Notes

- **`firefox-mobile-light` device composition**: Playwright has no built-in "Mobile Firefox" device. Compose it as:
  ```typescript
  {
    name: 'firefox-mobile-light',
    use: {
      ...devices['Pixel 5'],
      browserName: 'firefox',
      colorScheme: 'light',
    },
  }
  ```

- **Add this comment to `config-matrix.spec.ts`** (or a shared test utility) so the next person touching matrix tests understands the mobile config landscape:
  ```typescript
  // NOTE: Mobile-specific theme config knobs do NOT exist.
  // Mobile drawer width, button sizes, and border widths are hardcoded in base.scss.
  // The only mobile-specific color (nav_mobile_background) appears unused.
  // Mobile hero positioning settings (mobile_position_y, mobile_text_align, etc.)
  // exist in the content schema (hero.md frontmatter), not the theme config.
  // These are already tested by hero-config.spec.ts.
  // The matrix tests focus on proving theme config → page pipeline.
  // If a theme config works on desktop, it works on mobile (same CSS vars, same DOM).
  ```

- **Matrix script port handling**: Kill any existing server before each build to prevent zombie processes:
  ```typescript
  execSync('fuser -k 4321/tcp 2>/dev/null || true');
  ```
  Also in the `finally` block after tests complete.

- **Font-size verification**: `getComputedStyle().fontSize` returns computed pixels (e.g., `"40px"`), not CSS declaration values (e.g., `"2.5rem"`). Expectations must use pixel values.

- **Contact form selector**: Use `form.contact-form` (matches existing `config.spec.ts` pattern), not bare `form`.

- **Tier assignments**: `chrome-mobile-dark` is in BOTH quick and full tiers. The quick tier uses `--project` flags to select only 2 projects. The full tier runs all projects (no filter).

---

## 9. Mobile Config — Not Needed

Investigation revealed **no mobile-specific theme config knobs exist**. The mobile drawer width, button sizes, and border widths are all hardcoded in `base.scss`. The only mobile-specific color (`nav_mobile_background`) appears unused in the current stylesheets.

**Mobile hero positioning settings** (`mobile_position_y`, `mobile_text_align`, `mobile_padding_bottom`, `mobile_image_object_position`) exist in the **content schema** (hero markdown frontmatter), not the theme config. These are already tested by `hero-config.spec.ts` which reads the hero content and verifies mobile settings are applied.

**Decision**: All matrix configs are desktop-focused. Mobile coverage comes from the full tier's `chrome-mobile-dark` and `firefox-mobile-light` projects running all tests. If a theme config works on desktop, it works on mobile (same CSS vars, same DOM). Visual regression at mobile viewports catches any responsive issues. Content-level mobile settings (hero positioning) are tested separately by `hero-config.spec.ts`.

---

## 10. CSS-Tooling-Agnostic Verification Philosophy

The verification approach is deliberately decoupled from any CSS framework:

- **CSS custom properties** are the contract. Config → `BaseLayout.astro` inline `<style>` → `var(--*)`. This pipeline doesn't change whether Bootstrap, UnoCSS, or raw SCSS consumes the vars.
- **`getComputedStyle`** reads the final computed value regardless of how it was generated.
- **DOM attribute checks** (form action, checkbox count) verify non-CSS config consumption.
- **Visual regression** catches everything else (layout, spacing, responsive behavior).

This means after the UnoCSS migration, the same verification utility works unchanged. Only the visual regression baselines need updating (which is expected).
