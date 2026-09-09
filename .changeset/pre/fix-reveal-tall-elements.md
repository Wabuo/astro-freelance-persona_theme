---
"astro-freelance-persona_theme": patch
---

fix: reveal elements taller than one viewport rendered blank. The scroll-reveal observer used a ratio threshold (0.1): an element taller than 10 viewports can never reach 10% visibility, so long blog posts rendered blank until scrolled far enough. The observer now fires on any intersection, with the configured threshold translated into a height-independent bottom viewport inset.
