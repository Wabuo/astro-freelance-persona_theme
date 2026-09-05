<!--
SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors

SPDX-License-Identifier: MIT
-->

# Decision: Proportional desktop scaling — true-linear root dial

**Date:** 2026-09-06 (revised same day: capped → true-linear) · **Status:** adopted

**One-liner:** Desktop viewport-proportionality is achieved with a single
true-linear root dial
(`html { font-size: clamp(0.625rem, min(0.8333vw, 1.4814vh), 2rem) }` @≥1024px,
master = 16px @1920×1080) — any 16:9 viewport is the master design
photographically reduced/enlarged: identical positions, identical line breaks.
NOT a per-token Utopia fluid scale — revisit only if the theme grows a formal
design-token API for plugin developers.

**Context:** the 1280×720 / 1366×768 "zoomed-in" seam came from an
absolute-sized design (fixed rem chrome + px container caps) tuned at
~1920×1080. First implementation capped the dial at 12.8px (textbook
"readable floor") — but the floor breaks the user's core requirement:
below ~1536px the rem chain stops scaling with the viewport, so
line-breaks/wrap points tuned at 1080p shift (About float wrapped
differently at every sub-1536 width). Revised to true-linear after a
live A/B in the browser: identical wrapping restored at 1280×720, body
text 10.67px — judged acceptable on inspection.

**Geometry:** `0.8333vw` = 16px at 1920; `1.4814vh` = 16px at 1080
height — the `min()` keeps proportions aspect-ratio-agnostic and
protects ultrawides. Growth beyond master (1440p = 133%) is the
"16:9 looks the same everywhere" requirement; 2rem cap = 8K sanity
bound. Floor 0.625rem only cushions 1024–1200px (linear would dip to
8.5px). Bounds are rem so user font-size preferences still propagate
(a11y). Below 1024px the mobile/tablet breakpoint system owns a fixed
16px root. The 1024 seam (16px → ~10px) is the accepted @min handover.

**Consequences for CSS authors:** never mix vw/vh with rem in one
formula in the floor/cap zones (they diverge there; everywhere else
rem ≡ 0.8333vw). px is for hairlines only. Container caps are rem.
