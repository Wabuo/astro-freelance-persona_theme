<!--
SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors

SPDX-License-Identifier: MIT
-->

# Screen Reader Listening Checklist

> Manual pass for NVDA (Windows) / Orca (Linux) / VoiceOver (macOS).
> The structure was audited programmatically (landmarks, labels, heading
> order, focus order — see the a11y changesets); what follows is what to
> *listen for*, page by page, with the expected announcements.

## Global (every page)

| Action | Expected announcement |
|---|---|
| Page load | Document title, then `lang="en"` context |
| Tab (1st press) | "Skip to content, link" — visible blue pill top-left |
| Enter on skip link | Focus moves past the nav into `<main>` |
| Tab into nav | Landmark "navigation", links with names ("Home", "About"…) |
| Tab to theme toggle | "Theme Preferences, button" (opens dropdown on Enter/Space) |
| Theme dropdown items | "Auto, radio button, …" — wait: the radios are `sr-only` with `aria-label` ("System Default Theme", "Light Theme", "Dark Theme"); the *visible* labels are separate rows. Switching selection announces the state change via the radio group. |
| Footer socials | "Link to my GitHub profile" etc. |

## Home (`/`)

| Action | Expected |
|---|---|
| Hero | `h1` "Freelance — Persona", typed subline is decorative motion — SR should announce it once via the static text, not per keystroke (typing loop renders text via `textContent`; report if NVDA re-announces on changes — that would need `aria-live="off"` hardening) |
| Sections | `h2` per section ("About", "Contact"…), `h3` children |
| Contact checkboxes | Label text, then required-state; the consent checkbox has a **hint tooltip** (Chromium: hover/long-press shows "Required so we can legally reply to your inquiry." — SR users get the info from the label itself, the tooltip is redundant by design) |
| Email copy | Button announced as "Copy email address"; activation copies and the visible text swaps to "Copied!" — **listen**: the visible swap is NOT announced to SR (no aria-live). If this matters to you, the fix is `aria-live="polite"` on the display span — deliberately not added yet (candidate finding) |
| Blog cards | Post title + date as links |

## Blog category page (`/blogs/…`)

- `h2` page title, `h3` post titles (fixed from h4 — was a level skip)
- View toggle ("Card grid or sleek list") announces as a link/label — check it reads sensibly out of context

## Blog post (`/posts/…`)

- Figure images: decorative ones (`alt=""`) are **silently skipped** (aria-hidden) — captions still announce
- Code blocks: EC's copy button announces its localized label; activation feedback is EC's own tooltip
- Math: MathJax bakes at build time — formulas read as their CHTML text content (expect messy-but-present reading; `aria-label` per formula is a possible future enhancement)

## Known accepted non-issues

- Link contrast (muted dates/links) — owner-accepted
- Links without persistent underline — hover/`currentColor` treatment only
- Hint tooltips are invisible to non-Chromium browsers — aria-labels carry the information (SR users unaffected)

## To watch (To_Do.md)

- Interest invokers (`interestfor`) — tooltip trigger — currently Chromium-only;
  when Firefox/Safari ship it, hover/long-press tooltips work everywhere
- A vendored axe-core run in CI (the meta-CSP correctly blocks CDN injection)
