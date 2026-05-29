// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { visit } from 'unist-util-visit';

export default function remarkMagicMath() {
  return (tree: any) => {
    visit(tree, (node: any) => {
      // Task A: Inline directives
      if (node.type === 'textDirective' || node.type === 'leafDirective') {
        if (node.name === 'math' || node.name === 'chem') {
          const content = node.children[0]?.value || '';
          const mathContent = node.name === 'chem' ? `\\ce{${content}}` : content;
          
          // Convert to a hast node (HTML span) so rehype can process it
          node.data = node.data || {};
          node.data.hName = 'span';
          node.data.hProperties = { className: ['math', 'math-inline'] };
          node.children = [{ type: 'text', value: mathContent }];
        }
      }

      // Task B: Block code nodes
      if (node.type === 'code') {
        if (node.lang === 'math' || node.lang === 'chem') {
          if (node.lang === 'chem') {
            node.value = `\\ce{\n${node.value}\n}`;
          }
          // Temporarily hide from first rehype pass
          node.lang = 'math-hidden';
        }
      }
    });
  };
}
