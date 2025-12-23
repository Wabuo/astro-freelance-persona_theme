// @ts-check
// starter/astro.config.mjs
import { defineConfig } from 'astro/config';
import freelancePersona from 'astro-freelance-persona_theme';

export default defineConfig({
  integrations: [
    freelancePersona()
  ],
})