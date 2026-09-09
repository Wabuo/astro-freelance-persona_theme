---
"astro-freelance-persona_theme": patch
---

fix: post-card tag rail. Tag rails on post cards (home news, category cards, inner list rows) clamp to a single scrollable row — scrollbars hidden, the mid-badge cutoff at the date's edge acting as the affordance — and the date can no longer deform. The news UI restructures into two stacks (text over tag rail, thumb over date) so the rail's cutoff sits exactly at the thumb's left edge. News-UI typography is now dial-driven (`--fp-news-*-size` mobile / `--fp-news-desktop-*-size` desktop), and the desktop rows thumbs are uniform 13.5rem (mock rows floored).
