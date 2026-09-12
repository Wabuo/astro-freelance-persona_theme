---
"astro-freelance-persona_theme": patch
---

fix(ci): the publish workflow now fails fast with an actionable message when `theme/package.json`'s version already exists on npm, instead of surfacing npm's opaque `409 Conflict`. Guards against cutting a GitHub release before the changesets "Version Packages" PR has bumped the version (publish only publishes; it never bumps).
