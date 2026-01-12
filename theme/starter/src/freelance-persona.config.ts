//  starter/src/freelance-persona.config.ts
import type { PersonaConfig } from 'astro-freelance-persona_theme/types';

export const themeConfig: PersonaConfig = {
  // ===================================================================================
  // 1. SITE IDENTITY
  // ===================================================================================
  // (Touch to force rebuild)
  title: "freelance-persona — a Astro5 Theme ",
  author: "freelance-persona, Astro Theme", // Used for meta tags and the 'theme_author' token
  description: "A modern, responsive and lightweight theme for freelancers, portfolio, and blog.\
  Initally ported from Persona-Zola, modernized and expanded with some custom adptions and the fetures section from Zola-Goyo ",

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


  // ===================================================================================
  // 2. CONTACT DETAILS
  // ===================================================================================
  // This will be used for the Lagal notice and in the Contact section
  // when you use tokens like 'theme_email'.
  email: "example@example.com",
  phone: "+1234567890",
  address: "123 Persona Way, Remote City",

  // ===================================================================================
  // 3. SOCIAL MEDIA
  // ===================================================================================
  // Links displayed in the Hero section and Footer.
  social_links: [
    {
      name: "GitHub",
      url: "https://github.com/wabuo/astro_freelance-persona_theme",
      icon_class: "bi bi-github" // Bootstrap Icon class
    },
    {
      name: "Mastodon",
      url: "https://mastodon.social",
      icon_class: "bi bi-mastodon" // Bootstrap Icon class
    },
    {
      name: "Instagram",
      url: "https://instagram.com",
      icon_class: "bi bi-instagram" // Bootstrap Icon class
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com",
      icon_class: "bi bi-linkedin" // Bootstrap Icon class
    },

    // Add more links here...
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
      // Note: You can use any CSS unit (em, px, vw, etc.)
    },
    scroll_animations: {
      enabled: true,
      //duration: 600 // Animation duration in milliseconds
    },
    delays: {
      //  heading: 100, // Defines how many ms after being triggerd the animation will start
      //content: 400, // Defines how many ms after being triggerd the animation will start
      //stagger: 100 // multiple content elements will be delayeded by this amount to eachother
    }
  },

  fonts: {
    // I recommen to use @fontsource/font-name //e.g. run `bun add @fontsource/some-font-name`
    // But you can also use a font CDN(bad for enduser privacy) or standard system fonts.
    // Make sure to import them in src/fonts.ts if using custom ones.
    headings: "Adwaita Sans",
    body: "Adwaita Sans",
    navigation: '"sans-serif", "Raleway"',
    monospace: '"Adwaita Mono", Courier, monospace'
  },

  // ===================================================================================
  // 5. INTEGRATIONS & EXTRAS
  // ===================================================================================

  // Depending on your setup checkout https://forwardemail.net/en/faq#quick-start for an
  // awsome opensource email forwarder and email alsias provider

  /**
   * Contact Form Provider Configuration
   *
   * Options:
   * - "formspark" (Default): Requires 'access_key' (Your Formspark Form ID)
   * - "web3forms": Requires 'access_key' (Your Web3Forms Access Key)
   * - "ntfy": Self-hosted or Public ntfy.sh. Requires 'ntfy_topic'.
   * - "netlify": standard Netlify form handling (automatic)
   * - "mailto": browser-only, opens user's email client
   * - "custom": Requires 'action' URL defined manually below
   */
  contact_form: {
    provider: "formspark", // "formspark" | "web3forms" | "ntfy" | "netlify" | "mailto" | "custom"
    access_key: "your-access-key-here", // Formspark ID or Web3Forms Key

    // Ntfy Configuration (only used if provider is 'ntfy')
    // ntfy_topic: "my-secret-topic",
    // ntfy_server: "https://ntfy.sh", // Change if self-hosting

    // Custom Action URL (if provider is 'custom' or overriding others)
    // action: "https://my-backend.com/contact",
  },

  // Footer Content
  quote: "Real stupidity beats artificial intelligence every time. --- From Hogfather",
  copyright: "&copy; All Rights Reserved",
  // Note: The theme automatically appends the configured contact form provider
  // (Formspark, Web3Forms, Ntfy, or Netlify) to the credits link in the footer.
  credits: [
    "Powered by [Astro5](https://www.astro.build/), [Bootstrap](https://getbootstrap.com/)", // form provider gets put here
    "With code and inspiration from [Zola Persona](https://github.com/hanson-hschang/Persona-Zola-Theme) & [Zola Goyo](https://github.com/hahwul/goyo)"
  ]
};

export default themeConfig;
