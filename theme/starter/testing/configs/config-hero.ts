// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import type { PersonaConfig } from 'astro-freelance-persona_theme/types';
import { astroMajorVersion } from 'astro-freelance-persona_theme/utils/buildInfo';

/**
 * Config Matrix: Hero Layout Variants
 * Proves visuals.layout and hero content positioning works
 */
export const themeConfig: PersonaConfig = {
  title: `freelance-persona — Config: Hero Variants (Astro ${astroMajorVersion})`,
  author: "freelance-persona Theme Test",
  description: "Config matrix test for hero layout positioning",

  email: "hero-test@example.com",
  phone: "+1555000005",
  address: "123 Hero Test Ave",

  social_links: [
    { name: "GitHub", url: "https://github.com/test", icon_class: "bi bi-github" },
  ],

  visuals: {
    mascot_image: "/src/assets/img/lancy.svg",
    layout: {
      page_margin_left: "2rem",
      nav_pill_expanded_width: "8rem",
    },
    scroll_animations: { enabled: true },
  },

  colors: {
    transparency: "25%",
    light: {},
    dark: {},
  },

  fonts: {
    headings: "Raleway",
    body: "Roboto",
    navigation: "Poppins",
    monospace: "Courier New",
  },

  contact_form: {
    provider: "mailto",
    action: "mailto:hero-test@example.com",
  },

  quote: "Hero test quote",
  copyright: "&copy; Hero Test",
  credits: ["Config: Hero variants test"],

  legal: {
    enabled: true,
    link_text: "Legal Notice",
    privacy_enabled: true,
    privacy_link_text: "Privacy Policy",
    legal_name: "Hero Test Corp",
    legal_address: "123 Hero Test Ave",
    legal_email: "hero-test@example.com",
    privacy_email: "privacy@hero-test.com",
    legal_phone: "+1555000005",
    business_license: "Test: Sole Proprietor",
    vat_id: "TEST123",
    jurisdiction: "Testland",
    disclaimer: "legal-guide",
    legal_note: "Hero test note",
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