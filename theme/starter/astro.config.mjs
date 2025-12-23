// @ts-check
// starter/astro.config.mjs
import { defineConfig } from 'astro/config';
import freelancePersona from 'astro-freelance-persona';

export default defineConfig({
  integrations: [
    freelancePersona()
  ],
})