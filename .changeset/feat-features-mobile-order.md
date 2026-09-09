---
"astro-freelance-persona_theme": patch
---

feat: mobileOrder — phone-grid card ordering. Feature cards accept an optional `mobileOrder` (1..n) that re-pairs the 2-col phone grid without touching desktop or DOM order, and the phone grid now re-pairs automatically by reading the desktop 3-col matrix in 2-column bands (first two columns of every row, then the last column). Applied via static per-card CSS rules — not inline custom properties (CSP-safe).
