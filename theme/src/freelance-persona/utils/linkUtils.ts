// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

/**
 * Resolves a URL to be safe for base-path / subpath hosting.
 * Handles external URLs, hashes, and internal relative/absolute paths.
 */
export function resolveLink(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("#") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:")
  ) {
    return url;
  }
  // Strip leading slash if present to avoid double slash when concatenating with BASE_URL
  const cleanPath = url.startsWith("/") ? url.slice(1) : url;
  
  // Ensure we have a trailing slash in BASE_URL
  const baseUrl = import.meta.env.BASE_URL || "/";
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  
  return `${normalizedBase}${cleanPath}`;
}

/**
 * Post-processes HTML produced by marked's `parseInline()` so internal
 * root-absolute links (`href="/..."`) become BASE_URL-aware.
 *
 * Use this for ANY internal link that comes from markdown-controlled
 * content (checkbox labels, markdown config fields, ...): raw
 * `parseInline()` output is NOT BASE_URL-aware and breaks on subpath
 * hosting (e.g. GitHub Pages) by pointing at the domain root.
 *
 * Only `href="/path"` gets rewritten; protocol-relative (`//`), empty,
 * http(s)/mailto/tel/hash hrefs pass through untouched.
 */
export function resolveParsedInline(html: string): string {
  return html.replace(/href="([^"]*)"/g, (match, url: string) => {
    if (!url.startsWith("/") || url.startsWith("//")) return match;
    return `href="${resolveLink(url)}"`;
  });
}
