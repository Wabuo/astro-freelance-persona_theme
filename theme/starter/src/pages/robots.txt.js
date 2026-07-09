// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

// @ts-check
// Generates robots.txt at build time
// Legal pages disallowed to prevent email indexing in search results

export async function GET({ site }) {
  const base = site || 'https://example.com';
  const content = `User-agent: *
Allow: /
Disallow: /legal/

Sitemap: ${new URL('sitemap-index.xml', base).href}
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}