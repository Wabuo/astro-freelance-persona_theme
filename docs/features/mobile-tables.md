# Mobile Table Treatments

Markdown tables can't shrink below their min-content width. Before
this feature the theme kept them inside the article with
`display: block; overflow-x: auto` — which on phones hides columns
with **no scroll affordance** (mid-word cut-offs, invisible overlay
scrollbars). The theme now ships three treatments, selected via the
config; the remark plugin `remarkTableDataLabels` copies every header
cell's text into `data-label` attributes on the body cells so any
treatment can be self-describing.

## Configuration

```ts
visuals: {
  tables: {
    // "cards" (default) | "scroll" | "native"
    mobile_style: "cards",
  },
}
```

## `"cards"` (default)

On phones (≤767px) each table row renders as a mini-card:

- the column headers move onto the cells as small overline labels
  (`td::before { content: attr(data-label) }`) — mono, uppercase,
  muted
- the **first column** is emphasized as the card's header row
  (heading color, bold, hairline separator below) — in schedule-style
  tables that's your "Day 0 — The Split" identity row
- the header row (`thead`) is hidden; no horizontal scrolling at all
- best for **prose tables** (4–5 columns of sentences, like a
  timeline)

### Per-column accents

Columns 2+ get a hue for their label text and a soft left bar on each
block, so grouped columns (e.g. two treatment columns in a schedule)
are pattern-scannable. Defaults cycle distinct hues:

| Column | Default | Override variable |
| --- | --- | --- |
| 1 | neutral (card header) | — |
| 2 | sky-600 | `--table-col-2-color` |
| 3 | amber-600 | `--table-col-3-color` |
| 4 | green-600 | `--table-col-4-color` |
| 5 | red-600 | `--table-col-5-color` |
| 6 | violet-600 | `--table-col-6-color` |
| 7+ | cycle repeats | `--table-col-7-color` … |

Override any column from your global CSS:

```css
:root {
  --table-col-3-color: #d97706;
}
```

## `"scroll"`

Keeps the table as a **compact data grid** for structured content —
statistics, price lists, anything that would live happily in a
spreadsheet:

- sheet-density type (~13px) and tighter cell padding
- thin column separators between cells
- the **first column is pinned** (`position: sticky; left: 0`) with a
  solid, zebra-matched background so row identifiers stay readable
  while the remaining columns scroll horizontally
- a 1.5rem right-edge fade (the tag-rail peek idiom) signals more
  content off-screen
- by design there is **no sticky top header row**: CSS forbids it
  inside an `overflow-x` scroll container (the spec forces
  `overflow-y: auto`, so the page-scroll isn't available to stick
  against). The header row scrolls away vertically.

Best for **wide data grids** (6+ columns) where the row/cell
relationship matters more than reading every cell.

## `"native"`

No extra rules — the base block + horizontal overflow from before.

## Escape-hatch notes

- The treatment applies to **all** markdown tables in blog posts and
  the plain/blog templates. Markdown has no per-table attribute
  syntax; a per-table override would need a directive wrapper
  (`:::table[scroll]`) — deliberately not built yet. Change the
  global knob per site instead.
- On desktop nothing changes at any setting.
- Works without JavaScript (pure CSS + build-time attributes).
