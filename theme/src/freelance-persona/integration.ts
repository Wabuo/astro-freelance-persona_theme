// src/freelance-persona/integration.ts
import type { AstroIntegration } from 'astro';
import { fileURLToPath } from 'url';
import path from 'path';

export default function freelancePersona(): AstroIntegration {
  return {
    name: 'astro-freelance-persona',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        const currentDir = path.dirname(fileURLToPath(import.meta.url));
        
        updateConfig({
          vite: {
            resolve: {
              // CHANGE: Use Array format to guarantee order
              alias: [
                { 
                  find: '@freelance-persona/config', 
                  replacement: path.resolve(process.cwd(), 'src/freelance-persona.config.ts') 
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
          },
        });
      },
    },
  };
}