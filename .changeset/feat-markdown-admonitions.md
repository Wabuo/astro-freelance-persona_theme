---
"astro-freelance-persona_theme": patch
---

feat: markdown admonitions + pullquote. `:::note`, `:::tip`, `:::info`, `:::important`, `:::warning`, `:::caution` render as styled callout boxes (fixed semantic hues, dark-mode safe via color-mix), with an optional custom subtitle via `:::warning[Label]` and `:::pullquote` for the pop-quote look. Built on the standard `remark-directive` parser — no new dependencies. Demo usage in the starter's "Hello World" post; docs in docs/features/admonitions.md.
