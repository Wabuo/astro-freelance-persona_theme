# Production Readiness Audit & Implementation Plan (Final)

## Executive Summary

**Current**: Alpha 0.1.0-alpha.8 → **Target**: Beta 0.1.0-beta.0
**Mode**: Single session, iterative, plan kept updated, you apply jj commits

---

## 🔴 Critical - Beta Blockers (Phase 1)

### 1.1 SEO: Sitemap + Robots.txt
**Goal**: Legal pages indexed, **never cached** (no stale legal text liability)

```javascript
// theme/starter/astro.config.mjs
import sitemap from '@astrojs/sitemap';
import robotsTxt from '@astrojs/robots-txt';

integrations: [
  freelancePersona(),
  sitemap({ filter: () => true, changefreq: 'weekly', priority: 0.7, lastmod: new Date() }),
  robotsTxt({ userAgent: '*', allow: '/' }), // No disallow - legal must be indexed
]
```

**Legal page meta** (in BaseLayout or legal pages):
```astro
{pageType === 'legal' && <meta name="robots" content="noarchive, nosnippet" />}
```
- `noarchive` = no cached version in SERPs
- `nosnippet` = respects `data-nosnippet` on email elements

### 1.2 Legal Emails: `data-nosnippet` Only
**File**: `theme/src/freelance-persona/pages/legal/legal-notice.astro:74-79`, `privacy-policy.astro:67-73`
```astro
<span data-nosnippet><strong>Email:</strong> {legalEmail}</span>
```
Plain text stays (legal requirement), `data-nosnippet` prevents SERP snippets.

### 1.3 MathJax Fonts: Self-Hosted via Astro 7 Asset Pipeline
**Package**: `@mathjax/mathjax-newcm-font@4`
**Method**: Import in integration, let Astro/Vite handle via asset pipeline (like @fontsource)
```bash
bun add -D @mathjax/mathjax-newcm-font@4
```
```typescript
// integration.ts - import font CSS, Vite processes woff2 via ?url
import '@mathjax/mathjax-newcm-font@4/css/mathjax-newcm-font.css';
// fontURL becomes: '/_astro/mathjax-newcm-font.[hash].woff2' (auto)
```

### 1.4 Dynamic Font Preloads (Remove Hardcoded Raleway/Poppins/Roboto)
**File**: `theme/src/freelance-persona/layouts/BaseLayout.astro:154-164`
```astro
const fontPreloads: string[] = [];
const fontMap = {
  heading: { raleway: raleway700Url },
  navigation: { poppins: poppins300Url },
  body: { roboto: roboto400Url },
};
Object.entries(fontMap).forEach(([role, fonts]) => {
  const configured = cleanFontName(themeConfig.fonts?.[role]);
  Object.entries(fonts).forEach(([name, url]) => {
    if (configured === name) fontPreloads.push(url);
  });
});
```

### 1.5 Legal Pages: Conditional Routes (No Redirect)
**Files**: `legal-notice.astro`, `privacy-policy.astro`
```astro
export async function getStaticPaths() {
  const { legal } = await import('@freelance-persona/config');
  if (!legal?.enabled || !legal?.privacy_enabled) return [];
  return [{ params: {}, props: {} }];
}
```
- Routes don't exist when disabled
- Nav links already hidden (existing logic)
- Custom links → natural 404 (admin error)

---

## 🟠 High - Architecture Cleanup (Phase 2)

### 2.1 Virtual Config Module (Replace Regex + File Write)
**Files**: `integration.ts`, new `virtual-config.ts`
```typescript
// virtual:freelance-persona-config (Vite virtual module)
export const mathPackages = ['mhchem', 'physics', 'color', 'cancel', 'mathtools'];
export const codeBlocksConfig = { frames: { enabled: true, showCopyButton: true, defaultFrame: 'code' }, lineNumbers: false };

// integration.ts - Vite plugin hook
const virtualModuleId = 'virtual:freelance-persona-config';
return {
  name: 'freelance-persona-config',
  resolveId(id) { if (id === virtualModuleId) return virtualModuleId; },
  load(id) { if (id === virtualModuleId) return virtualModuleCode; },
};
```
Consumers: `remarkMagicMath.ts`, Expressive Code config.

### 2.2 Extract Utility Modules (Zero Runtime Cost)
```
utils/
├── animations.ts          # IntersectionObserver engine
├── imagePreload.ts        # getImage wrapper (build-time only)
├── contactForm.ts         # Provider URL resolution (build-time)
├── dropdown.ts            # Shared popover/checkbox logic
└── linkUtils.ts           # Verify completeness
```

### 2.3 Modernize Share Menu (Reuse Dropdown Module)
**File**: `theme/src/freelance-persona/components/ui/ShareMenu.astro`
```astro
<div class="share-menu-wrapper">
  <button popovertarget="share-menu" aria-label="Share"><Icon name="bi:share" /></button>
  <div popover id="share-menu" class="share-dropdown">
    <button class="action-copy-link" data-url={url}>...</button>
    <hr />
    <a href={`https://linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank">...</a>
    <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank">...</a>
    <a href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}>...</a>
  </div>
</div>
```
- Zero JS for open/close (native popover)
- Reuses `dropdown.ts` for light-dismiss, ESC, focus trap
- **Note**: May need adjustment after UnoCSS migration

---

## 🟡 Medium - Bootstrap → UnoCSS Migration (Phase 3)

### 3.1 Add UnoCSS
```bash
bun add -D unocss @unocss/preset-uno @unocss/preset-attributify @unocss/preset-icons @unocss/transformer-directives @unocss/reset
```
```typescript
// uno.config.ts
import { defineConfig, presetUno, presetAttributify, presetIcons, transformerDirectives } from 'unocss';

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetIcons({ collections: { bi: () => import('@iconify-json/bi') } })],
  transformers: [transformerDirectives()],
  theme: { colors: { primary: 'var(--accent-color)' } },
  shortcuts: {
    'container-main': 'mx-auto max-w-7xl px-4',
    'btn-primary': 'px-4 py-2 rounded bg-primary text-white hover:opacity-90 transition',
  },
});
```
```javascript
// astro.config.mjs
import unocss from 'unocss/astro';
integrations: [freelancePersona(), unocss(), sitemap(), robotsTxt()]
```

### 3.2 Systematic Migration (Component by Component)
| Bootstrap | UnoCSS (attributify) |
|-----------|---------------------|
| `d-flex` | `flex` |
| `justify-content-center` | `justify-center` |
| `align-items-center` | `items-center` |
| `gap-3` | `gap-3` |
| `col-lg-4` | `lg:col-span-4` (CSS Grid) |
| `row gy-4` | `grid gap-y-4` |
| `btn btn-primary` | `btn-primary` (shortcut) |

**CSS Grid replaces Bootstrap Grid:**
```astro
<div class="grid gap-4 lg:grid-cols-12">
  <div class="lg:col-span-4">...</div>
  <div class="lg:col-span-8">...</div>
</div>
```

### 3.3 Remove Bootstrap
- Verify no `@import 'bootstrap'` in SCSS
- `bun remove bootstrap @types/bootstrap`
- `bun run check`

---

## 🟢 Low - Polish (Phase 4)

### 4.1 Clean Duplicate SCSS
- Check `_bootstrap-rendered.scss`, `_bootstrap-core.scss` vs `@use "bootstrap-custom"`
- Remove if redundant

### 4.2 Verify Build
```bash
bun run check && bun run build
```

---

## Explicitly NOT in Plan (Per Feedback)
- ❌ Test suite execution (outdated, slow, misleading - fix post-beta)
- ❌ Legal 404 with `noindex` (just hide links via conditional routes)
- ❌ Weeks timeline (single session)
- ❌ Git commits (you apply jj commits I describe)

---

## Definition of Done (Beta)

- [ ] All 5 Critical items resolved
- [ ] `bun run check` passes (strict TypeScript)
- [ ] `bun run build` succeeds
- [ ] Lighthouse CI: Performance ≥90, A11y/BP/SEO = 100 (manual verify)
- [ ] Bundle: JS <50KB gz, CSS <20KB gz
- [ ] Visual regression: manual spot-check
- [ ] `CHANGELOG.md` updated
- [ ] Version bumped to `0.1.0-beta.0`

---

## Execution Protocol

1. **I implement** one task at a time
2. **I verify** with `bun run check && bun run build` after each logical step
3. **You review** when I say ready
4. **Iterate** until accepted
5. **You apply** jj commit/bookmark I describe
6. **Plan updated** after each step (kept in sync)

---

## Next: Your Go-Ahead

Say "build" and I'll start with Phase 1.1 (SEO integrations).