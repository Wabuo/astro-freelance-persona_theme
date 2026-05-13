// SPDX-FileCopyrightText: 2026 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

// @ts-check
// starter/astro.config.mjs
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import freelancePersona from 'astro-freelance-persona_theme';

export default defineConfig({
  integrations: [
    icon({
      include: {
        bi: ['*'],
        academicons: ['*']
      }
    }),
    freelancePersona()
  ],
})