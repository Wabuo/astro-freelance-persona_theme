// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { defineConfig, presetWind4 } from 'unocss';

/**
 * UnoCSS configuration for the freelance-persona theme.
 *
 * Design-token strategy: CSS custom properties (injected at runtime from the
 * user's `freelance-persona.config.ts`) remain the single source of truth.
 * The theme block below maps semantic utility names onto those variables, so
 * utilities like `bg-surface` or `text-accent` automatically adapt to light/
 * dark mode and user config without any `dark:` variant duplication.
 */
export default defineConfig({
  // BISECTION EXPERIMENT: no presets at all — emit absolutely nothing.
  // If the 6 failing tests pass with this, the cause is in Wind4's emission;
  // if they still fail, the cause is elsewhere (integration wiring, etc.).
  presets: [],
});

// ─── PARKED (restore after bisection) ────────────────────────────────────────
//
// export default defineConfig({
//   presets: [
//     presetWind4({
//       preflights: {
//         // Phase 1 (coexistence): Bootstrap's reboot is still active, so the
//         // built-in reset MUST stay off to avoid double-reset conflicts.
//         // NOTE: this is NESTED under `preflights` — a top-level `reset` key
//         // is silently ignored and the full Tailwind-4 preflight ships anyway.
//         // Flip to true in Phase 3 (atomic cutover).
//         reset: false,
//       },
//     }),
//   ],
//
//   /**
//    * COEXISTENCE BLOCKLIST (Phase 1–2 only).
//    *
//    * Templates still carry Bootstrap-era class names. Without this blocklist
//    * UnoCSS reinterprets them as its own utilities and emits competing rules
//    * with DIFFERENT values (e.g. Bootstrap `mt-4` = 1.5rem vs Uno = 1rem),
//    * breaking unmigrated components.
//    *
//    * Rule: when a component migrates in Phase 2, remove its legacy names from
//    * this list in the same changeset. By Phase 3 this list must be empty.
//    */
//   blocklist: [
//     'container',
//     'row',
//     'list-unstyled',
//     'img-fluid',
//     'visible',
//     'hidden',
//     /^d-(flex|block|none|inline|inline-block|grid)$/,
//     /^col(-(sm|md|lg|xl|xxl))?-\d+$/,
//     /^[gx]*y?-\d+$/,
//     /^g-\d+$/,
//     /^[mp][tblrxy]?-\d+$/,
//     'flex-row',
//     'flex-column',
//     'flex-wrap',
//     'flex-grow',
//     'flex-shrink',
//     'justify-content-center',
//     'justify-content-between',
//     'justify-content-end',
//     'justify-content-start',
//     'align-items-center',
//     'align-items-start',
//     'align-items-end',
//     /^text-(center|start|end|mute[d]?)$/,
//     /^(w|h)-(100|auto|25|50|75)$/,
//     /^gap-[2345]$/,
//   ],
//
//   theme: {
//     colors: {
//       accent: 'var(--accent-color)',
//       background: 'var(--background-color)',
//       surface: 'var(--surface-color)',
//       default: 'var(--default-color)',
//       heading: 'var(--heading-color)',
//       contrast: 'var(--contrast-color)',
//       muted: 'var(--text-muted)',
//       card: { bg: 'var(--card-background)', border: 'var(--card-border)' },
//       input: {
//         bg: 'var(--input-background)',
//         border: 'var(--input-border)',
//         text: 'var(--input-text)',
//       },
//     },
//     font: {
//       body: 'var(--default-font)',
//       heading: 'var(--heading-font)',
//       nav: 'var(--nav-font)',
//       mono: 'var(--monospace-font)',
//     },
//     // Breakpoints mirror Bootstrap's current values so Phase-2 conversions
//     // behave identically until semantic layouts replace them.
//     breakpoint: { sm: '576px', md: '768px', lg: '992px', xl: '1200px', '2xl': '1400px' },
//   },
// });
