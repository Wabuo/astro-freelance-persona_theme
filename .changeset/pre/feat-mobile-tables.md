---
"astro-freelance-persona_theme": patch
---

feat: mobile table treatments. Markdown tables on phones render via `visuals.tables.mobile_style`: **cards** (default — each row becomes a self-describing card, first column emphasized as the card header; per-column accents color the labels and add soft left bars so grouped columns are pattern-scannable, overridable via `--table-col-N-color`), **scroll** (compact spreadsheet-grade grid for structured data: 13px cells, thin column separators, pinned first column with zebra-matched background, right-edge swipe fade), or **native** (plain overflow). remarkTableDataLabels copies column headers onto cells as data-label attributes. Desktop untouched. Demo table in the starter's Hello World post; docs in docs/features/mobile-tables.md.
