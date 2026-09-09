// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

// remarkTableDataLabels — data-label injection for GFM tables.
//
// Markdown tables carry column names only in the header row. The
// theme's mobile table treatments need each body cell to know its
// column: the default "cards" style renders `td::before { content:
// attr(data-label) }` so every stacked block is self-describing.
// This plugin copies each header cell's plain text into a
// `data-label` attribute on every cell beneath it — the standard
// responsive-table technique, zero rendered-output change beyond the
// attributes. Styling lives in blog-post.css; the treatment is
// selected via visuals.tables.mobile_style.

import { visit } from "unist-util-visit";

interface AnyNode {
  type: string;
  value?: string;
  children?: AnyNode[];
  data?: {
    hProperties?: Record<string, unknown>;
    [key: string]: unknown;
  };
}

const plainText = (node: AnyNode): string => {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? [])
    .map(plainText)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
};

export default function remarkTableDataLabels() {
  return (tree: unknown) => {
    visit(tree, "table", (table: AnyNode) => {
      const rows = table.children ?? [];
      if (rows.length < 2) return;
      const labels = (rows[0].children ?? []).map(plainText);
      rows.slice(1).forEach((row) => {
        (row.children ?? []).forEach((cell, i) => {
          const label = labels[i];
          if (!label) return;
          cell.data = { ...(cell.data ?? {}) };
          cell.data.hProperties = {
            ...(cell.data.hProperties ?? {}),
            "data-label": label,
          };
        });
      });
    });
  };
}
