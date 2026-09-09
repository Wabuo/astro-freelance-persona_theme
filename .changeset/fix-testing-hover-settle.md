---
"astro-freelance-persona_theme": patch
---

fix(testing): deterministic category-card hover screenshots. The hover test settles the scroll-reveal (900ms after scrollIntoView) before hovering and waits out the hover transition — reveal lift + hover lift racing produced load-dependent 2-3px ghost diffs.
