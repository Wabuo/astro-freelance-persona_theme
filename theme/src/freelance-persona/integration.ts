// src/freelance-persona/integration.ts
import type { AstroIntegration } from 'astro';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

export default function freelancePersona(): AstroIntegration {
  return {
    name: 'astro-freelance-persona',
    hooks: {
      'astro:config:setup': ({ updateConfig, config }) => {
        const currentDir = path.dirname(fileURLToPath(import.meta.url));
        const projectRoot = fileURLToPath(config.root);
        const configPath = path.resolve(projectRoot, 'src/freelance-persona.config.ts');
        const utilsPath = path.resolve(currentDir, 'utils');

        // Read config file content to serve as virtual module
        // This avoids resolution issues in Node/SSR where aliases fail for external deps
        let configContent = '';
        try {
          configContent = fs.readFileSync(configPath, 'utf-8');
        } catch (e) {
          console.warn(`[FreelancePersona] Could not read config at ${configPath}. Using defaults.`);
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
          vite: {
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
              noExternal: ['astro-freelance-persona_theme']
            }
          },
        });
      },
    },
  };
}