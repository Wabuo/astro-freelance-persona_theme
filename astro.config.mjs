import { defineConfig } from 'astro/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        // MAGIC: Maps '@theme-config' to the CURRENT project's src/config.ts
        '@theme-config': path.resolve(process.cwd(), 'src/config.ts'),
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