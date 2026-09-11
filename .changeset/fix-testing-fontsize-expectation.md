---
"astro-freelance-persona_theme": patch
---

fix(testing): config-fonts matrix font-size expectation is root-relative. The expectation hardcoded "40px" (2.5rem at the pre-dial fixed 16px root); with the true-linear root dial the computed size varies with the viewport, so the check now accepts rem expectations and resolves them against the live computed root size.
