// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

// src/freelance-persona/integration.ts
import type { AstroIntegration } from 'astro';
import astroExpressiveCode from 'astro-expressive-code';
import mdx from '@astrojs/mdx';
import remarkDirective from 'remark-directive';
import remarkMagicMath from './plugins/remarkMagicMath';
import rehypeRevealMath from './plugins/rehypeRevealMath';
import rehypeFigures from './plugins/rehypeFigures';
import remarkExtractImageParams from './plugins/remarkExtractImageParams';
import rehypeMathjaxChtml from 'rehype-mathjax/chtml.js';
import rehypeMathjaxSvg from 'rehype-mathjax/svg.js';
import { fileURLToPath, pathToFileURL } from 'url';
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

        // Load the parsed configuration object to extract custom mathjax settings
        let userMathPackages = ['mhchem', 'physics', 'color', 'cancel', 'mathtools'];
        try {
          if (fs.existsSync(configPath)) {
            const userConfigModule = await import(pathToFileURL(configPath).href);
            const userConfig = userConfigModule.default || userConfigModule.themeConfig || {};
            if (userConfig.mathjax?.packages && Array.isArray(userConfig.mathjax.packages)) {
              userMathPackages = userConfig.mathjax.packages;
            }
          }
        } catch (e) {
          console.warn(`[FreelancePersona] Failed to import packages config from ${configPath}. Using defaults.`, e);
        }

        updateConfig({
          markdown: {
            remarkPlugins: [
              remarkExtractImageParams,
              remarkDirective,
              remarkMagicMath
            ],
            rehypePlugins: [
              // Pass 1: Inline formulas (HTML/CHTML)
              [rehypeMathjaxChtml, {
                chtml: {
                  fontURL: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2'
                },
                tex: {
                  packages: { '[+]': userMathPackages }
                }
              }],
              // Pass 2: Unhide block math
              rehypeRevealMath,
              // Pass 3: Block formulas (SVG)
              [rehypeMathjaxSvg, {
                tex: {
                  packages: { '[+]': userMathPackages }
                }
              }],
              rehypeFigures
            ],
          },
          integrations: [
            mdx(),
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
            plugins: [],
            server: {
              fs: {
                allow: ['/']
              }
            },
            resolve: {
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