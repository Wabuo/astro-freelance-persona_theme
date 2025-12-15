import { defineConfig } from 'astro/config';

export default defineConfig({
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // Added 'if-function' and 'mixed-decls' to the silence list
          silenceDeprecations: [
            'legacy-js-api', 
            'color-functions', 
            'import', 
            'global-builtin', 
            'if-function', 
            // 'mixed-decls'
          ],
        },
      },
    },
  },
});