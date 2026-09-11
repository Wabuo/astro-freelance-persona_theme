---
"astro-freelance-persona_theme": patch
---

fix: reveal engine initial-fold pass. Elements visible in the real viewport at load reveal through a no-inset observer — the bottom threshold inset (rootMargin) could permanently suppress above-the-fold content whose top edge sits inside the excluded bottom zone, e.g. bottom-anchored hero text on phones, which only revealed after a tiny scroll collapsed the URL bar. Intersection timing is unchanged; elements below the fold keep the inset-gated observer exactly as before.
