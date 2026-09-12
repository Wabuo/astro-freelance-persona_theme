# Decision: Two heading regimes — display token vs prose RFS

**Date:** 2026-09-14
**Status:** Accepted (documents existing behavior)

## Context

Design reviews keep flagging that `.hero h1` uses `--title-font-size`
(4rem at master scale) while `_type.css` caps global `h1 { font-size:
2.5rem }` above 1200px. Two regimes coexist:

1. **Prose regime** (`_type.css`): markdown-content headings h1–h6 use
   the ported RFS fluid sizes — `calc(rem + vw)`, capped above 1200px.
   Governs headings inside articles, static pages, and any `<h*>` that
   is *body copy hierarchy*.
2. **Display regime** (hero): `.hero h1` (and other display faces)
   consume the theme-wide tokens (`--title-font-size`, settable via
   `fonts.sizes.title`), because the hero is a poster headline measured
   against the 1920×1080 master — not part of the text scale.

## Decision

Both regimes are intentional and stay. The split follows the standard
"display type vs text type" division: the hero headline is art-directed
(dialable), prose headings follow the ported RFS ramp so long documents
remain typographically coherent. Do **not** "fix" the hero to 2.5rem or
push prose onto the display token.

## Caveat recorded for future tuning

The RFS `vw` terms interact with the true-linear root dial
(`base.css` ≥1024px): the rem component scales with the dial while the
vw component scales with the viewport, so prose headings scale slightly
*superlinearly* (each shrinks more slowly than the page). This is a
known, accepted artifact — revisit only if a future dial change makes
prose headings visibly mismatch the photographic proportionality.
