---
"astro-freelance-persona_theme": patch
---

fix(routing): duplicate post slugs are now a hard build failure. Since the filename is the URL slug and folders are organization-only, two posts with the same basename flatten to the same page — `BlogPost.astro`'s `getStaticPaths` detects this and throws with both source paths listed, instead of Astro's silent warn-and-drop (which left one post unreachable). Docs updated in `docs/url-slugs.md`.
