# Mobile Feature Grid Order

On phones the feature grid is 2 columns while the desktop layout is
3 columns — the same DOM order produces different side-by-side pairings.
The theme re-pairs the phone grid automatically, and content can
override it per card.

## Automatic: matrix band reading (default, zero config)

The phone grid reads the desktop 3-col matrix in **2-column bands,
row-major**: first columns 1–2 of every row (the desktop's left block),
then the remaining column.

Given authored order `1..6` (desktop rows `[1, 2, 3] [4, 5, 6]`), the
phone sequence becomes:

```
1, 2, 4, 5, 3, 6   →  pairs: [1, 2] [4, 5] [3, 6]
```

Example: authored `Permaculture, Digital Maps, AIOps, SysAdmin, Testing, LQA`
renders on phones as `Permaculture | Digital Maps`, `SysAdmin | Testing`,
`AIOps | LQA` — the desktop's left columns stay paired, and the
third column pairs up behind them.

The rule is a **no-op whenever the desktop grid already has ≤ 2
columns** (768–1023px uses a 2-col desktop grid), so only true phone
widths (<768px) reorder.

## Override: `mobileOrder` (optional)

Set an absolute phone position on any feature in the section's
frontmatter:

```yaml
features:
  - title: "Permaculture"
    mobileOrder: 1
  - title: "Digital Maps"
    mobileOrder: 2
  - title: "AIOps"        # unset → falls back to the band position
  - title: "SysAdmin"
    mobileOrder: 3
```

- An explicit `mobileOrder` **pins** that card to that absolute phone
  position; unset cards fall back to their automatic band position.
- Desktop, DOM order, and keyboard/tab order are unchanged — this is a
  visual-only reorder inside the `<768px` CSS.
- Because the phone sequence diverges from the DOM, screen readers and
  keyboard focus follow the authored order, not the phone pairing.
  Acceptable trade-off for grid re-pairing; flag it if you need strict
  linear focus order.

## Implementation notes

- `FeatureSection.astro` computes the mapping at build time and emits
  one static CSS rule per card
  (`.features-grid > .feature-group-wrapper:nth-child(n) { order: k }`)
  inside a `@media (max-width: 767px)` block.
- The rules are **not** inline styles: CSP (default on) blocks
  server-rendered style attributes whenever any hash is present in
  `style-src` — see AGENT.md's CSP gotcha.
- The reveal-on-scroll stagger still follows the authored order.
