import { defineConfig } from 'astro/config';
import freelancePersona from './src/freelance-persona/integration';

export default defineConfig({
  integrations: [
    freelancePersona()
  ],
});