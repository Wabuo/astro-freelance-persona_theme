// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import fs from 'fs';
import { figureQuerySchema, generateFigureStyle, buildCaptionChildren, buildAttributionOverlay } from '../utils/figureParser';

/**
 * Custom Rehype plugin to wrap any image with query parameters in a figure card,
 * and inline SVGs when ?inline is present. Matches properties extracted by remarkExtractImageParams.
 */
export default function rehypeFigures() {
  return (tree: any, file: any) => {
    function walk(node: any) {
      if (
        node.type === 'element' &&
        node.tagName === 'img' &&
        typeof node.properties?.srcQuery === 'string'
      ) {
        const queryStr = node.properties.srcQuery;
        const localPath = node.properties.localPath || '';
        const resolvedSrc = node.properties.src || '';
        const altText = node.properties.alt || '';

        const params = new URLSearchParams(queryStr);

        const queryData = {
          inline: params.has('inline') ? true : undefined,
          width: params.get('width') || undefined,
          float: params.get('float') || undefined,
          align: params.get('align') || undefined,
          desc: params.get('desc') || params.get('description') || undefined,
          credit: params.get('credit') || undefined,
          creditUrl: params.get('creditUrl') || params.get('credit_url') || undefined,
          license: params.get('license') || undefined,
          copyright: params.get('copyright') || undefined,
          altText: altText || undefined,
        };

        const parseResult = figureQuerySchema.safeParse(queryData);
        if (!parseResult.success) {
          const formattedErrors = parseResult.error.format();
          const fileInfo = file?.path ? ` in ${file.path}` : '';
          throw new Error(
            `[rehypeFigures] Invalid figure query parameters for image "${resolvedSrc}"${fileInfo}:\n` +
            JSON.stringify(formattedErrors, null, 2)
          );
        }

        const paramsObj = parseResult.data;
        let mediaNode: any = null;

        // If SVG and inline is requested, inline the XML structure
        if (paramsObj.inline && localPath.endsWith('.svg') && fs.existsSync(localPath)) {
          try {
            const svgContent = fs.readFileSync(localPath, 'utf-8');
            const match = svgContent.match(/<svg([^>]*)>([\s\S]*)<\/svg>/i);
            if (match) {
              const attrsStr = match[1];
              const innerContent = match[2];

              const properties = { ...node.properties };
              delete properties.src;
              delete properties.alt;
              delete properties.srcQuery;
              delete properties.localPath;

              const attrRegex = /(\w+(?:-\w+)*)=["']([^"']*)["']/g;
              let attrMatch;
              while ((attrMatch = attrRegex.exec(attrsStr)) !== null) {
                properties[attrMatch[1]] = attrMatch[2];
              }

              if (!properties.viewBox && properties.width && properties.height) {
                const w = properties.width.replace(/[^\d.]/g, '');
                const h = properties.height.replace(/[^\d.]/g, '');
                if (w && h) {
                  properties.viewBox = `0 0 ${w} ${h}`;
                }
              }

              let cleanInnerContent = innerContent
                .replace(/stroke=["'](?:#000000|#000|black|#1a1a1a|#333333)["']/g, 'stroke="currentColor"')
                .replace(/fill=["'](?:#000000|#000|black|#1a1a1a|#333333)["']/g, 'fill="currentColor"')
                .replace(/stroke\s*:\s*(?:#000000|#000|black|#1a1a1a|#333333|#969696)\b/g, 'stroke:currentColor')
                .replace(/fill\s*:\s*(?:#000000|#000|black|#1a1a1a|#333333|#969696)\b/g, 'fill:currentColor')
                .replace(/stop-color\s*:\s*(?:#000000|#000|black)\b/g, 'stop-color:currentColor');

              for (const key of ['stroke', 'fill']) {
                if (properties[key] === '#000000' || properties[key] === '#000' || properties[key] === 'black') {
                  properties[key] = 'currentColor';
                }
              }

              mediaNode = {
                type: 'element',
                tagName: 'svg',
                properties: {
                  ...properties,
                  style: 'width: 100%; height: auto; display: block; font-family: var(--monospace-font), monospace;'
                },
                children: [{ type: 'raw', value: cleanInnerContent }]
              };
            }
          } catch (e) {
            console.error(`[rehypeFigures] Failed to inline SVG ${localPath}:`, e);
          }
        }

        // Standard Image fallback (PNG, JPG, or SVG without inline)
        if (!mediaNode) {
          const properties = { ...node.properties };
          delete properties.srcQuery;
          delete properties.localPath;

          mediaNode = {
            type: 'element',
            tagName: 'img',
            properties: {
              ...properties,
              src: resolvedSrc, // Use resolved public URL
              style: 'width: 100%; height: auto; display: block;'
            },
            children: []
          };
        }

        const isCaptionActive = !!paramsObj.altText || !!paramsObj.desc;

        const figcaptionNode = isCaptionActive ? {
          type: 'element',
          tagName: 'figcaption',
          children: buildCaptionChildren(paramsObj)
        } : null;

        const overlayNode = !isCaptionActive ? buildAttributionOverlay(paramsObj) : null;

        const figureStyle = generateFigureStyle(paramsObj);

        node.tagName = 'figure';
        node.properties = {
          style: figureStyle,
          class: 'post-figure'
        };

        const figureChildren = [mediaNode];
        if (figcaptionNode) figureChildren.push(figcaptionNode);
        if (overlayNode) figureChildren.push(overlayNode);

        node.children = figureChildren;
      }

      if (node.children) {
        for (const child of node.children) {
          walk(child);
        }
      }
    }
    walk(tree);
  };
}
