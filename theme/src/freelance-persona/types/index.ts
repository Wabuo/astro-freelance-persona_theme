// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import type { ImageMetadata } from 'astro';

export interface SocialLink {
  name: string;
  url: string;
  icon_class: string;
}

export interface ContactInfo {
  item: string;
  content: string;
  icon_class: string;
}

// Visuals Engine Configuration
export interface VisualsConfig {
  scroll_animations?: {
    enabled?: boolean;
    duration?: number;
    threshold?: number;
    root_margin?: string;
  };
  delays?: {
    heading?: number;
    content?: number;
    stagger?: number;
  };
  layout?: {
    page_margin_left?: string;
    page_margin_right?: string;
    nav_menu_width?: string;
    nav_pill_expanded_width?: string;
  };
  mascot_image?: string;
}

export interface ColorPalette {
  // Core
  background?: string;
  text?: string; // --default-color
  heading?: string;
  accent?: string;
  surface?: string;
  contrast?: string;
  muted?: string;

  // Components
  card_background?: string;
  card_border?: string;

  tag_background?: string;
  tag_text?: string;
  tag_border?: string;

  input_background?: string;
  input_border?: string;
  input_text?: string;

  // Navigation
  nav_color?: string;
  nav_hover_color?: string;
  nav_mobile_background?: string;
  nav_dropdown_background?: string;
  nav_dropdown_color?: string;
  nav_dropdown_hover?: string;
  header_background?: string;
  header_color?: string;

  // Code Blocks
  code_background?: string;
}

export interface PersonaConfig {
  title: string;
  author: string;
  description: string;

  social_links: SocialLink[];

  // Contact Data (Source of Truth)
  email?: string;
  phone?: string;
  address?: string;

  // Contact Form Configuration
  contact_form?: {
    provider:
    | "formspark"
    | "web3forms"
    | "ntfy"
    | "netlify"
    | "mailto"
    | "custom";
    action?: string; // For explicit URLs or custom endpoints
    access_key?: string; // For Web3/Formspark
    ntfy_topic?: string;
    ntfy_server?: string; // Default: https://ntfy.sh
    checkboxes?: {
      id: string;
      label: string;
      required: boolean;
    }[];
  };

  /**
   * @deprecated Use theme_* vars in contact.md instead
   */
  contact_infos?: ContactInfo[];


  quote: string;
  copyright: string;
  credits: string | string[];

  // Color Configuration (Overrides base.scss)
  colors?: {
    transparency?: string; // --transparency (e.g. "25%")

    light?: ColorPalette;
    dark?: ColorPalette;

    // Backward compatibility / Shortcuts (optional, mapped to light/dark)
    primary?: string;
  };


  // New Visuals Config
  visuals?: VisualsConfig;

  // Font Configuration
  fonts?: {
    headings?: string;
    body?: string;
    navigation?: string;
    monospace?: string;

    // Font Sizes (Overrides base.scss)
    sizes?: {
      normal?: string; // --normal-font-size
      footer?: string; // --footer-font-size
      heading?: string; // --heading-font-size
      subtitle?: string; // --subtitle-font-size
      title?: string; // --title-font-size
      nav_icon?: string; // --nav-icon-size
    };
  };

  // Legal / Impressum Configuration
  legal?: {
    enabled?: boolean;
    link_text?: string; // e.g., "Legal Notice" or "Impressum"
    privacy_enabled?: boolean;
    privacy_link_text?: string; // e.g., "Privacy Policy"
    legal_name?: string; // Full legal name if different from author
    legal_address?: string; // Specific legal address or "theme_address"
    legal_email?: string; // Specific legal email or "theme_email"
    privacy_email?: string; // Specific privacy email, distinct from legal_email
    legal_phone?: string; // Specific legal phone or "theme_phone"
    business_license?: string;
    vat_id?: string;
    jurisdiction?: string;
    disclaimer?: string; // Optional markdown for legal disclaimer
    legal_note?: string; // Optional unintrusive note
  };

  // MathJax Configuration
  mathjax?: {
    packages?: string[];
  };

  // Code Blocks Configuration
  codeBlocks?: {
    frames?: {
      enabled?: boolean;              // Default: true
      showCopyButton?: boolean;       // Default: true
      defaultFrame?: 'auto' | 'code' | 'terminal' | 'none'; // Default: 'code'
    };
    lineNumbers?: boolean;            // Default: false
  };
}