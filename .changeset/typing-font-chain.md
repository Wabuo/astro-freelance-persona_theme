---
"astro-freelance-persona_theme": patch
---

Fix the hero typing font chain: `.hero p` now falls back to the mono role token `--font-mono` (was swallowing the nav face, which made `hero.css`'s mono default dead code and broke sites that set `fonts.monospace` without a frontmatter override). Raw in-code token default for `--font-mono` becomes deliberately conspicuous (`Comic Sans MS` stack) per the README Level-4 manifesto rule. Documentation and decision docs ride along: heading-regimes one-pager, updated Level-4 wording.
