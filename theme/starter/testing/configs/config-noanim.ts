// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import type { PersonaConfig } from 'astro-freelance-persona_theme/types';
import { astroMajorVersion } from 'astro-freelance-persona_theme/utils/buildInfo';

/**
 * Config Matrix: Animations Disabled
 * Proves scroll_animations.enabled: false works at config level
 */
export const themeConfig: PersonaConfig = {
  title: `freelance-persona — Config: No Animations (Astro ${astroMajorVersion})`,
  author: "freelance-persona Theme Test",
  description: "Config matrix test for disabled animations",

  email: "noanim-test@example.com",
  phone: "+1555000003",
  address: "123 No Anim Way",

  social_links: [
    { name: "GitHub", url: "https://github.com/test", icon_class: "bi bi-github" },
  ],

  visuals: {
    mascot_image: "/src/assets/img/lancy.svg",
    layout: {
      page_margin_left: "8.875rem",
      nav_pill_expanded_width: "10.35rem",
    },
    scroll_animations: { enabled: false },
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
    action: "mailto:noanim-test@example.com",
  },

  quote: "No anim test quote",
  copyright: "&copy; No Anim Test",
  credits: ["Config: No Animations test"],

  legal: {
    enabled: true,
    link_text: "Legal Notice",
    privacy_enabled: true,
    privacy_link_text: "Privacy Policy",
    legal_name: "No Anim Test Corp",
    legal_address: "123 No Anim Way",
    legal_email: "noanim-test@example.com",
    privacy_email: "privacy@noanim-test.com",
    legal_phone: "+1555000003",
    business_license: "Test: Sole Proprietor",
    vat_id: "TEST123",
    jurisdiction: "Testland",
    disclaimer: "legal-guide",
    legal_note: "No anim test note",
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