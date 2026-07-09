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
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';
import fs from 'fs';
import { mathjaxFontsPlugin } from './plugins/mathjaxFontsPlugin';

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

        // Load the parsed configuration object using a synchronous regex parser
        // to avoid "Vite module runner has been closed" errors in production builds.
        let userMathPackages = ['mhchem', 'physics', 'color', 'cancel', 'mathtools'];
        let codeBlocksConfig: { frames?: { enabled?: boolean; showCopyButton?: boolean; defaultFrame?: 'auto' | 'code' | 'terminal' | 'none' }; lineNumbers?: boolean } = {};
        try {
          if (fs.existsSync(configPath)) {
            const configText = fs.readFileSync(configPath, 'utf-8');
            const packagesMatch = configText.match(/packages\s*:\s*\[([^\]]*)\]/);
            if (packagesMatch) {
              const packagesListStr = packagesMatch[1];
              const pkgRegex = /['"`]([^'"`]+)['"`]/g;
              const extracted: string[] = [];
              let match;
              while ((match = pkgRegex.exec(packagesListStr)) !== null) {
                extracted.push(match[1]);
              }
              if (extracted.length > 0) {
                userMathPackages = extracted;
              }
            }

            // Parse codeBlocks config
            const codeBlocksMatch = configText.match(/codeBlocks\s*:\s*\{([\s\S]*?)\n\s*\}/);
            if (codeBlocksMatch) {
              const codeBlocksStr = codeBlocksMatch[1];
              const framesMatch = codeBlocksStr.match(/frames\s*:\s*\{([\s\S]*?)\}/);
              if (framesMatch) {
                const framesStr = framesMatch[1];
                codeBlocksConfig.frames = {};
                const enabledMatch = framesStr.match(/enabled\s*:\s*(true|false)/);
                if (enabledMatch) codeBlocksConfig.frames.enabled = enabledMatch[1] === 'true';
                const copyBtnMatch = framesStr.match(/showCopyButton\s*:\s*(true|false)/);
                if (copyBtnMatch) codeBlocksConfig.frames.showCopyButton = copyBtnMatch[1] === 'true';
                const frameMatch = framesStr.match(/defaultFrame\s*:\s*['"`](auto|code|terminal|none)['"`]/);
                if (frameMatch) codeBlocksConfig.frames.defaultFrame = frameMatch[1] as 'auto' | 'code' | 'terminal' | 'none';
              }
              const lineNumbersMatch = codeBlocksStr.match(/lineNumbers\s*:\s*(true|false)/);
              if (lineNumbersMatch) codeBlocksConfig.lineNumbers = lineNumbersMatch[1] === 'true';
            }
          }
        } catch (e) {
          console.warn(`[FreelancePersona] Failed to parse packages config from ${configPath}. Using defaults.`, e);
        }
        const framesConfig = codeBlocksConfig.frames ?? { enabled: true, showCopyButton: true, defaultFrame: 'code' };
        const terminalLanguages = ['sh', 'shell', 'bash', 'zsh', 'fish', 'powershell', 'ps', 'ps1', 'cmd', 'bat', 'batch', 'console', 'nu', 'nushell'];
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
              fontURL: '/fonts/mathjax/'
            },
            tex: {
              packages: ['base', 'ams', 'nocomplain', ...userMathPackages]
            }
          }],
          rehypeFigures
        ];

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
              frames: framesConfig.enabled === false ? false : {
                showCopyToClipboardButton: framesConfig.showCopyButton !== false,
                extractFileNameFromCode: false,
              },
              customCreateBlock: ({ input }) => {
                // Force 'code' frame for terminal languages to avoid the 3-dots terminal UI
                if (framesConfig.defaultFrame === 'code' && terminalLanguages.includes(input.language)) {
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
            plugins: [mathjaxFontsPlugin()],
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