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
 *     - "Bootstrap {{bootstrap_major}}"
 */

import astroPkg from 'astro/package.json' with { type: 'json' };
import bootstrapPkg from 'bootstrap/package.json' with { type: 'json' };

// --- Astro ---

/** Full semver string, e.g. "6.3.8" */
export const astroVersion: string = astroPkg.version;

/** Major version, e.g. "6" */
export const astroMajorVersion: string = astroPkg.version.split('.')[0];

/** Major.minor version, e.g. "6.3" */
export const astroMinorVersion: string = astroPkg.version.split('.').slice(0, 2).join('.');

// --- Bootstrap ---

/** Full semver string, e.g. "5.3.8" */
export const bootstrapVersion: string = bootstrapPkg.version;

/** Major version, e.g. "5" */
export const bootstrapMajorVersion: string = bootstrapPkg.version.split('.')[0];

/** Major.minor version, e.g. "5.3" */
export const bootstrapMinorVersion: string = bootstrapPkg.version.split('.').slice(0, 2).join('.');

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
  'bootstrap_version': bootstrapVersion,
  'bootstrap_major': bootstrapMajorVersion,
  'bootstrap_minor': bootstrapMinorVersion,
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
