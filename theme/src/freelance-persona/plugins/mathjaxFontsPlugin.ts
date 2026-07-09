// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

// src/freelance-persona/plugins/mathjaxFontsPlugin.ts
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

export function mathjaxFontsPlugin() {
  let resolvedFontSourceDir = '';
  
  return {
    name: 'freelance-persona:mathjax-fonts',
    configResolved(config) {
      const projectRoot = config.root;
      resolvedFontSourceDir = path.join(projectRoot, 'node_modules', '@mathjax', 'mathjax-newcm-font', 'chtml', 'woff2');
    },
    async writeBundle({ dir }) {
      const outDir = path.join(dir, 'fonts', 'mathjax');
      fs.mkdirSync(outDir, { recursive: true });
      
      if (fs.existsSync(resolvedFontSourceDir)) {
        const files = fs.readdirSync(resolvedFontSourceDir);
        for (const file of files) {
          fs.copyFileSync(
            path.join(resolvedFontSourceDir, file),
            path.join(outDir, file)
          );
        }
        console.log(`\x1b[36m[FreelancePersona]\x1b[0m \x1b[32m✔ Copied ${files.length} MathJax fonts to build output\x1b[0m`);
      } else {
        console.warn(`\x1b[36m[FreelancePersona]\x1b[0m \x1b[33m⚠ MathJax font source not found at ${resolvedFontSourceDir}\x1b[0m`);
      }
    }
  };
}