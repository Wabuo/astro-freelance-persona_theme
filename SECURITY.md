<!--
SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors

SPDX-License-Identifier: MIT
-->

# Security Model

> What this theme trusts, what it guards, what is your job. Written for people
> who already know web security basics — this maps the specifics, it does not
> teach the topic.

## The short version

This is a **static site generator theme**. There is no server of ours, no
database, no sessions, no cookies. Content and config live in your repo and
are compiled at build time. The runtime attack surface is what a visitor's
browser executes — and the theme ships a default-on **Content-Security-Policy**
that reduces that surface to: same-origin resources, your form provider, and
accounted-for inline scripts.

## Trust model

| Input | Trust level | Rationale |
|---|---|---|
| Repo content (markdown/MDX, config) | **Trusted — you are the author** | Raw HTML in markdown is allowed *by design* (that is how embeds work). If you paste hostile HTML into a post, it renders on your site — CSP still blocks inline `<script>` execution, but this is a trust boundary you control, not one we enforce. |
| Theme code | Reviewed in-repo | Zero inline event handlers, zero `eval`, zero external origins, no mixed content — audited as part of the security phase. |
| npm dependencies | Updated via Renovate | Audit failures surface in CI. |
| Contact form providers | Third-party | See [Contact form](#contact-form) below. |

## What ships enabled (default)

### Content-Security-Policy (meta, default ON)

Astro 7's native CSP support computes SHA-256 hashes for every script it
processes; the theme registers its own four pre-paint inline scripts
(preloader safety-timeout, preloader remover, theme sync, scroll-animation
engine) the same way. The emitted policy:

```
default-src 'self'
script-src 'self' 'sha256-…' …        (one hash per accounted inline script)
style-src 'self' 'unsafe-inline'
img-src 'self' data:
font-src 'self'
connect-src 'self'
object-src 'none'
base-uri 'self'
form-action 'self' https:
frame-src https:
upgrade-insecure-requests
```

Design notes:

- `style-src 'unsafe-inline'` is the standard pragmatic trade — inline style
  attributes are pervasive and style injection is low-severity next to script
  injection. Everything else stays strict.
- `form-action 'self' https:` is also the anti-exfiltration control: content
  that smuggles a form onto your page cannot submit to arbitrary endpoints.
- `frame-src https:` keeps pasted https embeds (video etc.) working.
- `frame-ancestors` and `report-*` are header-only directives — see
  [Your host's part](#your-hosts-part).

**Escape hatches** (theme config):

```ts
security: {
  csp: false,                  // disable entirely (not recommended)
  cspExtra: [                  // extend — e.g. you add an external script
    "script-src https://cdn.example.com",
  ],
}
```

`cspExtra` appends directive strings; Astro merges same-name directives.

**Adding your own inline scripts:** a raw `<script>` in your content/config
will be **blocked** (no hash). Either move it into a component with a
processed script (auto-hashed), add its hash via `cspExtra`
(`script-src 'sha256-…'`), or disable the CSP. If you know web security, this
is the standard hash-based CSP trade-off — nothing theme-specific here.

### Referrer policy

`<meta name="referrer" content="strict-origin-when-cross-origin">` on every
page. All `target="_blank"` links in theme templates ship
`rel="noopener noreferrer"`. **If you add external links in content**, add
`{target=_blank}` plus the rel yourself — the theme cannot rewrite user
markdown.

### Why there are no CSRF tokens

CSRF abuses ambient authority — cookies/sessions a browser attaches to
state-changing endpoints. This theme sets no cookies, has no sessions, no
login, and no state-changing endpoints of its own. There is no authority to
abuse.

The contact form's cross-site abuse vector is **spam, not CSRF** (the
attacker acts on their own behalf, not the visitor's) — handled provider-side
(see below). Our `form-action` CSP additionally blocks injected-form
exfiltration to non-provider endpoints.

**If you convert the theme to SSR** (Astro supports it), cookies become
possible and CSRF becomes real — enable Astro's `security.checkOrigin: true`
in your config, which verifies the `Origin` header on POSTs.

### Build-time rendering notes

- MathJax renders **at build time** (rehype) — there is no client-side TeX
  evaluation. Baked output (including `\href` targets) is author-trusted like
  all repo content.
- The scroll-animation engine ships as a pre-paint inline script on purpose
  (deferred module = reveal flash / CLS regression). Its hash is computed at
  render, so config changes stay covered.

## Your host's part

The grading tools score **response headers**, which no static build can emit
— they belong to your hoster/sysadmin. The site imposes nothing that
conflicts with a strict setup (no inline handlers, no external origins, no
mixed content, no SRI needs — there are no third-party resources; if you add
some, add `integrity` attributes). Recommended header set for an
Observatory/Lighthouse AAA-grade:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY                      (or CSP frame-ancestors 'none')
Permissions-Policy: camera=(), microphone=(), geolocation=()
Cross-Origin-Opener-Policy: same-origin
```

Translate these into your stack (`_headers` for Netlify/Cloudflare Pages,
`vercel.json`, nginx `add_header`, Caddy `header`).

## Contact form

The form POSTs to one of the configured providers (formspark, web3forms,
ntfy, netlify, mailto, custom endpoint). Three things to understand:

1. **The `access_key` is public.** It ships in the form HTML — that is how
   static-site form services work. "Not public" requires an intermediary:
   deploy a ~30-line Cloudflare Worker / Netlify Function that holds the key
   in env vars and forwards submissions (point the theme's `custom` provider
   at it). Otherwise, lock the key down provider-side:
2. **Origin/domain restrictions**: formspark supports allowed-origin lists;
   enable them. Browsers enforce `Origin` integrity, so cross-*site* form
   spam is blocked server-side. (Direct scripted submissions can fake
   headers — that is a spam problem, not a CSRF problem.)
3. **Spam**: a honeypot field ships built in. For real protection enable
   your provider's captcha (Cloudflare Turnstile / hCaptcha) and rate
   limiting in the provider dashboard. Wiring a captcha widget yourself is
   provider-specific (script + widget div) and needs one `cspExtra` entry
   (`script-src https://challenges.cloudflare.com`) since the CSP blocks
   unknown external scripts by design.

`mailto:` mode has none of these properties (it is a plain `mailto:` link
disguised as a form) — fine for a portfolio, not for anything you rely on.

## Reporting

Pre-alpha project, rolling release — no LTS, no security-backport channel.
If you find a vulnerability, open a GitHub issue (or a fix — the bar for
breaking changes is: none).
