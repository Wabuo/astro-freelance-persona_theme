// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import type { ConfigExpectation } from '../utils/verify-config';

/**
 * Config Matrix Expectations
 * 
 * Maps config names (from testing/configs/*.ts) to their expected values.
 * Co-located with configs for single-place editing when configs change.
 * 
 * CSS vars are verified via getComputedStyle on :root (light mode in light projects,
 * dark mode in dark projects). Font sizes must be in computed pixels.
 */
export const expectations: Record<string, ConfigExpectation> = {
  'config-colors': {
    title: 'Config: Colors',
    cssVars: {
      // Light mode (verified in light-scheme projects only)
      '--accent-color': '#e63946',
      '--background-color': '#ffffff',
      '--surface-color': '#ffffff',
      '--default-color': '#272829',
      '--heading-color': '#45505b',
    },
    darkCssVars: {
      // Dark mode neon values (verified only in dark-scheme projects)
      '--background-color': '#ff0000',
      '--surface-color': '#00ff00',
      '--default-color': '#ffff00',
      '--heading-color': '#00ffff',
      '--accent-color': '#ff00ff',
      '--card-background': '#0000ff',
    },
  },

  'config-fonts': {
    title: 'Config: Fonts',
    fonts: {
      headings: 'Courier New',
      body: 'Georgia',
      navigation: 'Impact',
      monospace: 'Courier New',
    },
    fontSizes: {
      '.section-title h2': '40px',  // 2.5rem computed (vs default 2rem = 32px)
    },
  },

  'config-layout': {
    title: 'Config: Layout',
    cssVars: {
      '--global-margin-left': '2rem',
      '--global-margin-right': '1rem',
      '--nav-pill-expanded-width': '8rem',
      '--nav-menu-width': '6rem',  // vs default 8.75rem
    },
  },

  'config-contact': {
    title: 'Config: Contact',
    contactForm: {
      provider: 'mailto',
      action: 'mailto:contact-test@example.com',
      checkboxCount: 2,  // vs starter's 1
    },
  },

  'config-noanim': {
    title: 'Config: No Animations',
    animationsEnabled: false,
  },
};
