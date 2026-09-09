---
"astro-freelance-persona_theme": patch
---

fix: bump @astrojs/markdown-remark to ^7.3.0. Required by @astrojs/mdx v8 — Renovate's mdx major bump landed without its matching companion, and mdx v8 rejects markdown-remark < 7.3 with "`@astrojs/markdown-remark` is too old to render `.mdx` files" during the playground build.
