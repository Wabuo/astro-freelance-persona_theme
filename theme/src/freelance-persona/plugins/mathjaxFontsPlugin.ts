// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

// src/freelance-persona/plugins/mathjaxFontsPlugin.ts
import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';

export function mathjaxFontsPlugin() {
  let resolvedFontSourceDir = '';
  let resolvedFinalOutDir = '';

  return {
    name: 'freelance-persona:mathjax-fonts',
    configResolved(config) {
      // The woff-v2 CHTML fonts are data files of the mathjax-full
      // dependency, NOT build artifacts of this theme — so their
      // location must be resolved like any dependency data: through
      // Node's resolution walk from this module's own context. That
      // works for both install layouts:
      //  - repo/workspace layout with nested theme/node_modules
      //  - published npm installs, where bun/npm hoist mathjax-full
      //    to the consumer's top-level node_modules (a
      //    node_modules/astro-freelance-persona_theme/node_modules/
      //    path does not exist there).
      try {
        const requireFromTheme = createRequire(import.meta.url);
        resolvedFontSourceDir = path.join(
          path.dirname(requireFromTheme.resolve('mathjax-full/package.json')),
          'es5', 'output', 'chtml', 'fonts', 'woff-v2',
        );
      } catch (resolveError) {
        resolvedFontSourceDir = '';
        console.warn(`\x1b[36m[FreelancePersona]\x1b[0m \x1b[33m⚠ Could not resolve mathjax-full from the theme package context: ${resolveError instanceof Error ? resolveError.message : String(resolveError)}\x1b[0m`);
      }
      // Astro 7 runs multiple Vite passes; writeBundle fires for the
      // prerender pass (dist/.prerender) AND the final pass (dist).
      // Copy only in the pass that writes the configured final output.
      resolvedFinalOutDir = path.resolve(config.root, config.build.outDir || 'dist');
    },
    async writeBundle({ dir }) {
      if (!dir || path.resolve(dir) !== resolvedFinalOutDir) return;
      const outDir = path.join(dir, 'fonts', 'mathjax');
      fs.mkdirSync(outDir, { recursive: true });

      if (resolvedFontSourceDir && fs.existsSync(resolvedFontSourceDir)) {
        const files = fs.readdirSync(resolvedFontSourceDir);
        let copied = 0;

        for (const file of files) {
          if (file.endsWith('.woff') || file.endsWith('.woff2')) {
            fs.copyFileSync(
              path.join(resolvedFontSourceDir, file),
              path.join(outDir, file)
            );
            copied++;
          }
        }
        console.log(`\x1b[36m[FreelancePersona]\x1b[0m \x1b[32m✔ Copied ${copied} MathJax fonts to build output\x1b[0m`);
      } else {
        if (resolvedFontSourceDir) {
          console.warn(`\x1b[36m[FreelancePersona]\x1b[0m \x1b[33m⚠ MathJax font source not found at ${resolvedFontSourceDir}\x1b[0m`);
        }
      }
    }
  };
}
