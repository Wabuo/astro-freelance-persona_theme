// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

/**
 * Build-time version introspection.
 *
 * Reads the resolved versions of core dependencies from their own
 * package.json files at build time, so config files and content can
 * reference real installed versions instead of hardcoded numbers.
 *
 * Usage in freelance-persona.config.ts:
 *   import { astroMajorVersion } from 'astro-freelance-persona_theme/utils/buildInfo';
 *   title: `freelance-persona — an Astro ${astroMajorVersion} Theme`,
 *
 * Usage in about.md frontmatter (via token replacement in AboutSection):
 *   subtitle:
 *     - "Astro {{astro_major}}+"
 *     - "UnoCSS {{unocss_major}}"
 */

import astroPkg from 'astro/package.json' with { type: 'json' };
import unocssPkg from 'unocss/package.json' with { type: 'json' };

// --- Astro ---

/** Full semver string, e.g. "6.3.8" */
export const astroVersion: string = astroPkg.version;

/** Major version, e.g. "6" */
export const astroMajorVersion: string = astroPkg.version.split('.')[0];

/** Major.minor version, e.g. "6.3" */
export const astroMinorVersion: string = astroPkg.version.split('.').slice(0, 2).join('.');

// --- UnoCSS ---

/** Full semver string, e.g. "66.7.5" */
export const unocssVersion: string = unocssPkg.version;

/** Major version, e.g. "66" */
export const unocssMajorVersion: string = unocssPkg.version.split('.')[0];

/** Major.minor version, e.g. "66.7" */
export const unocssMinorVersion: string = unocssPkg.version.split('.').slice(0, 2).join('.');

// --- Token map for content interpolation ---

/**
 * Map of `{{token}}` placeholders to their resolved values.
 * Used by components (e.g. AboutSection) to replace tokens in
 * user-authored frontmatter strings at build time.
 */
export const buildTokens: Record<string, string> = {
  'astro_version': astroVersion,
  'astro_major': astroMajorVersion,
  'astro_minor': astroMinorVersion,
  'unocss_version': unocssVersion,
  'unocss_major': unocssMajorVersion,
  'unocss_minor': unocssMinorVersion,
};

/**
 * Replace all `{{token}}` placeholders in a string with values from buildTokens.
 * Unknown tokens are left as-is.
 */
export function replaceBuildTokens(input: string): string {
  return input.replace(/\{\{(\w+)\}\}/g, (match, token) => {
    return buildTokens[token] ?? match;
  });
}
