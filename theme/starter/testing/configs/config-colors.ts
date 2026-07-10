// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import type { PersonaConfig } from 'astro-freelance-persona_theme/types';
import { astroMajorVersion } from 'astro-freelance-persona_theme/utils/buildInfo';

/**
 * Config Matrix: Color Overrides
 * High-contrast values to visually verify CSS variable propagation
 */
export const themeConfig: PersonaConfig = {
  title: `freelance-persona — Config: Colors (Astro ${astroMajorVersion})`,
  author: "freelance-persona Theme Test",
  description: "Config matrix test for color overrides",

  email: "colors-test@example.com",
  phone: "+1555000001",
  address: "123 Color Test Way",

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
    light: {
      background: "#ffffff",
      surface: "#ffffff",
      text: "#272829",
      muted: "#6c757d",
      heading: "#45505b",
      accent: "#0563bb",
      contrast: "#ffffff",
      card_background: "#ffffff",
      card_border: "rgba(0, 0, 0, 0.125)",
      code_background: "#f6f6f6",
      tag_background: "#f0f0f0",
      tag_text: "#333333",
      tag_border: "#dddddd",
      input_background: "#ffffff",
      input_border: "#ced4da",
      input_text: "#212529",
      nav_color: "#45505b",
      nav_hover_color: "#0563bb",
      nav_mobile_background: "#ffffff",
      nav_dropdown_background: "#ffffff",
      nav_dropdown_color: "#212529",
      nav_dropdown_hover: "#0563bb",
      header_background: "rgba(255, 255, 255, 0.82)",
      header_color: "#ffffff",
    },
    dark: {
      background: "#ff0000",       // HIGH CONTRAST: Red
      surface: "#00ff00",          // HIGH CONTRAST: Green
      text: "#ffff00",             // HIGH CONTRAST: Yellow
      heading: "#00ffff",          // HIGH CONTRAST: Cyan
      accent: "#ff00ff",           // HIGH CONTRAST: Magenta
      contrast: "#000000",
      muted: "#888888",
      card_background: "#0000ff",  // HIGH CONTRAST: Blue
      card_border: "#ff8800",
      code_background: "#222222",
      tag_background: "#333333",
      tag_text: "#ffffff",
      tag_border: "#555555",
      input_background: "#111111",
      input_border: "#444444",
      input_text: "#ffffff",
      nav_color: "#ffff00",
      nav_hover_color: "#ff00ff",
      nav_mobile_background: "#00ff00",
      nav_dropdown_background: "#0000ff",
      nav_dropdown_color: "#ffffff",
      nav_dropdown_hover: "#ffff00",
      header_background: "rgba(255, 0, 0, 0.82)",
      header_color: "#ffffff",
    },
  },

  fonts: {
    headings: "Raleway",
    body: "Roboto",
    navigation: "Poppins",
    monospace: "Courier New",
  },

  contact_form: {
    provider: "mailto",
    action: "mailto:colors-test@example.com",
  },

  quote: "Color test quote",
  copyright: "&copy; Color Test",
  credits: ["Config: Colors test"],

  legal: {
    enabled: true,
    link_text: "Legal Notice",
    privacy_enabled: true,
    privacy_link_text: "Privacy Policy",
    legal_name: "Color Test Corp",
    legal_address: "123 Color Test Way",
    legal_email: "colors-test@example.com",
    privacy_email: "privacy@colors-test.com",
    legal_phone: "+1555000001",
    business_license: "Test: "Sole Proprietor",
    vat_id: "TEST123",
    jurisdiction: "Testland",
    disclaimer: "legal-guide",
    legal_note: "Color test note",
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