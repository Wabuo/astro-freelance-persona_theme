// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

// src/freelance-persona/integration.ts
import type { AstroIntegration } from 'astro';
import astroExpressiveCode from 'astro-expressive-code';
import mdx from '@astrojs/mdx';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import remarkMagicMath from './plugins/remarkMagicMath';
import rehypeFigures from './plugins/rehypeFigures';
import remarkExtractImageParams from './plugins/remarkExtractImageParams';
import rehypeMathjaxChtml from 'rehype-mathjax/chtml';
import { unified } from '@astrojs/markdown-remark';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { mathjaxFontsPlugin } from './plugins/mathjaxFontsPlugin';
import { virtualConfigPlugin } from './plugins/virtualConfig';

export default function freelancePersona(): AstroIntegration {
  return {
    name: 'astro-freelance-persona',
    hooks: {
      'astro:config:setup': async ({ updateConfig, config }) => {
        const currentDir = path.dirname(fileURLToPath(import.meta.url));
        const projectRoot = fileURLToPath(config.root);
        const utilsPath = path.resolve(currentDir, 'utils');

        const remarkPluginsList = [
          remarkExtractImageParams,
          remarkDirective,
          remarkMath,
          remarkMagicMath
        ];

        const rehypePluginsList = [
          // Single-Pass: Process all formulas (Inline & Block) into CHTML
          [rehypeMathjaxChtml, {
            chtml: {
              fontURL: '/fonts/mathjax/',
              adaptiveCSS: false
            },
            tex: {
              packages: ['base', 'ams', 'nocomplain', ...['mhchem', 'physics', 'color', 'cancel', 'mathtools']]
            }
          }],
          rehypeFigures
        ];

        const terminalLanguages = ['sh', 'shell', 'bash', 'zsh', 'fish', 'powershell', 'ps', 'ps1', 'cmd', 'bat', 'batch', 'console', 'nu', 'nushell'];

        updateConfig({
          markdown: {
            processor: unified({
              remarkPlugins: remarkPluginsList,
              rehypePlugins: rehypePluginsList
            })
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
              frames: {
                showCopyToClipboardButton: true,
                extractFileNameFromCode: false,
              },
              customCreateBlock: ({ input }) => {
                // Force 'code' frame for terminal languages to avoid the 3-dots terminal UI
                if (terminalLanguages.includes(input.language)) {
                  return { ...input, props: { ...input.props, frame: 'code' } };
                }
                return input;
              },
              styleOverrides: {
                borderRadius: '0.5rem',
                codePaddingInline: '1.25rem',
                codePaddingBlock: '1.25rem',
                // Using our theme variables for a designed-in look
                codeBackground: 'var(--code-background)',
                uiFontFamily: 'var(--default-font)',
                codeFontFamily: 'var(--monospace-font)',
                frames: {
                  terminalTitlebarDotsOpacity: '0',
                  editorBackground: 'var(--code-background)',
                  terminalBackground: 'var(--code-background)',
                }
              }
            }),
            mdx()
          ],
          vite: {
            plugins: [mathjaxFontsPlugin(), virtualConfigPlugin()],
            server: {
              fs: {
                allow: ['/']
              }
            },
            resolve: {
              alias: [
                {
                  find: '@freelance-persona/config',
                  replacement: 'virtual:freelance-persona-config'
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