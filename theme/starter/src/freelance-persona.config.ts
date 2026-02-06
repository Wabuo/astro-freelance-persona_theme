// SPDX-FileCopyrightText: 2026 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import type { PersonaConfig } from 'astro-freelance-persona_theme/types';

/**
 * FREELANCE PERSONA THEME CONFIGURATION
 * 
 * This file acts as the central control panel for your website. 
 * Settings defined here will override defaults from the theme.
 * 
 * Setting in page specific config files will take precedence over settings here.
 */

export const themeConfig: PersonaConfig = {
  // ===================================================================================
  // 1. SITE IDENTITY & METADATA
  // ===================================================================================
  title: "freelance-persona — a Astro5 Theme ",
  author: "freelance-persona, Astro Theme", // Used for meta tags and the 'theme_author' token
  description: "A modern, responsive and lightweight theme for freelancers, portfolio, and blog.\
  Initally ported from Persona-Zola, modernized and expanded with some custom adptions and the fetures section from Zola-Goyo ",

  // ===================================================================================
  // 2. CONTACT DETAILS
  // ===================================================================================
  // These values are used for the Legal Notice and throughout the site
  // when you use tokens like 'theme_email'.
  email: "example@example.com",
  phone: "+1234567890",
  address: "123 Persona Way, Remote City",

  // ===================================================================================
  // 3. SOCIAL MEDIA
  // ===================================================================================
  // Links displayed in the Hero section and Footer.
  // Icons use Bootstrap Icons (e.g., 'bi bi-github')
  social_links: [
    {
      name: "GitHub",
      url: "https://github.com/wabuo/astro_freelance-persona_theme",
      icon_class: "bi bi-github"
    },
    {
      name: "Mastodon",
      url: "https://mastodon.social",
      icon_class: "bi bi-mastodon"
    },
    {
      name: "Instagram",
      url: "https://instagram.com",
      icon_class: "bi bi-instagram"
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com",
      icon_class: "bi bi-linkedin"
    },
  ],

  // ===================================================================================
  // 4. VISUAL CUSTOMIZATION
  // ===================================================================================
  visuals: {
    layout: {
      // Defines the empty area/gap on the left side of the page.
      // The sidebar floats over this area.
      page_margin_left: "8.875rem", // "140px"

      //page_margin_right: "1em", // <- Uncomment to set manually. Defaults to page_margin_left
    },
    scroll_animations: {
      enabled: true,
      //duration: 600 // Animation duration in milliseconds
    },
    delays: {
      // heading: 100, // Defines how many ms after being triggered the animation will start
      // content: 400, 
      // stagger: 100 
    }
  },

  // -----------------------------------------------------------------------------------
  // A. Color Overrides
  // -----------------------------------------------------------------------------------
  // Uncomment and adjust these values to override the theme's core colors.
  // Values can be hex codes (#ffffff), rgb(), rgba(), or hsl().

  colors: {
    // Transparency Settings
    transparency: "25%",        // General overlay transparency (e.g. Hero)

    light: {
      // Core Interface Colors
      background: "#ffffff",      // Main site background
      surface: "#ffffff",         // Cards and boxed elements
      text: "#272829",            // Main body text
      muted: "#6c757d",           // Secondary text (dates, metadata)
      heading: "#45505b",         // Headers (h1-h6)

      // Brand Colors
      accent: "#0563bb",          // Primary action color (links, buttons)
      contrast: "#ffffff",        // Text on accent background

      // Navigation Specifics
      nav_color: "#45505b",
      // nav_hover_color: "#0563bb", // Defaults to accent
      nav_mobile_background: "#ffffff",
      nav_dropdown_background: "#ffffff",
      nav_dropdown_color: "#212529",
      // nav_dropdown_hover: "#0563bb", // Defaults to accent
      header_background: "rgba(255, 255, 255, 0.82)", // Glassmorphism header
      header_color: "#ffffff"
    },

    dark: {
      // Core Interface Colors
      background: "#1e1e1e",
      //background: "#1e1e1e",
      surface: "#303030",
      text: "#e0e0e0",
      muted: "#9a9996",
      heading: "#ffffff",
      //accent: "#3584e4", // Defaults to your main accent color. Uncomment to override.
      contrast: "#e0e0e0",
      //contrast: "#ffffff",

      // Component Colors (Previously hidden)
      card_background: "#303030",
      card_border: "#444444",

      tag_background: "#383838",
      tag_text: "#ffffff",
      tag_border: "#444444",

      input_background: "#242424",
      input_border: "#444444",
      input_text: "#ffffff",

      // Navigation Specifics
      nav_color: "#e0e0e0",
      // nav_hover_color: "#6ea8fe", // Defaults to dark mode accent
      nav_mobile_background: "#2c3035",
      nav_dropdown_background: "#2c3035",
      nav_dropdown_color: "#e0e0e0",
      // nav_dropdown_hover: "#6ea8fe", // Defaults to dark mode accent
      // header_background: "rgba(0, 0, 0, 0.82)", // Dark Glassmorphism // Defaults to hardcoded Adwaita dark
      // header_background: "#1e1e1ed1", // slightly more transparent than the default 82% vs 95% opacity
      header_color: "#ffffff"
    }
  },



  // -----------------------------------------------------------------------------------
  // B. Typography & Fonts
  // -----------------------------------------------------------------------------------
  fonts: {
    // I recommend using @fontsource packages. 
    // Example: `bun add @fontsource/adwaita-sans` and import in src/fonts.ts
    headings: "Adwaita Sans",
    body: "Adwaita Sans",
    navigation: '"sans-serif", "Raleway"',
    monospace: '"Adwaita Mono", Courier, monospace',

    // Font Size Overrides (Uncomment to adjust base sizes)
    /*
    sizes: {
      normal: "1rem",       // 16px - Base body text
      footer: "0.875rem",   // 14px - Footer text
      heading: "2rem",      // 32px - h2/h3 base
      subtitle: "1.5rem",   // 24px
      title: "4rem",        // 64px - Hero title
      nav_icon: "3.5rem"    // 56px - Mobile toggle icon
    }
    */
  },

  // ===================================================================================
  // 5. INTEGRATIONS
  // ===================================================================================

  /**
   * Contact Form Provider Configuration
   * Options: "formspark", "web3forms", "ntfy", "netlify", "mailto", "custom"
   */
  contact_form: {
    provider: "formspark",
    access_key: "your-access-key-here",
  },

  // ===================================================================================
  // 6. FOOTER & LEGAL
  // ===================================================================================
  quote: "Real stupidity beats artificial intelligence every time. --- From Hogfather",
  copyright: "&copy; All Rights Reserved",

  legal: {
    enabled: true,
    link_text: "Legal Notice",
    legal_name: "PUT YOUR LEGAL NAME HERE", //can be theme_name
    legal_address: "theme_address",
    legal_email: "theme_email",
    legal_phone: "theme_phone", //can be empty if unaplicable
    legal_note: "I love remote places. If I'm unavailable, I'm likely off-grid: flying, spelunking, or exploring. <br> Please email or SMS, and I'll reply upon my return to civilization.", // optional
    business_license: "Sole Proprietor / Put your business license here", //can be empty if unaplicable
    vat_id: "PUT YOUR VAT ID HERE", //can be empty if unaplicable
    jurisdiction: "PersonaCity, Country", // can be empty if unaplicable
    disclaimer: "src/content/legal/disclaimer.md",
  },

  credits: [
    "", // empty row at the top
    "Theme: [Freelance Persona](https://github.com/wabuo/astro_freelance-persona_theme)",
    "Contact form via [Formspark](https://formspark.io)",
    "With code and inspiration from [Zola Persona](https://github.com/hanson-hschang/Persona-Zola-Theme) & [Zola Goyo](https://github.com/hahwul/goyo)",
    "Powered by [Astro5](https://www.astro.build/), [Bootstrap](https://getbootstrap.com/), [Fontsource](https://fontsource.org/), [Akademicons](https://akademiicons.com/), [Katex](https://katex.org/) & [Marked](https://github.com/markedjs/marked)",
  ],
};

export default themeConfig;
