// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import type { PersonaConfig } from 'astro-freelance-persona_theme/types';
import { astroMajorVersion } from 'astro-freelance-persona_theme/utils/buildInfo';

/**
 * Config Matrix: Contact Form Provider (mailto)
 * Proves contact_form.provider switching works
 */
export const themeConfig: PersonaConfig = {
  title: `freelance-persona — Config: Contact Mailto (Astro ${astroMajorVersion})`,
  author: "freelance-persona Theme Test",
  description: "Config matrix test for contact form provider",

  email: "contact-test@example.com",
  phone: "+1555000004",
  address: "123 Contact Test Blvd",

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
    headings: "Raleway",
    body: "Roboto",
    navigation: "Poppins",
    monospace: "Courier New",
  },

  contact_form: {
    provider: "mailto",
    action: "mailto:contact-test@example.com",
    checkboxes: [
      {
        id: "privacy_consent",
        label: "I agree to the [Privacy Policy](/legal/privacy-policy). My data will be processed solely for handling this inquiry.",
        required: true,
      },
      {
        id: "marketing_consent",
        label: "I would like to receive occasional updates and newsletters.",
        required: false,
      },
    ],
  },

  quote: "Contact test quote",
  copyright: "&copy; Contact Test",
  credits: ["Config: Contact provider test"],

  legal: {
    enabled: true,
    link_text: "Legal Notice",
    privacy_enabled: true,
    privacy_link_text: "Privacy Policy",
    legal_name: "Contact Test Corp",
    legal_address: "123 Contact Test Blvd",
    legal_email: "contact-test@example.com",
    privacy_email: "privacy@contact-test.com",
    legal_phone: "+1555000004",
    business_license: "Test: Sole Proprietor",
    vat_id: "TEST123",
    jurisdiction: "Testland",
    disclaimer: "legal-guide",
    legal_note: "Contact test note",
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