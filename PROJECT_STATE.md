<!--
SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors

SPDX-License-Identifier: MIT
-->

# PROJECT STATE

## Project Overview

**Freelance Persona** is an Astro 5 theme for freelancers, portfolios, and blogs, originally ported from the Zola Persona theme and modernized with features from Zola Goyo. It is designed as a monorepo workspace with a clean separation between theme source code (`theme/`) and starter template (`theme/starter/`). The theme prioritizes privacy (no external CDNs), graceful degradation (noscript support), and a consistent "Industrial Minimalist" aesthetic.

## Tech Stack

- **Runtime**: Bun (strictly)
- **Framework**: Astro 5
- **Styling**: Bootstrap 5 (no Tailwind), SCSS
- **Testing**: Playwright (with noscript project)
- **TypeScript**: Yes, with strict path aliases (`@/*`, `@theme/*`, `@starter/*`)
- **Content**: Astro Content Collections with strict schema validation
- **Deployment**: Static site generation

## Design Vibe: The Terminal Architect

The **Freelance Persona** theme embodies a design philosophy called **"The Terminal Architect."** It is a high‑end, industrial‑minimalist aesthetic that bridges the gap between raw technical utility and a premium creative portfolio.

### Visual Language
- **Mood**: Stoic, precise, authoritative – like a high‑performance dashboard or a clean‑room environment.
- **Aesthetic**:
  - **Dark‑First Glassmorphism**: While light mode is supported, the theme thrives in dark mode. Semi‑transparent "glass" panels with subtle borders create depth without clutter.
  - **Grid‑Centric Layouts**: Every element aligns to an invisible structural grid, emphasizing order and reliability.
  - **Monospaced Accents**: Technical metadata (timestamps, tags, read times) is displayed in monospaced fonts to signify "raw" information.
  - **High‑Contrast "Logic" Accents**: A single primary accent color (System Blue) is used sparingly to guide the eye toward interactive "logic" points (links, buttons).

### Design Philosophy
- **Utility over Ornament**: Every element serves a purpose; decorations are functional (e.g., image attributions, license badges).
- **Graceful Degradation**: The theme prioritizes content readability. Without JavaScript, it reverts to a rock‑solid, accessible document structure.
- **The "Sysadmin" Premium**: It targets developers and technical freelancers who want to show they understand the "metal" (clean code, performance) while maintaining a professional, client‑facing "persona."

### Condensed Design Brief (for .roomodes)

Freelance Persona theme embodies a 'Terminal Architect' aesthetic: industrial minimalism that bridges raw technical utility with premium creative portfolio. Dark‑first glassmorphism, grid‑centric layouts, monospaced accents, and high‑contrast logic accents create a stoic, precise mood. The design philosophy prioritizes utility over ornament, graceful degradation without JavaScript, and a 'sysadmin' premium feel for technical freelancers.

## Known Visual Issues (from initial audit)

- **Image Attribution Overlays**: On some blog cards, attribution text can overlap with the title when the title is long and the card is narrow.
- **Section Spacing**: The transition between the Hero and Features sections feels slightly abrupt on mobile due to the background‑image transition.
- **Breadcrumbs Contrast**: In dark mode, the breadcrumb separator (`/`) has lower contrast than the links, which may need adjustment for accessibility.
- **Form Focus States**: Contact‑form inputs use default Bootstrap focus rings; they could be customized further to match the glassmorphism style.

## Architecture Decisions (from AGENT.md)

### Routing & Content
- **Flat Blog Routing**: Blog posts can be organized in any folder structure inside `blog_posts/`, but the URL is always flattened to `/posts/{slug}`. All links must use the flattened ID.
- **User‑Centric Routing**: Links must match user‑facing content (e.g., `/blog`, not `/blog‑categories`).

### Project Structure
- **Monorepo Layout**:
  - `.` – Workspace root
  - `theme/` – Source code
  - `theme/starter/` – Public template / active dev content
  - `theme/starter/testing/` – Playwright test suite (included in template)
  - `playground/` – Ephemeral, git‑ignored directory for throwaway tests
- **Path Aliases**: All `tsconfig.json` files must explicitly define `@/*` and other required aliases. Relative paths are considered bad practice.

### Development & Testing
- **Server Management**: Playwright auto‑starts the preview server (`bun run build; bun run preview`). Manual verification should use the same command.
- **Testing Standards**:
  - Always use `--reporter=list` or `--reporter=line` to prevent terminal hanging.
  - NoScript testing ensures preloader is hidden and content is visible (`opacity: 1`).
  - Never hardcode content values in tests; use `content‑parser.ts` to read expected values dynamically.
- **Cache Issues**: Stale Vite/Astro cache can cause schema validation errors. Fix with a clean rebuild (`pkill …; rm ‑rf playground; …`).

### Styling & Components
- **Bootstrap 5 Only**: No Tailwind classes allowed; any existing Tailwind must be refactored.
- **Native over JavaScript**: Prefer browser‑native solutions whenever possible. The site must degrade gracefully in a noscript/script‑blocked environment.
- **SCSS Organization**: Prefer `_partial.scss` over inline `<style>`.
- **Icon Fonts**: Interactive icon elements must have `caret‑color: transparent; user‑select: none` to prevent text‑selection behavior.

### Content & Legal
- **Image Attribution**: `img_credit` and `img_license` are **required** for all content images (hero, blog, avatar).
- **Date Formatting**: Strict `dd Mon yyyy` (e.g., `01 Jan 2026`) for visual consistency.
- **REUSE Compliance**: SPDX headers go directly in `.astro` frontmatter; do not use sidecar `.license` files for `.astro` pages.

## Status

**Onboarding complete.**  
Next task: theme switcher UI refinement.

---
*Last updated: 2026‑03‑05 (during onboarding session) (now massivly outdated, we basically need a complete re onboarding)*