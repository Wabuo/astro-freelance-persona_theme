---
"astro-freelance-persona_theme": patch
---

fix(testing): config matrix honors TEST_PORT for its preview server. The runner spawned `astro preview` without `--port`, so the preview always bound 4321 while the readiness poll waited on TEST_PORT — every config reported "did not start in time" whenever the matrix ran on a non-default port.
