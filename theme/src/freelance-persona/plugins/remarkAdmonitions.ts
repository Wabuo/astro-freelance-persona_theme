// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

// Markdown container directives → callout UI.
//
//   :::warning[Custom title]     → <aside class="admonition admonition-warning">
//   content                        <p class="admonition-title">Custom title</p>
//   :::                            …content…
//
//   :::pullquote                  → <blockquote class="pullquote">
//   A line meant to pop.
//   :::
//
// Requires remark-directive (registered in the integration's
// remarkPluginsList). Unknown container names pass through untouched.
// Styling lives in blog-post.css (.admonition / .pullquote).

import { visit } from 'unist-util-visit';

const ADMONITION_TYPES = [
  'note',
  'tip',
  'important',
  'warning',
  'caution',
  'info',
];

export default function remarkAdmonitions() {
  return (tree: any) => {
    visit(tree, 'containerDirective', (node: any) => {
      if (node.name === 'pullquote') {
        node.data = node.data || {};
        node.data.hName = 'blockquote';
        node.data.hProperties = { className: ['pullquote'] };
        return;
      }

      if (!ADMONITION_TYPES.includes(node.name)) return;

      // The bracket line on the fence (:::info[🔬 Research Opportunity])
      // parses as the FIRST child paragraph with brackets already
      // stripped — mark it as the admonition's subtitle row; the text
      // is left untouched.
      const first = node.children[0];
      if (first && first.type === 'paragraph') {
        first.data = first.data || {};
        first.data.hName = 'p';
        first.data.hProperties = { className: ['admonition-subtitle'] };
      }

      const title =
        node.name.charAt(0).toUpperCase() + node.name.slice(1);

      node.data = node.data || {};
      node.data.hName = 'aside';
      node.data.hProperties = {
        className: ['admonition', `admonition-${node.name}`],
        'data-admonition': node.name,
      };
      node.children.unshift({
        type: 'paragraph',
        data: {
          hName: 'p',
          hProperties: { className: ['admonition-title'] },
        },
        children: [{ type: 'text', value: title }],
      });
    });
  };
}
