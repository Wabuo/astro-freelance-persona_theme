// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import path from 'path';

/**
 * Helper to walk the Remark AST tree and visit nodes matching a specific type.
 */
function visit(node: any, testType: string, visitor: (node: any) => void) {
  if (node.type === testType) {
    visitor(node);
  }
  if (node.children) {
    for (const child of node.children) {
      visit(child, testType, visitor);
    }
  }
}

/**
 * Remark plugin to extract image query parameters before Astro's asset pipeline runs,
 * enabling Astro to correctly resolve relative image paths.
 */
export default function remarkExtractImageParams() {
  return (tree: any, file: any) => {
    const markdownDir = path.dirname(file.path);
    visit(tree, 'image', (node: any) => {
      if (typeof node.url === 'string' && node.url.includes('?')) {
        const urlParts = node.url.split('?');
        const cleanUrl = urlParts[0];
        const queryStr = urlParts[1];
        const absoluteLocalPath = path.resolve(markdownDir, cleanUrl);

        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.srcQuery = queryStr;
        node.data.hProperties.localPath = absoluteLocalPath;

        node.url = cleanUrl;
      }
    });
  };
}
