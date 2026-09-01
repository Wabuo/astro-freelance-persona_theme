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
import UnoCSS from 'unocss/astro';

export default function freelancePersona(): AstroIntegration {
  return {
    name: 'astro-freelance-persona',
    hooks: {
      'astro:config:setup': async ({ updateConfig, config, injectScript }) => {
        const currentDir = path.dirname(fileURLToPath(import.meta.url));
        const projectRoot = fileURLToPath(config.root);
        const utilsPath = path.resolve(currentDir, 'utils');
        const unoConfigPath = path.resolve(currentDir, 'uno.config.ts');

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

        const isTestMode = process.env.PLAYWRIGHT_TEST === 'true';

        // --- Content-Security-Policy (default ON) ---
        // Astro hashes every script it processes; the theme's is:inline
        // scripts register themselves at render (BaseLayout, Astro.csp).
        // Opt-out in the theme config: security: { csp: false }.
        const themeConfigPath = process.env.THEME_CONFIG_PATH
          ? path.resolve(process.env.THEME_CONFIG_PATH)
          : path.join(projectRoot, 'src', 'freelance-persona.config.ts');
        let themeConfigText = '';
        try {
          themeConfigText = fs.readFileSync(themeConfigPath, 'utf-8');
        } catch {
          /* config file optional for CSP defaults */
        }
        const cspDisabled = /security\s*:\s*\{[^}]*csp\s*:\s*false/.test(
          themeConfigText,
        );
        const cspExtraMatch = themeConfigText.match(
          /cspExtra\s*:\s*\[([^\]]*)\]/,
        );
        const cspExtra = cspExtraMatch
          ? cspExtraMatch[1]
              .split(',')
              .map((s) => s.trim().replace(/^['"`]|['"`]$/g, ''))
              .filter(Boolean)
          : [];

        const cspDirectives = [
          "default-src 'self'",
          "img-src 'self' data:",
          "font-src 'self'",
          "connect-src 'self'",
          'object-src \'none\'',
          "base-uri 'self'",
          // Contact-form providers are all https; blocks injected-form exfiltration
          "form-action 'self' https:",
          // Content embeds (e.g. pasted video iframes) stay https-only
          "frame-src https:",
          'upgrade-insecure-requests',
          ...cspExtra,
        ];

        updateConfig({
          markdown: {
            processor: unified({
              remarkPlugins: remarkPluginsList,
              rehypePlugins: rehypePluginsList
            })
          },
          integrations: [
            UnoCSS({
              configFile: unoConfigPath,
            }),
            astroExpressiveCode({
              themes: ['github-light', 'github-dark'],
              // CSS-native theme switching strategy:
              // 1. useDarkModeMediaQuery handles OS preference (prefers-color-scheme)
              // 2. themeCssSelector adds a manual override for :has(.theme-state-dark)
              // 3. The edge case "OS dark + user forces light" is handled in
              //    _code-blocks.css (resets EC tokens/vars back to light).
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
            define: {
              __TEST_MODE__: isTestMode,
            },
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
            build: {
              // lightningcss (<1.34) cannot parse the anchor-positioning L2
              // container query in nav-home.css (@container anchored(...)) —
              // skip CSS minification until it ships. Tracked in To_Do.md.
              cssMinify: false,
            },
            ssr: {
              noExternal: ['astro-freelance-persona_theme', '@iconify-json/bi', '@iconify-json/academicons', 'astro-icon']
            }
          },
          security: cspDisabled
            ? undefined
            : {
                csp: {
                  algorithm: 'SHA-256' as const,
                  directives: cspDirectives,
                  // Styles: Astro auto-hashes its processed inline styles;
                  // 'unsafe-inline' covers the remaining is:inline style blocks
                  // and inline style attributes (low-severity, pervasive).
                  styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
                },
              },
        });
      },
    },
  };
}