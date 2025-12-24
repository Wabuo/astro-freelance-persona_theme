//  starter/src/freelance-persona.config.ts
import type { PersonaConfig } from 'astro-freelance-persona_theme/types';

export const themeConfig: PersonaConfig = {
  // ===================================================================================
  // 1. SITE IDENTITY
  // ===================================================================================
  title: "freelance-persona — a Astro5 Theme ",
  author: "freelance-persona, Astro Theme", // Used for meta tags and the 'theme_author' token
  description: "A modern, responsive and lightweight theme for freelancers, portfolio, and blog.",

  // ===================================================================================
  // 2. CONTACT DETAILS
  // ===================================================================================
  // These values are used in the Contact section when you use tokens like 'theme_email'.
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
    // Add more links here...
  ],

  // ===================================================================================
  // 4. VISUAL CUSTOMIZATION
  // ===================================================================================
  visuals: {
    layout: {
      // Defines the empty area/gap on the left side of the page.
      // The sidebar floats over this area.
      page_margin_left: "140px",

      // margin_right: "5em", // <- Uncomment to set manually. Defaults to page_margin_left
      // Note: You can use any CSS unit (em, px, vw, etc.)
    },
    scroll_animations: {
      enabled: true,
      duration: 600 // Animation duration in milliseconds
    }
  },

  fonts: {
    // I recommen to use @fontsource/font-name //e.g. run `bun add @fontsource/some-font-name`
    // But you can also use a font CDN or standard system fonts.
    // Make sure to import them in src/fonts.ts if using custom ones.
    headings: "Poppins",
    body: "Roboto",
    navigation: "Raleway",
    monospace: '"Courier New", Courier, monospace'
  },

  // ===================================================================================
  // 5. INTEGRATIONS & EXTRAS
  // ===================================================================================

  // Power your contact form with Web3Forms (https://web3forms.com/)
  // Leave empty if you don't want to use the form.
  web3form_public_key: "your-access-key-here",

  // Footer Content
  quote: "There's the private persona and the public persona, and the two shall never meet. --- Liev Schreiber",
  copyright: "&copy; All Rights Reserved",
  credits: "Powered by [Astro5](https://www.astro.build/), [Bootstrap](https://getbootstrap.com/), and [Web3Forms](https://web3forms.com/)\n havily inspired by [Zola Persona](https://github.com/hanson-hschang/Persona-Zola-Theme)"
};

export default themeConfig;
