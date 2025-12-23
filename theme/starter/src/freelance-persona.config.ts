// src/config.ts
import type { PersonaConfig } from 'astro-freelance-persona/types';

export const themeConfig: PersonaConfig = {
  title: "freelance-persona - Astro5 Theme ",
  author: "freelance-persona, Astro Theme",
  description: "A modern, responsive and lightweight theme for resume, portfolio, and blog.",

  // Contact Data
  email: "hanson.hschang+persona.zola.theme@gmail.com",
  phone: "+1234567890",
  address: "123 Persona Way, Remote City",

  // Visuals Config
  visuals: {
    layout: {
      // Defines the empty area/gap on the left side of the page.
      // The sidebar floats over this area.
      page_margin_left: "140px",
      // margin_right: "5em", // Uncomment to set manually. Defaults to page_margin_left
      // can take any CSS unit (em, px, vw, etc.)
    },
    scroll_animations: {
      enabled: true,
      duration: 600
    }
  },

  social_links: [
    {
      name: "GitHub",
      url: "https://github.com/hanson-hschang/persona-zola-theme",
      icon_class: "bi bi-github"
    },
  ],


  web3form_public_key: "your-access-key-here",

  quote: "There's the private persona and the public persona, and the two shall never meet. --- Liev Schreiber",

  copyright: "&copy; All Rights Reserved",
  credits: "Powered by [Zola](https://www.getzola.org/), [Bootstrap](https://getbootstrap.com/), and [Web3Forms](https://web3forms.com/)"
};

export default themeConfig;
