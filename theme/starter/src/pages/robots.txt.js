// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

// @ts-check
// Generates robots.txt at build time.
// Legal pages are intentionally NOT crawl-blocked: they carry a
// robots meta "noindex, noarchive" (theme config: legal.noindex),
// which requires the crawler to read the page. Blocking them here
// would make the noindex directive invisible to crawlers.

export async function GET({ site }) {
  // The sitemap files are emitted at the build output root, which is
  // served under base on subpath deployments (e.g. GitHub Pages
  // project sites): site origin + BASE_URL + sitemap-index.xml.
  const sitemapUrl = new URL(
    'sitemap-index.xml',
    new URL(import.meta.env.BASE_URL, site || 'https://example.com'),
  ).href;

  const content = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}