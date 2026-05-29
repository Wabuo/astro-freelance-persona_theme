// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

// src/freelance-persona/integration.ts
import type { AstroIntegration } from 'astro';
import astroExpressiveCode from 'astro-expressive-code';
import remarkMath from 'remark-math';
import rehypeFigures from './plugins/rehypeFigures';
import rehypeKatexWrapper from './plugins/rehypeKatexWrapper';
import remarkExtractImageParams from './plugins/remarkExtractImageParams';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

export default function freelancePersona(): AstroIntegration {
  return {
    name: 'astro-freelance-persona',
    hooks: {
      'astro:config:setup': async ({ updateConfig, config }) => {
        const currentDir = path.dirname(fileURLToPath(import.meta.url));
        const projectRoot = fileURLToPath(config.root);
        const configPath = path.resolve(projectRoot, 'src/freelance-persona.config.ts');
        const utilsPath = path.resolve(currentDir, 'utils');

        // Read config file content to serve as virtual module
        // This avoids resolution issues in Node/SSR where aliases fail for external deps
        let configContent = '';
        try {
          configContent = fs.readFileSync(configPath, 'utf-8');
          console.log(`\x1b[36m[FreelancePersona]\x1b[0m \x1b[32m✔ Successfully loaded theme configuration\x1b[0m from \x1b[90msrc/freelance-persona.config.ts\x1b[0m`);
        } catch (e) {
          console.warn(`\x1b[36m[FreelancePersona]\x1b[0m \x1b[33m⚠ Could not find ${configPath}. Using default framework configuration.\x1b[0m`);
          configContent = 'export const themeConfig = {}; export default themeConfig;';
        }

        // Write to a temporary generated file to ensure Vite treats it as TypeScript
        // This avoids "Virtual Module" transformation issues
        const generatedConfigPath = path.resolve(projectRoot, 'src/freelance-persona-config-generated.ts');
        try {
          fs.writeFileSync(generatedConfigPath, configContent);
        } catch (e) {
          console.error(`[FreelancePersona] Failed to write generated config:`, e);
        }

        updateConfig({
          markdown: {
            remarkPlugins: [remarkExtractImageParams, remarkMath],
            rehypePlugins: [rehypeKatexWrapper, rehypeFigures],
          },
          integrations: [
            astroExpressiveCode({
              themes: ['github-light', 'github-dark'],
              // CSS-native theme switching strategy:
              // 1. useDarkModeMediaQuery handles OS preference (prefers-color-scheme)
              // 2. themeCssSelector adds a manual override for :has(.theme-state-dark)
              // 3. The edge case "OS dark + user forces light" is handled in
              //    _code-blocks.scss (resets EC tokens/vars back to light).
              //
              // NOTE: EC's themeCssSelector does NOT support @media at-rules —
              // it only accepts plain CSS selectors.
              useDarkModeMediaQuery: true,
              themeCssSelector: (theme) => {
                if (theme.name === 'github-dark') {
                  // Manual dark override: user explicitly chose dark on a light-OS.
                  // NOTE: Do NOT include ':root' or '&' here — EC wraps with :root
                  // internally and appends .expressive-code automatically.
                  // Returning ':root:has(...) &' caused :root:root:has(...) .expressive-code .expressive-code
                  return ':has(.theme-state-dark:checked)';
                }
                // Light is the default base — no extra selector needed
                return false;
              },
              useThemedScrollbars: false,
              styleOverrides: {
                borderRadius: '0.5rem',
                codePaddingInline: '1.25rem',
                codePaddingBlock: '1.25rem',
                // Using our theme variables for a designed-in look
                codeBackground: 'var(--code-background)',
                uiFontFamily: 'var(--default-font)',
                codeFontFamily: 'var(--monospace-font)',
              }
            })
          ],
          vite: {
            server: {
              fs: {
                allow: ['/']
              }
            },
            resolve: {
              // Force Vite to resolve katex from the project root, not from
              // rehype-katex's own node_modules. Without this, package managers
              // may install katex@0.16.x (rehype-katex's range) alongside our
              // katex@0.17.x, creating two independent singletons. The mhchem
              // side-effect import in rehypeKatexWrapper registers \ce on one
              // singleton while rehype-katex renders on the other → broken.
              // dedupe ensures a single shared katex instance for all importers.
              dedupe: ['katex'],
              alias: [
                {
                  find: '@freelance-persona/config',
                  replacement: generatedConfigPath
                },
                {
                  find: '@freelance-persona/utils',
                  replacement: utilsPath
                },
                {
                  find: '@freelance-persona',
                  replacement: currentDir
                }
              ]
            },
            css: {
              preprocessorOptions: {
                scss: {
                  silenceDeprecations: ['legacy-js-api', 'color-functions', 'import', 'global-builtin', 'if-function'],
                },
              },
            },
            ssr: {
              noExternal: ['astro-freelance-persona_theme', '@iconify-json/bi', '@iconify-json/academicons', 'astro-icon']
            }
          },
        });
      },

    },
  };
}