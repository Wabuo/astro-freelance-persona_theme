---
"astro-freelance-persona_theme": patch
---

fix: CSP inline styles. The default CSP combined Astro's auto-generated style hashes with `'unsafe-inline'` on style-src — per spec a hash makes `'unsafe-inline'` ignored, silently blocking every non-hashed inline style (set:html style blocks, nudges, define:vars, Shiki colors). The theme now re-declares `style-src-elem` / `style-src-attr` explicitly so they take effect.
