# astro-freelance-persona_theme

A modern, responsive, and lightweight Astro theme for freelancing, portfolios, and blogs.

## Getting Started

To create a new website using this theme's template, run:

```bash
bun create astro@latest -- --template freelance-persona/astro-freelance-persona_theme/theme/starter
```

## Security & Repository Hooks

To ensure commits remain secure and release-ready, you can install the repository's git and Jujutsu hooks:

### Git Hooks Installation
Run the following command from the repository root:
```bash
git config core.hooksPath .githooks
```

### Jujutsu (jj) Hooks Installation
Add the following alias to your global `~/.config/jj/config.toml` configuration:
```toml
[aliases]
push-safe = ["util", "exec", "--", "/home/fabio/Documents/Programming/Website/Astro/astro_freelance-persona_theme/.jj-hooks/pre-push.sh"]
```
Then use `jj push-safe` instead of `jj git push` to push bookmarks.
