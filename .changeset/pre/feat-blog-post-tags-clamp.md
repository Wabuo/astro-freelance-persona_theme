---
"astro-freelance-persona_theme": patch
---

feat: clamped post tags with native expand/collapse. Blog-post tag lists clamp to one row on mobile and two rows on desktop with a native checkbox reveal ("Show all tags" / "Show fewer tags" — theme-consistent with the radio theme switcher, works without JS, resizes for free). A bottom mask reveals the next row's badge tops while collapsed. The label renders server-side only when the tag count can overflow (desktop fits 11 tags in two rows, mobile ~3 in one — ≤3 = no toggle, 4–11 = mobile-only, ≥12 = always).
