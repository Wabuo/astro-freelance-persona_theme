---
"astro-freelance-persona_theme": patch
---

fix(ci): the changeset-presence gate no longer fails on the changesets release PR (which consumes all pending changesets by design — a guaranteed false positive), and counts files with `wc -l` instead of `grep -c` so a genuine zero prints the friendly error rather than aborting with a bare exit code under `bash -e`.
