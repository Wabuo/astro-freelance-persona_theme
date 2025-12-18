import type { AstroIntegration } from 'astro';
import { fileURLToPath } from 'url';
import path from 'path';

export default function freelancePersona(): AstroIntegration {
  return {
    name: 'astro-freelance-persona',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        // 1. Get the absolute path to the theme folder
        // This calculates the path relative to THIS file (integration.ts)
        const currentDir = path.dirname(fileURLToPath(import.meta.url));
        
        // 2. Inject Aliases
        updateConfig({
          vite: {
            resolve: {
              alias: {
                // The Theme Engine (points to src/freelance-persona/)
                '@freelance-persona': currentDir,
                
                // The User Config (points to the USER'S src/freelance-persona.config.ts)
                '@freelance-persona/config': path.resolve(process.cwd(), 'src/freelance-persona.config.ts')
              },
            },
            css: {
              preprocessorOptions: {
                scss: {
                  silenceDeprecations: [
                    'legacy-js-api',
                    'color-functions',
                    'import',
                    'global-builtin',
                    'if-function',
                  ],
                },
              },
            },
          },
        });
      },
    },
  };
}