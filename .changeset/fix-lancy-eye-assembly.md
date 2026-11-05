---
"astro-freelance-persona_theme": patch
---

Fix the Lancy eye assembly being left behind in the renditions whose eye background/mouth moved up with the head-geometry refinement: the blue outline (`path5`) and the eyeball group (`g18`, pupil + sparkle) kept the old offsets, so the white poked out above the ring and the pupil sat low. Both are re-seated at the source rendition's canonical offsets (`translate(0,-1.6045879)` in each file's own frame, compensated per ancestor matrix for the pre-scaled variants: `lancy_blog.svg`'s 3.115×/1.17× chain, `avatar.svg`'s 1.84× matrix, `background.svg`'s `g3` chain). Affects `lancy_blog.svg`, `lancy_for_background.svg`, `avatar.svg` and `background.svg`; the intentional lateral gazes are preserved and `lancy.svg` was already correct. The same fixes are synced to the fabio site repo's copies of `lancy.svg`, `lancy_blog.svg` and `avatar.svg`.
