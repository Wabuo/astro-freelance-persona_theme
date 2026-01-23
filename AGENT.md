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
  - `pkill -f "bun run dev"; pkill -f "bun run preview"; rm -rf playground; mkdir -p playground/; cp -a theme/starter/. playground/; bun install; bun run dev`
  - `pkill -f "bun run dev"; pkill -f "bun run preview"; rm -rf playground; mkdir -p playground/; cp -a theme/starter/. playground/; bun install; bun run build; bun run preview`

### 2. ⚡ Server Management (Automated)

> [!IMPORTANT]
> **Playwright is configured to auto-start the server.** logic: `bun run build; bun run preview`.

- **Auto-Server:** You generally do **NOT** need to manually start a server for tests. Just run `bun x playwright test`.
- **Manual Verification:** If you *must* open the site manually:
  - ✅ **Preferred:** `bun run build; bun run preview` (Matches test environment).
  - ⚠️ **Dev Mode:** `bun run dev` (Only for rapid iteration, may differ from build).
- **Port Conflicts:** If `4321` is taken by a zombie process, tests/server will fail.
  - **Fix:** `fuser -k 4321/tcp; fuser -k 4322/tcp;`

### 3. 🧪 Testing Standards (Playwright)

- **Directory:** Tests are in `testing/tests/`.
- **Config:** `playwright.config.ts` handles the `webServer`, `noscript` project, and default reporters.
- **Reporting:** **ALWAYS** use `--reporter=list` or `--reporter=line` to prevent hanging the terminal validation.
- **NoScript Testing:**
  - Used for verification of graceful degradation.
  - Project: `bun x playwright test --project=noscript`
  - **Rule:** Preloader must be hidden (`display: none`), Content must be visible (`opacity: 1`).
- **Path Aliases:** Tests **MUST** use `@starter/*` (e.g., `import { themeConfig } from '@starter/freelance-persona.config'`) instead of fragile relative paths (`../../theme/starter/...`).

### 4. 📦 Project Architecture (Monorepo)

- **Runtime:** `bun` (Strictly).
- **Structure:**
  - `.` (Root): Workspace root.
  - `theme/`: Source code.
  - `theme/starter/`: Public template / active dev content.
  - `testing/`: Dedicated test suite & artifacts.
  - `playground/`: **Ephemeral/Git-ignored**. Use for throwaway tests only.
- **Aliases (STRICT):** `tsconfig.json` defines `@theme` and `@starter`. **Use them.**
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
- **Implementation:** `BlogPost.astro` logic MUST flatten the ID: `post.id.split('/').pop()`.
- **Result:** URL is always `/posts/post-name` regardless of depth. Do NOT introduce nested URLs (like `/posts/archive/...`) for blog posts.

### 2. 🎨 Styling & NoScript

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
