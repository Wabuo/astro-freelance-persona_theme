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
  // Rasterize SVG sources through sharp for social-preview (og:image)
  // bitmaps — WhatsApp & friends can't draw SVG in link cards. Scope:
  // first-party assets only (the flag enables sharp SVG processing
  // site-wide, which is why it is opt-in upstream).
  image: {
    dangerouslyProcessSVG: true,
  },
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
      // Exclude utility pages from sitemap *recommendation*; they remain
      // crawlable. Legal pages additionally carry robots meta
      // "noindex, noarchive" (theme config: legal.noindex). Error pages
      // are skipped by search engines via their status codes.
      // changefreq/priority are ignored by Google; lastmod is only
      // trusted when accurate, so none of them are emitted.
      filter: (page) => !page.includes('/legal/') && !/\/(403|404)\/?$/.test(page),
    }),
    freelancePersona()
  ],
})