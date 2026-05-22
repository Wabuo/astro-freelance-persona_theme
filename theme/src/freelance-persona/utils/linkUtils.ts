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
