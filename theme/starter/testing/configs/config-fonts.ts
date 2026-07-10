// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import type { PersonaConfig } from 'astro-freelance-persona_theme/types';
import { astroMajorVersion } from 'astro-freelance-persona_theme/utils/buildInfo';

/**
 * Config Matrix: Font Overrides
 * Distinct fonts to verify font stack + CSS variable propagation
 */
export const themeConfig: PersonaConfig = {
  title: `freelance-persona — Config: Fonts (Astro ${astroMajorVersion})`,
  author: "freelance-persona Theme Test",
  description: "Config matrix test for font overrides",

  email: "fonts-test@example.com",
  phone: "+1555000002",
  address: "123 Font Test Way",

  social_links: [
    { name: "GitHub", url: "https://github.com/test", icon_class: "bi bi-github" },
  ],

  visuals: {
    mascot_image: "/src/assets/img/lancy.svg",
    layout: {
      page_margin_left: "8.875rem",
      nav_pill_expanded_width: "10.35rem",
    },
    scroll_animations: { enabled: true },
  },

  colors: {
    transparency: "25%",
    light: {},
    dark: {},
  },

  fonts: {
    headings: '"Courier New", Courier, monospace',
    body: '"Georgia", serif',
    navigation: '"Impact", "Arial Black", sans-serif',
    monospace: '"Monospace", monospace',
  },

  contact_form: {
    provider: "mailto",
    action: "mailto:fonts-test@example.com",
  },

  quote: "Font test quote",
  copyright: "&copy; Font Test",
  credits: ["Config: Fonts test"],

  legal: {
    enabled: true,
    link_text: "Legal Notice",
    privacy_enabled: true,
    privacy_link_text: "Privacy Policy",
    legal_name: "Font Test Corp",
    legal_address: "123 Font Test Way",
    legal_email: "fonts-test@example.com",
    privacy_email: "privacy@fonts-test.com",
    legal_phone: "+1555000002",
    business_license: "Test: Sole Proprietor",
    vat_id: "TEST123",
    jurisdiction: "Testland",
    disclaimer: "legal-guide",
    legal_note: "Font test note",
  },

  mathjax: {
    packages: ['base', 'ams', 'nocomplain'],
  },

  codeBlocks: {
    frames: { enabled: true, showCopyButton: true, defaultFrame: 'code' },
    lineNumbers: false,
  },
};

export default themeConfig;