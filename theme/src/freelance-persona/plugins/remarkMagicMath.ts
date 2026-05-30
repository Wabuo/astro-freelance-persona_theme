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
          
          // Convert to a hast node (HTML span) so rehype-mathjax can process it
          node.data = node.data || {};
          node.data.hName = 'span';
          node.data.hProperties = { className: ['math', 'math-inline'] };
          node.children = [{ type: 'text', value: mathContent }];
        }
      }

      // Task B: Block code nodes
      if (node.type === 'code') {
        if (node.lang === 'math' || node.lang === 'chem') {
          const content = node.value;
          const mathContent = node.lang === 'chem' ? `\\ce{${content}}` : content;
          
          // Convert to a hast node (HTML div) so rehype-mathjax can process it
          node.type = 'paragraph';
          node.data = node.data || {};
          node.data.hName = 'div';
          node.data.hProperties = { className: ['math', 'math-display'] };
          node.children = [{ type: 'text', value: mathContent }];
          delete node.value;
          delete node.lang;
        }
      }
    });
  };
}
