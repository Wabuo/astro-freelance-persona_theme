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
  // Emit UnoCSS' internal layers (theme/base from preflights, utilities) as
  // REAL CSS @layer blocks. Without this, uno sorts internally but ships
  // everything unlayered — and an unlayered vendor reset would beat every
  // layered component style regardless of specificity. The layer-order
  // statement in BaseLayout.head (`@layer theme, base, components, utilities;`)
  // keeps vendor layers below the theme.
  outputToCssLayers: true,

  presets: [
    presetWind4({
      preflights: {
        // Upstream-maintained reset (step 3.5 cutover), emitted into UnoCSS'
        // named `base` layer. Our layer-order statement in BaseLayout.head
        // (`@layer theme, base, components`) keeps it BELOW all theme CSS;
        // typography/grid deltas live in styles/_type.css.
        // NOTE: NESTED key — a top-level `reset` is silently ignored and
        // the reset ships anyway.
        reset: true,
      },
    }),
  ],

  /**
   * BLOCKLIST (post-migration).
   *
   * The Bootstrap coexistence blocklist was emptied in Phase 3.6 — all
   * legacy names are gone from templates, so no collisions remain. What
   * stays is a single design-owned exception (see below), not archaeology.
   */
  blocklist: [
    // Design-owned exception: wind4's container utility uses Tailwind
    // max-width semantics (max = breakpoint); the design's container is
    // narrower (540/720/960/1140/1320) and lives as a semantic rule in
    // styles/_type.css. Everything Bootstrap-related was unblocked in 3.6.
    'container',
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
