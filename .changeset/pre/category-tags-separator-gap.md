---
"astro-freelance-persona_theme": patch
---

The tag badges inside blog category cards now sit halfway to the latest-posts separator: the tags→separator gap is halved (`.latest-posts` margin-top `3.9→1.95cqi`, i.e. 0.5rem at master) and that exact half is re-added as space above the tags (`.category-description` margin-bottom `1.95→3.9cqi`, 1rem at master). Verified at the master card that only the tags move — description top, separator, list rows and the bottom margin of the 403/562 shape are all pixel-identical, so the two changes read as one vertical nudge with no knock-ons.
