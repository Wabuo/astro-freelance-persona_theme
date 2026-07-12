// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import type { PersonaConfig } from 'astro-freelance-persona_theme/types';
import { astroMajorVersion } from 'astro-freelance-persona_theme/utils/buildInfo';

/**
 * Config Matrix: Layout Pipeline
 * Proves visuals.layout.* → CSS custom properties
 * 
 * Tests all 4 layout vars:
 * - page_margin_left: 2rem (vs default 8.875rem) — dramatic visual difference
 * - page_margin_right: 1rem (tests right margin var)
 * - nav_pill_expanded_width: 8rem (vs default 10.35rem)
 * - nav_menu_width: 6rem (vs default 8.75rem)
 */
export const themeConfig: PersonaConfig = {
  title: `freelance-persona — Config: Layout (Astro ${astroMajorVersion})`,
  author: "freelance-persona Theme Test",
  description: "Config matrix test for layout overrides",

  email: "layout-test@example.com",
  phone: "+1555000003",
  address: "123 Layout Test Way",

  social_links: [
    { name: "GitHub", url: "https://github.com/test", icon_class: "bi bi-github" },
  ],

  visuals: {
    mascot_image: "/src/assets/img/lancy.svg",
    layout: {
      page_margin_left: "2rem",
      page_margin_right: "1rem",
      nav_pill_expanded_width: "8rem",
      nav_menu_width: "6rem",
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
    action: "mailto:layout-test@example.com",
  },

  quote: "Layout test quote",
  copyright: "&copy; Layout Test",
  credits: ["Config: Layout test"],

  legal: {
    enabled: true,
    link_text: "Legal Notice",
    privacy_enabled: true,
    privacy_link_text: "Privacy Policy",
    legal_name: "Layout Test Corp",
    legal_address: "123 Layout Test Way",
    legal_email: "layout-test@example.com",
    privacy_email: "privacy@layout-test.com",
    legal_phone: "+1555000003",
    business_license: "Test: Sole Proprietor",
    vat_id: "TEST123",
    jurisdiction: "Testland",
    disclaimer: "legal-guide",
    legal_note: "Layout test note",
  },

  mathjax: {
    packages: ['base', 'ams'],
  },

  codeBlocks: {
    frames: { enabled: true, showCopyButton: true, defaultFrame: 'code' },
    lineNumbers: false,
  },
};

export default themeConfig;
