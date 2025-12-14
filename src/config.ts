// src/config.ts
import type { PersonaConfig } from './types';

export const themeConfig: PersonaConfig = {
  title: "Persona - Zola Theme ",
  author: "Persona, Zola Theme",
  description: "A modern, responsive and lightweight theme for resume, portfolio, and blog.",
  
  social_links: [
    { 
      name: "GitHub", 
      url: "https://github.com/hanson-hschang/persona-zola-theme", 
      icon_class: "bi bi-github" 
    },
  ],
  
  contact_infos: [
    { 
      item: "Name", 
      content: "Persona, Zola Theme", 
      icon_class: "bi bi-person"
    },
    { 
      item: "Email", 
      content: "hanson.hschang+persona.zola.theme@gmail.com", 
      icon_class: "bi bi-envelope"
    }
  ],
  
  web3form_public_key: "your-access-key-here",
  
  quote: "There's the private persona and the public persona, and the two shall never meet. --- Liev Schreiber",
  
  // Note: We will handle the markdown parsing for these strings in the components later
  copyright: "&copy; All Rights Reserved",
  credits: "Powered by [Zola](https://www.getzola.org/), [Bootstrap](https://getbootstrap.com/), and [Web3Forms](https://web3forms.com/)"
};
