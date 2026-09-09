---
"astro-freelance-persona_theme": patch
---

fix: contact checkbox links. Checkbox labels (and other inline-markdown surfaces) resolve links through the theme's link pipeline — `[Privacy Policy](/legal/…)` honors `BASE_URL`, fixing 404s on subpath deployments.
