<!--
SPDX-FileCopyrightText: 2026 2026 The freelance-persona_theme Project Contributors

SPDX-License-Identifier: MIT
-->

# 🤖 AGENT KNOWLEDGE BASE & OPERATIONAL RULES

> **SYSTEM INSTRUCTION:** This file is the single source of truth for recurring issues, project-specific workflows, and latent tribal knowledge. **Before starting any task, you MUST check this file.**
>
> **META-RULE:** If you encounter a recurring issue or a "gotcha" that cost you time/tokens, YOU MUST UPDATE THIS FILE with a new rule or debugging hint to prevent future agents from failing in the same way.

---

## 🚨 CRITICAL OPERATIONAL RULES

### 1. Manual dev or build and preview server

- **Manual Verification:** If you want view the site manually via the browser:
  - `pkill -f "bun run dev"; pkill -f "bun run preview"; rm -rf playground; mkdir -p playground/; cp -a theme/starter/. playground/; bun install; fuser -k 4321/tcp; bun run dev`
  - `pkill -f "bun run dev"; pkill -f "bun run preview"; rm -rf playground; mkdir -p playground/; cp -a theme/starter/. playground/; bun install; bun run build; fuser -k 4321/tcp; bun run preview`
  - **Full Rebuild & Test:** `pkill -f "bun run dev"; pkill -f "bun run preview"; rm -rf playground; mkdir -p playground/; cp -a theme/starter/. playground/; bun install; fuser -k 4321/tcp; bun run test --reporter=list`

### 2. ⚡ Server Management (Automated)

> [!IMPORTANT]
> **Playwright is configured to auto-start the server.** logic: `bun run build; bun run preview`.

- **Auto-Server:** You generally do **NOT** need to manually start a server for tests. Just run `bun x playwright test`, use this in the commands outlined in 1. instead of `bun run dev --reporter=list`(list is strictly needed!). the pkill ... is stricly needed to insure we test against a clean state.
- **Manual Verification:** If you *must* open the site manually:
  - ✅ **Preferred:** `bun run build; bun run preview` (Matches test environment).
  - ⚠️ **Dev Mode:** `bun run dev` (Only for rapid iteration, may differ from build).
- **Port Conflicts:** If `4321` is taken by a zombie process, tests/server will fail.
  - **Fix:** `fuser -k 4321/tcp; fuser -k 4322/tcp;`

### 3. 🧪 Testing Standards (Playwright)

- **Directory:** Tests are in `theme/starter/testing/tests/` (part of the starter template).
- **Config:** `theme/starter/playwright.config.ts` handles the `webServer`, `noscript` project, and default reporters.
- **Reporting:** **ALWAYS** use `--reporter=list` or `--reporter=line` to prevent hanging the terminal validation.
- **Dynamic Content Parsing:** Tests use `testing/utils/content-parser.ts` to read expected values from content files dynamically. **NEVER** hardcode content values in tests.
- **NoScript Testing:**
  - Used for verification of graceful degradation.
  - Project: `bun x playwright test --project=noscript`
  - **Rule:** Preloader must be hidden (`display: none`), Content must be visible (`opacity: 1`).
- **Path Aliases:** Tests use `@/*` (e.g., `import { themeConfig } from '@/freelance-persona.config'`) which maps to `src/*` in the starter context.

### 4. 📦 Project Architecture (Monorepo)

- **Runtime:** `bun` (Strictly).
- **Structure:**
  - `.` (Root): Workspace root.
  - `theme/`: Source code.
  - `theme/starter/`: Public template / active dev content.
  - `theme/starter/testing/`: Playwright test suite (included in template for users).
  - `playground/`: **Ephemeral/Git-ignored**. Use for throwaway tests only.
- **Aliases (STRICT):** `tsconfig.json` defines `@theme` and `@starter`. Starter defines `@/*` and `@content/*`. **Use them.**
- **Path Aliases:**
  - **Strict Requirement:** ALL `tsconfig.json` files (theme, starter) MUST explicitly define path aliases.
  - **Rule:** always include `"paths": { "@/*": ["src/*"] }` in `compilerOptions`.
  - **Reason:** Astro aliases (like `@/assets`) fail in monorepo workspaces if the consuming project (playground) doesn't have the explicit mapping to its own `src`.
  - **Prefer Path Aliases:** Use path aliases (`@/assets/img/avatar.jpg`) instead of relative paths (`../../assets/img/avatar.jpg`) for better code maintainability and to avoid issues with nested directory structures, relative paths are considered bad practice!
- **Path Aliases:**
  - **Strict Requirement:** ALL `tsconfig.json` files (theme, starter) MUST explicitly define path aliases.
  - **Rule:** always include `"paths": { "@/*": ["src/*"] }` in `compilerOptions`.
  - **Reason:** Astro aliases (like `@/assets`) fail in monorepo workspaces if the consuming project (playground) doesn't have the explicit mapping to its own `src`.
  - **Prefer Path Aliases:** Use path aliases (`@/assets/img/avatar.jpg`) instead of relative paths (`../../assets/img/avatar.jpg`) for better code maintainability and to avoid issues with nested directory structures, relative paths are considered bad practice!

---

## 🧠 DESIGN PATTERNS

### 1. 📂 Flat Blog Routing (Regression Prevention)

- **Requirement:** Users must be allowed to organize `blog_posts/` with any folder structure (e.g., `blog_posts/archive/2025/post.md`).
- **Route Generation:** `BlogPost.astro` `getStaticPaths` MUST flatten the ID: `post.id.split('/').pop()`.
- **Link Generation:** All `href` attributes linking to posts MUST also flatten: `/posts/${post.id.split('/').pop()}`.
  - **Affected components:** `FilteredPostsSection`, `BlogCategoriesSection`, `[BlogCategory]`, `BlogSidebar`.
- **Result:** URL is always `/posts/post-name` regardless of depth. Do NOT use raw `post.id` in links.

### 2. 🎨 Styling & NoScript

- **prefer native** if there  is a way to do something in a sensible modern or even bleeding edge way without javascript then drop the javascript!
- **SCSS:** Prefer `_partial.scss` over inline `<style>`.
- **NoScript Fallback:**
  - `BaseLayout.astro` contains a `<noscript>` block.
  - It forces `[data-reveal] { opacity: 1 !important }` so content is visible without JS animations.

### 3. 📋 Content Schema & Privacy

- **Attribution:** `img_credit` and `img_license` are **REQUIRED** for all content images (Hero, Blog, Avatar).
- **Date Formatting:** Strict `dd Mon yyyy` (e.g., `01 Jan 2026`) for visual consistency.
- **Privacy:** No external CDNs. Minimal JS.

### 4. User-Centric Routing

- **Rule:** Links must match user content, not internal file IDs.
  - **Bad:** Link "Blog" -> `/blog-categories`
  - **Good:** Link "Blog" -> `/blog`

### 5. 🅰️ Icon Fonts & Text Cursor

- **Problem:** Browsers may treat icon fonts (like Bootstrap Icons) as selectable text, showing a blinking caret or text selection highlight on focus.
- **Solution:** Explicitly disable text behavior on the interactive element.

  ```css
  .icon-button {
    caret-color: transparent; /* Hides blinking cursor */
    user-select: none;        /* Prevents text selection */
    -webkit-user-select: none;
    outline: none;            /* Remove default focus ring (replace with custom) */
  }
  /* Optional: Double safety for children */
  .icon-button > * { pointer-events: none; }
  ```

---

## 🛠️ TROUBLESHOOTING

### 🚧 Cache & Schema Issues

**Symptom:** Props missing, schema validation errors, or weird type mismatches.
**Fix:** The Vite/Astro cache is likely stale. Perform a CLEAN REBUILD:

```fish
pkill -f "bun run dev"; rm -rf playground; mkdir -p playground/; cp -a theme/starter/. playground/; bun install; bun run dev
```

### 🧩 Content Collections in Monorepos

**Symptom:** Theme schema updates are ignored by `playground` or `starter`.
**Fix:** Ensure `starter/src/content.config.ts` re-exports the theme's collections:

```typescript
export { collections } from 'astro-freelance-persona_theme/content.config';
```

### 📄 REUSE Compliance in Astro

**Symptom:** Astro complains about "Unsupported file type" for `*.astro.license` sidecar files.
**Rule:** Do **NOT** use sidecar `.license` files or `.reuse/dep5` for `.astro` pages.
**Fix:** Add the SPDX header directly to the `.astro` file frontmatter:

```astro
---
// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT
---
```

### 👻 Ghost Servers

**Symptom:** 404s on existing pages, changes not reflecting.
**Cause:** `bun` started on port `4322` because `4321` is zombie.
**Fix:** `fuser -k 4321/tcp; fuser -k 4322/tcp;`

### 🎭 Theme Dropdown Backdrop Blocks Test Clicks

**Symptom:** `label.theme-label-dark.click({ force: true })` times out or fails silently in theme tests even though the dropdown is "visible".
**Cause:** When the checkbox toggle is checked (dropdown open), a **200vw × 200vh fixed backdrop** (`.theme-menu-backdrop`, z-index 98) covers the entire page. Playwright's `click({ force: true })` bypasses actionability checks but CDP-level coordinate clicks can still be intercepted by this backdrop.
**Fix:** Use `.dispatchEvent('click')` instead of `.click({ force: true })`. This fires the event directly on the DOM element, completely bypassing the backdrop layer.

### 📱 Mobile Popover — Nav Toggle Only Opens, Never Closes

**Symptom:** Clicking `.nav-toggle` to close the mobile popover does nothing (popover stays open).
**Cause:** The `.nav-toggle` button has `command="show-popover"` only. It cannot close the popover.
**Fix:** Use `button.nav-close[aria-label="Close navigation menu"]` to close, and `page.keyboard.press('Escape')` for light-dismiss testing.
