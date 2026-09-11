<!--
SPDX-FileCopyrightText: 2026 2026 The freelance-persona_theme Project Contributors

SPDX-License-Identifier: MIT
-->

# 🤖 AGENT KNOWLEDGE BASE & OPERATIONAL RULES

> **SYSTEM INSTRUCTION:** This file is the single source of truth for recurring issues, project-specific workflows, and latent tribal knowledge. **Before starting any task, you MUST check this file.**
>
> **META-RULE:** If you encounter a recurring issue or a "gotcha" that cost you time/tokens, YOU MUST UPDATE THIS FILE with a new rule or debugging hint to prevent future agents from failing in the same way.

> **META-RULE (user directive):** Do NOT ship hacky solutions silently. Before writing custom plumbing (inline hooks, manual walkers, compensating margins), check for a proper ecosystem/package solution and propose it first. When custom code IS the answer (no ecosystem option, or the package is broken for our stack), SAY SO EXPLICITLY and label it as custom code to maintain — never present it as the normal way.

> **META-RULE (user directive):** The user's working tree is **uncommitted by default** — their manual dial/value tuning is not in git and cannot be recovered from it. Before replacing existing values with new defaults (dial blocks, refactors), **diff the file first and surface what will change**; never silently overwrite. If an overwrite already happened: say so immediately, name what was lost, and help replay it.

> **WHERE THE USER-FACING DOCS LIVE:** `docs/` (repo root) — currently a
> loose pile of snippets and pointers (features, decisions, conventions),
> destined to become a ReadTheDocs-style site. This AGENT.md is the *agent*
> knowledge base; when documenting something for humans, prefer `docs/`.

---

## 🚨 CRITICAL OPERATIONAL RULES

### 1. Manual dev or build and preview server

- **Manual Verification:** If you want to view the site manually via the browser:
  - **Setup / Reset Playground:** `bun run playground:setup`
  - **Dev Server:** `bun run dev`
  - **Build & Preview:** `bun run build; fuser -k 4321/tcp; bun run preview`
  - **astro check** `bun run check`
  - **Full Test, use sparcely:** `bun run test --reporter=list`

### cd ing into the playground should bever be required during normal workflows, we have aliases to work from the root!
- edit something in starter ... reset the playground ... run waht ever u wanted to use

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
- **Config:** `theme/starter/playwright.config.ts` handles the `webServer`, projects, and default reporters.
- **Run from `theme/starter`:** All Playwright tests **MUST** be run from the `theme/starter` directory, not from root or playground.
  - `cd theme/starter && PLAYWRIGHT_TEST=true bun x playwright test --reporter=list`
  - The `PLAYWRIGHT_TEST=true` env var enables test-mode CSS (disables animations, reveals elements).
- **Reporting:** **ALWAYS** use `--reporter=list` or `--reporter=line` to prevent hanging the terminal.
- **Dynamic Content Parsing:** Tests use `testing/utils/content-parser.ts` to read expected values from content files dynamically. **NEVER** hardcode content values in tests.
- **NoScript Testing:**
  - Used for verification of graceful degradation.
  - Project: `bun x playwright test --project=noscript`
  - **Rule:** Preloader must be hidden (`display: none`), Content must be visible (`opacity: 1`).
- **Visual Regression Snapshots:** All reference `*.png` images are git-ignored in the repository via `theme/.gitignore` (`*.png`). They are not committed to Git.
  - To update or generate baseline screenshots locally: run `bun run test --update-snapshots` inside `theme/starter/`.
  - To preserve new/updated snapshots across `bun run playground:setup` resets, copy them back from playground to the starter template:
    `cp -r playground/testing/tests/*-snapshots/ theme/starter/testing/tests/`
- **Always `fuser -k 4321/tcp 4322/tcp` before test runs**: Playwright's
  webServer uses `reuseExistingServer: !CI` — any server already on 4321
  (e.g. a manual `preview`) gets REUSED, silently testing a stale build and
  poisoning re-recorded baselines. EXCEPTION: a manually-started user
  preview must NOT be killed — use `TEST_PORT=<port>` instead (e.g.
  `TEST_PORT=4323 bun run test`), supported by playwright.config.ts,
  playwright.matrix.config.ts and scripts/test-config-matrix.ts.
  Diagnostic tell: content-dependent tests (SEO meta tags, attribution
  locators, error pages) fail en masse = you tested a foreign site/build.
- **Astro 7's `preview` is a persistent daemon** (`astro preview
  stop/status/logs`): a plain `fuser -k` of its port leaves the daemon
  manager convinced a preview is still up, so every later `astro preview`
  prints "Preview server already running at …4321" and exits — regardless
  of `--port`. The config-matrix runner therefore runs `bun run preview
  stop` before every config (see scripts/test-config-matrix.ts); do the
  same in any manual loop, and when a matrix run reports "Preview server
  did not start in time" check for an orphaned daemon first.
- **Never `tail` the Playwright summary short**: the list reporter prints
  `N failed` / `N flaky` ABOVE the `skipped / passed` lines — `tail -2`
  hides failures and makes a red run look green. Capture the full output
  (or grep for `failed`) and cross-check `testing/test-results/` for
  fresh `*-diff.png` artifacts before declaring a run green.
- **Path Aliases:** Tests use `@/*` (e.g., `import { themeConfig } from '@/freelance-persona.config'`) which maps to `src/*` in the starter context.

#### Two-Tier Test Structure

- **Quick Tier (`bun run test`):** 2 projects (firefox-light + chrome-mobile-dark) for fast feedback during development.
- **Full Tier (`bun run test:full`):** All 6 projects for comprehensive cross-browser/device/scheme coverage before release.
- **Config Matrix (`bun run test:matrix`):** Tests 5 config variants to verify config → page pipeline.
- **Release (`bun run test:release`):** Full tier + config matrix.

#### Projects

| Project Name | Device | Color Scheme | Tier |
|---|---|---|---|
| `firefox-light` | Desktop Firefox | `light` | quick + full |
| `chrome-mobile-dark` | Pixel 5 | `dark` | quick + full |
| `firefox-dark` | Desktop Firefox | `dark` | full only |
| `chrome-light` | Desktop Chrome | `light` | full only |
| `firefox-mobile-light` | Mobile Firefox (Android) | `light` | full only |
| `noscript` | Desktop Chrome | — (JS off) | full only |

#### Test Commands

- **Quick:** `bun run test` (or `cd theme/starter && bunx playwright test --project=firefox-light --project=chrome-mobile-dark --reporter=list`)
- **Full:** `bun run test:full` (or `cd theme/starter && bunx playwright test --reporter=list`)
- **Matrix:** `bun run test:matrix` (or `cd theme/starter && bun run scripts/test-config-matrix.ts`)
- **Release:** `bun run test:release` (full + matrix)

#### Config Matrix Testing

The config matrix tests verify that theme config settings correctly propagate to the rendered page. It uses 5 config variants in `testing/configs/`:

- `config-colors.ts`: Tests color CSS variables (light + dark mode)
- `config-fonts.ts`: Tests font families + font sizes
- `config-layout.ts`: Tests layout CSS variables (margins, nav widths)
- `config-contact.ts`: Tests contact form provider + checkboxes
- `config-noanim.ts`: Tests animation disable flag

Each config is built separately and tested with `testing/tests/config-matrix.spec.ts`. The verification is CSS-tooling-agnostic (uses `getComputedStyle`) so it works before and after the UnoCSS migration.

**Key files:**
- `testing/configs/*.ts`: Config variants
- `testing/configs/expectations.ts`: Expected values for programmatic verification
- `testing/utils/verify-config.ts`: Verification utility
- `scripts/test-config-matrix.ts`: Build script that iterates through configs
- `playwright.matrix.config.ts`: Playwright config for matrix tests (2 projects: chromium + firefox-dark)

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

### 5. 🚫 Directory Execution Restrictions (Monorepo Guard)

- **Rule:** **NEVER** run `bun install`, `bun run build`, `bun run dev`, or `bun run preview` directly inside the `theme/` or `theme/starter/` subdirectories.
- **Reason:** Running execution or installation commands inside these packages generates local `node_modules`, `.astro`, or `dist` folders. This pollutes the clean starter template, gets copied to the playground during setup, and leads to non-canonical builds, workspace resolution issues, and weird phantom behaviors.
- **Workflow:** All validation, execution, and local dev server runs **MUST** be performed from the workspace root or inside the `playground/` directory (after setting it up via `bun run playground:setup`).

---

## 🧠 DESIGN PATTERNS

### 0. 📐 Fluid Root Dial (true-linear proportional desktop scaling)

- `base.css` sets `html { font-size: clamp(0.625rem, min(0.8333vw, 1.4814vh), 2rem) }`
  for ≥1024px viewports: the ONE dial that makes the entire rem chain
  viewport-proportional. Master = 16px @1920×1080; TRUE LINEAR in both
  directions (1280×720 = 67%, 2560×1440 = 133%) — any 16:9 viewport is
  the master design photographically resized: same positions, same
  line breaks.
- The `vh` term keeps proportions aspect-ratio-agnostic (ultrawide-safe);
  floor 0.625rem only cushions 1024–1200px; below 1024px the root is
  fixed 16px (mobile/tablet system owns it; rem === px there).
- Consequences: **never introduce px for sizes that should scale with the
  page** in the desktop zone — use rem (they inherit the dial) or cqi
  (component-proportional). px is only for hairlines (1px), sub-pixel
  optical fixes, and shadows. Container caps are rem (`_type.css`).
- Below 1024px the root is fixed 16px (mobile/tablet system owns it);
  rem === px there, so those zones are dial-immune.
- `base.css` sets the dial (see above). **Never mix vw/vh with rem in one
  formula** inside the floor zone (1024–1200px) or the cap zone (>3840px):
  rem is pinned there while vw keeps moving → the formula's output drifts
  with width (this bit the About sidebar hang-out — fixed to
  container-edge-relative offsets). Everywhere else rem ≡ 0.8333vw, so
  mixing is proportionally safe. If viewport-relative positioning is
  needed in the edge zones, express BOTH sides in viewport units.
- Bounds are rem on purpose → user font-size preferences propagate.
- Decision record: `docs/decisions/2026-09-06-proportional-desktop-scaling.md`.

### 1. 📂 Flat Blog Routing (Regression Prevention)

- **Requirement:** Users must be allowed to organize `blog_posts/` with any folder structure (e.g., `blog_posts/archive/2025/post.md`).
- **Route Generation:** `BlogPost.astro` `getStaticPaths` MUST flatten the ID: `post.id.split('/').pop()`.
- **Link Generation:** All `href` attributes linking to posts MUST also flatten: `/posts/${post.id.split('/').pop()}`.
  - **Affected components:** `FilteredPostsSection`, `BlogCategoriesSection`, `[BlogCategory]`, `BlogSidebar`.
- **Result:** URL is always `/posts/post-name` regardless of depth. Do NOT use raw `post.id` in links.
- **Slug = filename.** Folders are organization only; there is **no `slug` frontmatter** — renaming the file changes the URL (by design). Convention: lean hyphen/kebab-case (`split-and-treat`); modern crawlers handle underscores fine, consistency matters more than the separator. Full notes: `docs/url-slugs.md`.
- **Collision (verified):** two posts with the same basename in different folders **do not error** — the build succeeds with
  `[WARN] Could not render '/posts/<name>' ... conflicts with higher priority route`
  and only ONE page is emitted; the other post is unreachable. Watch the warning on filename duplicates.

### 2. 🎨 Styling & NoScript

- **prefer native** if there  is a way to do something in a sensible modern or even bleeding edge way without javascript then drop the javascript!
- **Styling stack (post-3.5):** UnoCSS (presetWind4, unlayered utilities) +
  component-owned plain-CSS partials in `@layer components` + the flat
  `light-dark()` token table in `styles/base.css`. No Sass, no Bootstrap —
  new styles are plain CSS partials or utilities, never inline `<style>`
  for anything reusable.
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
bun run playground:setup && bun run dev
```

### 📦 Version Mismatch after Release / Versioning

**Symptom:** `bun install` fails with `GET https://registry.npmjs.org/astro-freelance-persona_theme - 404` or similar resolution errors — **or test/preview builds silently run against an OLD published theme** (compiled chunks reference `node_modules/.bun/astro-freelance-persona_theme@<old-version>/...` instead of the workspace; symptoms like `marked(): input parameter is of type [object Array]` from a component version that predates current schema support).
**Cause:** The version in `theme/package.json` was bumped (e.g. by `changeset version`), but `theme/starter/package.json` was not updated because it is not a workspace package. When `playground` copies `starter`'s package.json, the root `bun install` attempts to resolve the old version from npm registry because the local version no longer satisfies the range in `starter/package.json`.
**Fix:** Manually update `"astro-freelance-persona_theme"` in `theme/starter/package.json` to match the new version in `theme/package.json` (e.g. `^0.1.0-alpha.0`). Then ALSO purge the stale resolution artifacts: the old registry copy under `node_modules/.bun/astro-freelance-persona_theme@<old>+hash/` and any polluted `theme/starter/node_modules`, `theme/starter/dist`, `theme/starter/.astro` — Vite keeps resolving the cached old copy otherwise.

### 🌐 Standalone Template `@freelance-persona/*` Resolution / Symlink Mismatch

**Symptom:** Build fails with Vite/Rollup unresolved imports on `@freelance-persona/*` (in standalone user projects) or fails with `No cached compile metadata found` style errors (in monorepo playground builds).
**Cause:** The starter template's `tsconfig.json` paths must resolve `@freelance-persona/*` differently depending on the context: via relative paths in the monorepo workspace (to avoid symlink/real-path mismatches in Vite), and via `node_modules` inside a standalone user project.
**Fix:** Define the paths in `theme/starter/tsconfig.json` to check relative paths first, followed by the `node_modules` package fallback:
```json
            "@freelance-persona/*": [
                "../src/freelance-persona/*",
                "../theme/src/freelance-persona/*",
                "node_modules/astro-freelance-persona_theme/src/freelance-persona/*"
            ]
```

### 📄 Stale User Template Copies (post-cutover breakage)

**Symptom:** a user page (404, 403, …) renders elements in weird spots
(e.g. the mascot hugging the top-left instead of centered) while the
starter demo renders fine.
**Cause:** the user's site carries a pre-cutover copy of a template
page with dead classes (`d-flex`, `img-fluid`, … — removed in the
UnoCSS 3.5 cutover). Layout-critical classes like `mx-auto` /
`flex flex-col items-center` are missing → silent breakage.
**Fix:** re-diff user-site `src/pages/*.astro` + `fonts.ts` against the
current `theme/starter/src/` after breaking releases and sync the
template files (keep user-edited content: hero/features/about/blogs +
their `freelance-persona.config.ts` and trimmed `fonts.ts`).

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

### 🌐 Verifying BASE_URL / Subpath Hosting

The playground config reads `BASE_PATH` env → astro `base`. Build with
`BASE_PATH=/repo/ bun run build` and grep `playground/dist` for rewritten
hrefs to prove BASE_URL-aware link resolution (GitHub Pages style subpath).
With default base (`/`) a correct rewrite is invisible (output identical to
the input path), so a root-only build verifies nothing. See
`docs/features/internal-links-in-markdown.md` for the link-handling rules.

### 🎭 Theme Dropdown Backdrop Blocks Test Clicks

**Symptom:** `label.theme-label-dark.click({ force: true })` times out or fails silently in theme tests even though the dropdown is "visible".
**Cause:** When the checkbox toggle is checked (dropdown open), a **200vw × 200vh fixed backdrop** (`.theme-menu-backdrop`, z-index 98) covers the entire page. Playwright's `click({ force: true })` bypasses actionability checks but CDP-level coordinate clicks can still be intercepted by this backdrop.
**Fix:** Use `.dispatchEvent('click')` instead of `.click({ force: true })`. This fires the event directly on the DOM element, completely bypassing the backdrop layer.

### 📱 Mobile Popover — Nav Toggle Only Opens, Never Closes

**Symptom:** Clicking `.nav-toggle` to close the mobile popover does nothing (popover stays open).
**Cause:** The `.nav-toggle` button has `command="show-popover"` only. It cannot close the popover.
**Fix:** Use `button.nav-close[aria-label="Close navigation menu"]` to close, and `page.keyboard.press('Escape')` for light-dismiss testing.

### 🎨 Astro `<style>` + `@import` Scoping (UnoCSS Migration Gotchas)

### 🔒 CSP Kills Non-Hashed Inline Styles (Silent)

**Symptom:** A server-rendered inline style (attribute or `set:html`
`<style>`) works in dev / non-CSP builds but is dead in production.
**Cause:** The default CSP combines Astro's auto-generated inline-style
hashes with `'unsafe-inline'` on `style-src` — per CSP spec, a hash in
a source list makes `'unsafe-inline'` IGNORED, so everything not
auto-hashed (set:html style blocks, style attributes: nudges,
`define:vars`, Shiki colors) is silently blocked. No console hint
unless you look for CSP violations.
**Fix (in place):** `integration.ts` re-declares the style
sub-directives explicitly — `style-src-elem 'self' 'unsafe-inline'` +
`style-src-attr 'unsafe-inline'` — which override `style-src` per
content type and carry no hashes, so they're effective. Don't remove
them. Related traps:
- `Astro.csp.insertStyleHash()` from a component render is too late —
  the CSP meta in the layout `<head>` was already rendered. Register
  hashes from layouts/frontmatter only.
- Astro's CSP serializer does NOT support object-form resources
  (`{ resource, kind }`) in `styleDirective.resources` — they render
  as literal `[object Object]` into the meta.
- Prefer static build-time CSS rules (e.g. `nth-child` keyed, emitted
  via `<style is:global set:html>`) over inline `style=""` values for
  anything behavior-critical.

### 👁️ IntersectionObserver Ratio Thresholds Hide Tall Elements

**Symptom:** A page "renders blank on mobile" (or only after scrolling
~one element-height); works on desktop / for short content.
**Cause:** An IntersectionObserver reveal with a ratio `threshold`
(e.g. 0.1) fires `isIntersecting` only when 10% OF THE ELEMENT is
visible — an element taller than 10 viewports (long blog post) can
never reach it while its top is on screen.
**Rule:** For show-on-scroll reveals use `threshold: 0` and express
"don't fire on slivers" as a **bottom rootMargin inset in %**
(`0px 0px -10% 0px`) — viewport-relative = height-independent.
Theme location: BaseLayout `animationEngineScript` (the configured
`scroll_animations.threshold` is translated into that inset).
**Test-side corollary:** hover-screenshot tests must SETTLE the
scroll-reveal (wait ~900ms after scrollIntoView) before hovering —
reveal lift + hover lift racing produces load-dependent 2-3px ghost
diffs (hover.spec.ts Category Cards).

### 🔗 User-Project Theme Link Dies on Every Install

User sites (fabio_rieker) import the theme via a **symlinked**
`node_modules/astro-freelance-persona_theme → <abs theme path>`. ANY
install in the user project (`bun install`, `bun remove`, `bun update`,
playground:setup reruns that touch it) **re-materializes the package as
a real copied directory from the store** — silently replacing the
symlink with a stale snapshot. Symptom: theme changes verified green on
the theme/demo are invisible on the user site ("I see no change at
all"), while old behavior (unclamped titles, oversized attributions)
persists.
**Fix + ritual:** restore the symlink
(`rm -rf node_modules/astro-freelance-persona_theme && ln -s <abs theme
path> node_modules/astro-freelance-persona_theme`) and **re-verify the
link after every install round in a user project** before debugging
"missing changes".
**Resolution strategy (fabio):** the `package.json` dep =
`"astro-freelance-persona_theme": "latest"` — clones/CI resolve the npm
`latest` release (registry, no sibling directory needed); the local dev
override = the manual symlink above (re-apply after installs). The
bun.lock pins the resolved version — after publishing a new release,
`bun update astro-freelance-persona_theme` picks it up. NOTE: new
theme features land on the user site only after an npm release (or the
local symlink).

### 🖥️ EC Copy Button Internals (resizing = flagged hack)

Expressive Code manages the copy button's internals (icon layer div,
pseudo-elements, copied-state feedback) against a **fixed 2.5rem box**.
Resizing the box externally breaks rendering: the icon mask keeps its
fixed metrics inside the shrunken box (tiny glyph), and the copied-state
feedback reflows inside it (jumpy click). `width: 100%` on the icon
layer even computes to `NaN` against EC's internal rules.
**Supported pattern:** leave the button at EC's native box and scale the
VISUAL via `transform: scale(0.5); transform-origin: top right;`
(`_code-blocks.css`, flagged EC-VISUAL OVERRIDE) — internals stay intact,
everything scales 1:1, and the 40px layout box doubles as the click
target. Verify the click behavior at 390 + 1920 after EC updates.

### 🎨 Astro `<style>` + `@import` Scoping (UnoCSS Migration Gotchas)

- **Astro scopes `@import`ed CSS.** A partial imported inside a plain `<style>` block
  gets `[data-astro-cid-*]` appended to every selector. This silently breaks any rule
  targeting markup rendered by OTHER components/templates/plugins (scoped selectors only
  match the owning component's own elements). ShareMenu "worked" only because its markup
  is internal to itself.
  - **Fix:** use `<style is:global>` blocks for component-owned partial imports.
- **Import order inside a component matters.** Legacy cascade had shared partials load
  BEFORE a component's local literal styles. Put `<style is:global>` import blocks ABOVE
  existing `<style>` blocks; appending them after flips same-specificity ties.
- **`:is()` takes the max specificity of its arguments.** Grouping selector lists of
  different complexity in one nested parent (e.g. `.hero, .blog-post .post-img { & .x }`)
  boosts simple contexts to the most complex member's specificity and breaks per-context
  overrides. Split groups so every member yields identical rule specificity.
- **Cross-component class usage:** if a partial's classes render in multiple components
  (e.g. blog-post.css `.post-header` used by FilteredPostsSection cards), each renderer
  must import it — Vite dedupes per page.
- **A/B build rigs must pin dependency versions.** A fresh `bun install` in a comparison
  workspace pulled astro-icon 1.2.x vs the repo's 1.1.x, changing SVG sprite emission
  (`viewBox` moved to `<symbol>`) and producing fake Firefox-only diffs.

### 🗜️ Precompression on Astro 7 (user configs)

Two traps when adding build-time `.zst`/`.br` precompression (the
theme itself does NOT precompress — edge hosts compress dynamically):
1. `vite-plugin-compression@0.5` maps `algorithm` **directly onto a
   Node zlib function** (`zlib[algorithm]`) — it must be the function
   name (`brotliCompress`, `zstdCompress`, `gzip`). `'brotli'`/`'zstd'`
   resolve to `undefined`, throw, and the plugin then writes **raw
   bytes under the compressed extension** (silent fake precompression —
   spot it in the success log: oldSize == size).
2. Astro 7 builds into `dist/.prerender` and merges afterwards — a
   `writeBundle`-time compressor's companion files land in `.prerender`
   and are **dropped by the merge**. If precompression is ever needed
   (bare nginx with `*_static` directives), use the `astro-compressor`
   integration (runs after the merge). For Cloudflare/Workers/Caddy/
   Ferron: skip it — they compress dynamically. Reference impl (hook
   version): fabio_rieker git history, `precompressDist`.

### 🧱 Cascade Layers (post-3.5 architecture)

- Theme CSS lives in `@layer components`; uno (presetWind4) ships its own
  `theme`/`base` layers + reset, and utilities are UNLAYERED-OR-EQUIVALENT →
  utilities always beat layered rules regardless of specificity. To beat a
  utility, change the markup's utility, not a layered rule.
  Naming gotcha: wind4 emits utilities into a layer named `default` (not
  `utilities`); `default` is unlisted in the order statement and sorts by
  document order, i.e. above components — correct outcome, surprising name
  when inspecting built CSS.
- **`!important` inverts layer priority**: for important declarations the
  EARLIER-declared layer wins. This bit us when `!important` Bootstrap
  utilities fought layered theme rules (hero mobile alignment) — the fix
  was deleting the dead utility, not fighting it.
- The `@layer theme, base, components, utilities;` order statement is
  injected as `<style is:inline>` in BaseLayout's <head>: the bundler may
  emit @layer blocks across chunks in arbitrary physical order, so
  block-position-based ordering is not trustworthy, and first declaration
  wins.

### 🧱 Step 3.5 cutover gotchas (wind4 reset native)

- **`outputToCssLayers: true` is mandatory** in uno.config.ts: without it uno
  sorts layers internally but ships ALL css unlayered, and the vendor reset
  then beats every `@layer components` rule regardless of specificity.
- **The layer statement must name vendor layers first**: `@layer theme, base,
  components, utilities;` in BaseLayout head. First declaration wins —
  declaring only `components` silently places uno's `base`/`theme` AFTER it
  and the reset nukes component styles.
- **wind4 blockifies replaced elements** (`img,svg,video{display:block}` +
  `max-width:100%;height:auto`): text-align centering stops working (use
  `mx-auto` in markup), baseline descender gaps vanish (flow heights shrink),
  and oversize hacks like `.hero img`'s `width:calc(100%+4px)` get clamped
  (re-declare `max-width` alongside `width`).
- **Universal `padding:0` strips UA table cell padding** (1px/row) — restored
  in `_type.css`.
- **Mono identity is config-driven**: wind4 resolves its mono stack via
  `theme.font.mono` → `var(--monospace-font)` (user config). Inline `<code>`
  now renders in the configured font — not the old hardcoded SFMono stack. The metric difference shifts line boxes by ~0.5px downstream of
  inline code; visual baselines recorded before 3.5 will flag ±1px clips.
- **Cutover lesson — hidden carrier dependencies surface at deletion**: the
  old `.dropdown` class carried `position:relative` for the theme dropdown
  (now owned by `_theme-dropdown.css`); `h-100`/`d-flex`/`flex-column` etc.
  were load-bearing layout — all swapped to uno utilities (`h-full`, `flex`,
  `flex-col`, …). Expect the same when deleting any "unused-looking" class.
- Visual-test budget is `maxDiffPixels: 200` (global) — sub-pixel AA from any
  font change exceeds it by orders of magnitude; re-record baselines only
  after manual review of the diffs.
