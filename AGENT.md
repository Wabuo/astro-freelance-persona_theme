# 🤖 AGENT KNOWLEDGE BASE & OPERATIONAL RULES

> **SYSTEM INSTRUCTION:** This file is the single source of truth for recurring issues, project-specific workflows, and latent tribal knowledge. **Before starting any task, you MUST check this file.**
>
> **META-RULE:** If you encounter a recurring issue or a "gotcha" that cost you time/tokens, YOU MUST UPDATE THIS FILE with a new rule or debugging hint to prevent future agents from failing in the same way.

---

## 🚨 CRITICAL OPERATIONAL RULES

### 1. ⚡ Server Management & Process Control

- **ALWAYS start your own server:** Never assume a dev server or preview server is already running for you.
- **Isolate your environment:** Run `bun run dev` (or `setup` then `preview`) yourself.
- **Parse output for ports:** Do not assume `localhost:4321`. There might be multiple instances (ghost processes). unexpected "Page Not Found" errors are often due to connecting to the wrong (stale) instance.
- **Kill Responsibly:** when killing processes to free up ports, **ONLY kill processes you know are yours** or clearly zombies. Other agents or humans may be working on the server. Always cleanup/kill your *own* processes when finishing a task.
- **Stopping Servers Correctly:**
  - 🛑 **DO NOT** try to run `pkill` or input commands into the *same* terminal where the server is running. It will just be treated as text input (stdin) and will do nothing.
  - ✅ **Method 1:** Use `send_command_input` with `Terminate: true`.
  - ✅ **Method 2:** Open a **NEW** terminal instance to run shell commands like `pkill -f "astro"`.

### 2. 🎡 The Playground & Gitignore "Gotcha"

- **Ephemerality:** The `playground/` directory is **NOT** part of the permanent repo (it is git-ignored). It exists solely for testing and development.
- **Data Persistence:**
  - ❌ **NEVER** write final code changes to `playground/`.
  - ✅ **ALWAYS** write final code changes to `theme/`.
  - 🔄 **Workflow:** Test in `playground` -> Verify -> Move/Replicate changes to `theme/`.
- **Visibility:** Since `playground` is git-ignored, some agent tools (like generic file searchers) might skip it.
  - **Tip:** You may need to temporarily comment out the `playground` exclusion in `.gitignore` if you are doing massive automated refactors there, but remember to revert it.
- **Resetting:** `playground` can be deleted/reset at any time. Populate it by copying from `starter/`:

  ```bash
  cp -r theme/starter/* playground/
  bun install
  ```

### 3. 📦 Project Architecture (Monorepo)

- **Runtime:** `bun` (Strictly). Do not use `npm` or `yarn`.
- **Structure:**
  - `.` (Root): Theme package workspace.
  - `./theme`: The actual source code of the theme.
  - `./starter`: Public template (Read-only reference for dev).
  - `./playground`: **Your active dev environment.**
- **Workspace Naming Confusion:**
  - `playground/package.json` is a copy of `starter/package.json`.
  - It might retain the name from starter (EXP: `astro-freelance-persona-starter`) which can be confusing when listing workspaces. Rely on directory paths, not just package names.

---

## 🛠️ DEBUGGING & TROUBLESHOOTING

### 🚧 Cache & Schema Issues

**Symptom:** Props missing (e.g., `mini_categories`), schema validation errors, or weird type mismatches that shouldn't exist.
**Fix:** The Vite/Astro cache is likely stale.

```bash
rm -rf playground/node_modules/.vite playground/.astro
```

### 🧩 Content Collections in Monorepos

**Symptom:** Theme schema updates (e.g., adding `unavailable: true`) are ignored by the playground.
**Cause:** The playground (and starter) MUST have its own `src/content.config.ts` that imports the theme's schema. If missing, Astro falls back to a default/inferred schema and ignores your theme's definitions.
**Fix:** Ensure `starter/src/content.config.ts` exists and re-exports `collections` from the theme.

```typescript
export { collections } from 'astro-freelance-persona_theme/content.config';
```

> **CRITICAL:** You **MUST** restart your dev server after running this command. If you don't, you will see a cascade of confusing errors.

### 👻 Ghost Servers

**Symptom:** Changes not reflecting, 404s on existing pages.
**Cause:** You are looking at port `4321` but `bun` started on `4322` because `4321` was taken by a zombie process.
**Fix:** Check terminal output carefully. Kill zombies (that are yours!).

---

## 🧠 CONTEXT & DESIGN PHILOSOPHY (The "Manifesto")

**Adopt these principles when writing code:**

1. **No Hardcoded Pixels:** Use CSS variables or relative units.
2. **Configuration, Not Prescription:**
    - Defaults live in the *code*, not in user config.
    - User config (`src/freelance-persona.config.ts`) is only for overrides.
3. **4-Level Hierarchy (Strict Priority):**
    1. Frontmatter (Content specific)
    2. Component Role (Context)
    3. User Config (Theme-wide)
    4. **Code Fallback** (Your defaults go here)
4. **Privacy First:** No external CDNs. Minimal JS.
5. **User-Centric Routing & Naming:**
    - Hyperlinks and slugs must reflect the *User's Content* (titles/frontmatter), not internal filenames/IDs.
    - **Bad:** Link text "Blog" pointing to `/blog-categories` (internal ID).
    - **Good:** Link text "Blog" pointing to `/blog` (or whatever the User defined as the slug/title).
    - **Rule:** If the theme generates a link, the URL should match the expectation set by the label.
6. **Date Formatting:**
    - **Strict Format:** `dd Mon yyyy` (e.g., `01 Jan 2026`).
    - **Uniformity:** Use this format for all visible dates unless explicitly overridden by user config.
7. **Modern CSS Standards:**
    - **Prefer Modern Syntax:** Use new standard features where sensible.
    - **Specific Rule:** Use `color-mix(in srgb, var(--color), transparent 50%)` instead of `opacity` or `rgba` hacks for transparency. This keeps custom properties (variables) intact and themeable.

---

## 📂 FILE SYSTEM MAP settings

- **Theme Logic:** `src/freelance-persona/**/*.astro` (Edit here for logic changes)
- **Styles:** `src/freelance-persona/**/*.scss`
- **Config:** `package.json` (Workspaces defined here)
- **Docs:** `README.md` (Contains detailed specific setup steps if you get stuck)
