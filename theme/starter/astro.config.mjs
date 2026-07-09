// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

// @ts-check
// starter/astro.config.mjs
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import freelancePersona from 'astro-freelance-persona_theme';

export default defineConfig({
  site: process.env.SITE_URL || 'https://example.com',
  base: process.env.BASE_PATH ? (process.env.BASE_PATH.endsWith('/') ? process.env.BASE_PATH : process.env.BASE_PATH + '/') : undefined,
  integrations: [
    icon({
      include: {
        bi: ['*'],
        academicons: ['*']
      }
    }),
    sitemap({
      filter: (page) => true,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
    freelancePersona()
  ],
})