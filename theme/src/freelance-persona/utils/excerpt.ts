/*
 * SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
 *
 * SPDX-License-Identifier: MIT
 */

/**
 * Strips markdown to plain text for teaser/excerpt rendering.
 * Shared by post-card previews (mock page render) and the
 * list-page teaser rows.
 */
export function getExcerpt(body: string | undefined): string {
  if (!body) return "";
  return body
    .replace(/^#+\s+/gm, "") // Remove headers
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Remove links, keep text
    .replace(/[*_`]/g, "") // Remove formatting chars
    .replace(/!\[[^\]]*\]\([^\)]+\)/g, "") // Remove images
    .replace(/<br\s*\/?>/gi, "\n") // Convert <br> to newline
    .trim();
}
