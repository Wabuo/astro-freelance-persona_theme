---
"astro-freelance-persona_theme": patch
---

fix: 50% smaller copy button. The Expressive Code copy button shrinks visually via `transform: scale(0.5)` (anchored top-right) — EC keeps rendering at its native box so the icon and copied-state feedback stay intact and the 40px layout box doubles as the click target. Resizing the box externally breaks both.
