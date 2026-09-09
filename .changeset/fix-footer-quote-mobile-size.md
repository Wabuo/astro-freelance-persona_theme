---
"astro-freelance-persona_theme": patch
---

fix: footer quote size on phones. `.footer .quote` was missing from the footer's mobile typography block and stayed at a fixed 16px; it now uses the standard mobile clamp.
