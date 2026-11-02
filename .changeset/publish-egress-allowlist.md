---
"astro-freelance-persona_theme": patch
---

Release plumbing only — no package contents changed. The `publish` workflow's hardened egress allowlist now matches GitHub's release-asset redirect target: `actions/setup-node` downloads Node from `github.com/actions/node-versions`, whose asset redirects moved from `objects.githubusercontent.com` to `release-assets.githubusercontent.com`; the old pinned list rejected the download with `ECONNREFUSED`, including the action's own `nodejs.org` fallback. Both hosts are now explicitly allowed (in addition to the existing ones), so release runs no longer die inside `setup-node` on either host — renovate's `setup-node`/`node-version` bumps had simply been the first run to hit the moved path. After merging, retrigger publication via workflow dispatch on `main` ("re-run failed jobs" on an old run would execute the pre-fix workflow file frozen at the release commit).
