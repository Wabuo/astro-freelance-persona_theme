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
  presets: [
    presetWind4({
      preflights: {
        // Phase 1 (coexistence): Bootstrap's reboot is still active, so the
        // built-in reset MUST stay off to avoid double-reset conflicts.
        // NOTE: this is NESTED under `preflights` — a top-level `reset` key is
        // silently ignored and the full Tailwind-4 preflight ships anyway.
        // Flip to true in Phase 3 (atomic cutover).
        reset: false,
      },
    }),
  ],

  /**
   * COEXISTENCE BLOCKLIST (Phase 1–2 only).
   *
   * Blocks ONLY names that are valid in BOTH systems but resolve differently:
   * Bootstrap's spacing scale is 1:.25 / 2:.5 / 3:1 / 4:1.5 / 5:3rem while
   * UnoCSS uses n×.25rem — so steps -3/-4/-5 collide with different values
   * (-0/-1/-2 are identical and stay allowed). Structural Bootstrap classes
   * have no legitimate Uno meaning and are blocked outright.
   *
   * Rule: when a component migrates in Phase 2, remove its legacy names from
   * this list in the same changeset. By Phase 3 this list must be empty.
   */
  blocklist: [
    // Structural Bootstrap layout system
    'container',
    'row',
    'list-unstyled',
    'img-fluid',
    'visible',
    // Grid columns & gutters
    /^col(-([\w]+))?-?\d*$/,
    /^g[xy]-\d+$/,
    // Spacing steps where the two scales diverge (3/4/5)
    /^[mp][tblrxy]?-[345]$/,
    // Sizing helpers (Bootstrap = %, Uno = rem!)
    /^(w|h)-(100|25|50|75)$/,
    // Bootstrap-only color helper colliding with our theme token
    'text-muted',
  ],

  theme: {
    colors: {
      accent: 'var(--accent-color)',
      background: 'var(--background-color)',
      surface: 'var(--surface-color)',
      default: 'var(--default-color)',
      heading: 'var(--heading-color)',
      contrast: 'var(--contrast-color)',
      muted: 'var(--text-muted)',
      card: {
        bg: 'var(--card-background)',
        border: 'var(--card-border)',
      },
      input: {
        bg: 'var(--input-background)',
        border: 'var(--input-border)',
        text: 'var(--input-text)',
      },
    },

    font: {
      body: 'var(--default-font)',
      heading: 'var(--heading-font)',
      nav: 'var(--nav-font)',
      mono: 'var(--monospace-font)',
    },

    // Breakpoints mirror Bootstrap's current values so Phase-2 component
    // conversions behave identically until semantic layouts replace them.
    // (Bootstrap: sm 576 / md 768 / lg 992 / xl 1200 / xxl 1400)
    breakpoint: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1400px',
    },
  },
});
