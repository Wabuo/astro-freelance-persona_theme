// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { visit } from 'unist-util-visit';

export default function rehypeRevealMath() {
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      // Find <code> blocks with language-math-hidden
      if (node.tagName === 'code' && node.properties?.className) {
        const classes = Array.isArray(node.properties.className)
          ? node.properties.className
          : [node.properties.className];

        if (classes.includes('language-math-hidden')) {
          // Strip -hidden so they become language-math
          node.properties.className = classes.map((c: string) =>
            c === 'language-math-hidden' ? 'language-math' : c
          );
        }
      }
    });
  };
}
