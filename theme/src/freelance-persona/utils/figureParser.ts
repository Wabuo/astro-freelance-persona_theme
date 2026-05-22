// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { z } from 'astro/zod';
import { getLicenseLink } from './licenseUtils';

const relativeCSSUnitRegex = /^\d+(?:\.\d+)?(?:rem|em|%)$/;

export const figureQuerySchema = z.object({
  inline: z.boolean().optional(),
  width: z.string().optional().refine(
    (val) => !val || relativeCSSUnitRegex.test(val),
    { message: "Width must be a relative CSS unit (rem, em, or %)" }
  ),
  float: z.enum(['left', 'right']).optional(),
  align: z.enum(['left', 'center', 'right']).optional(),
  desc: z.string().optional(),
  credit: z.string().optional(),
  creditUrl: z.string().url().optional(),
  license: z.string().optional(),
  copyright: z.string().optional(),
  altText: z.string().optional(),
});

export type FigureParams = z.infer<typeof figureQuerySchema>;

/**
 * Generates the inline style string for the figure block based on parameters.
 */
export function generateFigureStyle(params: FigureParams): string {
  let style = 'max-width: 100%; box-sizing: border-box;';
  if (params.width) {
    style += ` width: ${params.width};`;
  }

  if (params.float === 'left') {
    style += ' display: inline-block; float: left; margin: 0.25rem 1.5rem 1rem 0;';
  } else if (params.float === 'right') {
    style += ' display: inline-block; float: right; margin: 0.25rem 0 1rem 1.5rem;';
  } else {
    style += ' display: block;';
    if (params.align === 'left') {
      style += ' margin: 1.5rem 0;';
    } else if (params.align === 'right') {
      style += ' margin: 1.5rem 0 1.5rem auto;';
    } else {
      style += ' margin: 1.5rem auto;';
    }
  }
  return style;
}

/**
 * Builds the HAST children nodes for the figcaption.
 */
export function buildCaptionChildren(data: FigureParams) {
  const children: any[] = [];

  if (data.altText) {
    children.push({
      type: 'element',
      tagName: 'strong',
      properties: { class: 'figure-title' },
      children: [{ type: 'text', value: data.altText }]
    });
    if (data.desc) {
      children.push({ type: 'text', value: '. ' });
    }
  }

  if (data.desc) {
    children.push({
      type: 'element',
      tagName: 'span',
      properties: { class: 'figure-desc' },
      children: [{ type: 'text', value: data.desc }]
    });
  }

  const hasAttribution = data.credit || data.license || data.copyright;
  if (hasAttribution) {
    children.push({ type: 'text', value: ' ' });

    const attrChildren: any[] = [];
    attrChildren.push({ type: 'text', value: '(' });

    const parts: any[] = [];

    if (data.credit) {
      const creditParts: any[] = [{ type: 'text', value: 'Credit: ' }];
      if (data.creditUrl) {
        creditParts.push({
          type: 'element',
          tagName: 'a',
          properties: {
            href: data.creditUrl,
            target: '_blank',
            rel: 'noopener noreferrer'
          },
          children: [{ type: 'text', value: data.credit }]
        });
      } else {
        creditParts.push({ type: 'text', value: data.credit });
      }
      parts.push(creditParts);
    }

    if (data.copyright) {
      parts.push([{ type: 'text', value: `© ${data.copyright}` }]);
    }

    if (data.license) {
      const licenseInfo = getLicenseLink(data.license);
      if (licenseInfo) {
        const licenseParts: any[] = [{ type: 'text', value: 'License: ' }];
        if (licenseInfo.url) {
          licenseParts.push({
            type: 'element',
            tagName: 'a',
            properties: {
              href: licenseInfo.url,
              target: '_blank',
              rel: 'noopener noreferrer'
            },
            children: [{ type: 'text', value: licenseInfo.license }]
          });
        } else {
          licenseParts.push({ type: 'text', value: licenseInfo.license });
        }
        parts.push(licenseParts);
      }
    }

    for (let i = 0; i < parts.length; i++) {
      if (i > 0) {
        attrChildren.push({ type: 'text', value: ', ' });
      }
      attrChildren.push(...parts[i]);
    }

    attrChildren.push({ type: 'text', value: ')' });

    children.push({
      type: 'element',
      tagName: 'span',
      properties: { class: 'figure-attribution' },
      children: attrChildren
    });
  }

  return children;
}

/**
 * Builds the HAST overlay node for the theme-wide image attribution overlay.
 */
export function buildAttributionOverlay(data: FigureParams) {
  const hasAttribution = data.credit || data.license || data.copyright;
  if (!hasAttribution) return null;

  const children: any[] = [];

  if (data.credit) {
    const cameraIcon = {
      type: 'element',
      tagName: 'svg',
      properties: {
        viewBox: '0 0 16 16',
        width: '1em',
        height: '1em',
        fill: 'currentColor',
        style: 'display: inline-block; vertical-align: -0.125em; margin-right: 0.25rem;'
      },
      children: [
        {
          type: 'element',
          tagName: 'path',
          properties: { d: 'M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z' },
          children: []
        },
        {
          type: 'element',
          tagName: 'path',
          properties: { d: 'M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z' },
          children: []
        }
      ]
    };

    const creditChildren: any[] = [cameraIcon, { type: 'text', value: ': ' }];

    if (data.creditUrl) {
      creditChildren.push({
        type: 'element',
        tagName: 'a',
        properties: {
          href: data.creditUrl,
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        children: [{ type: 'text', value: data.credit }]
      });
    } else {
      creditChildren.push({ type: 'text', value: data.credit });
    }

    children.push({
      type: 'element',
      tagName: 'span',
      properties: { class: 'credit-line' },
      children: creditChildren
    });
  }

  const licenseInfo = getLicenseLink(data.license);
  const line2Children: any[] = [];

  if (data.copyright && licenseInfo) {
    line2Children.push({ type: 'text', value: `${data.copyright}, ` });
    if (licenseInfo.url) {
      line2Children.push({
        type: 'element',
        tagName: 'a',
        properties: {
          href: licenseInfo.url,
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        children: [{ type: 'text', value: licenseInfo.license }]
      });
    } else {
      line2Children.push({ type: 'text', value: licenseInfo.license });
    }
  } else if (data.copyright) {
    line2Children.push({ type: 'text', value: data.copyright });
  } else if (licenseInfo) {
    if (licenseInfo.url) {
      line2Children.push({
        type: 'element',
        tagName: 'a',
        properties: {
          href: licenseInfo.url,
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        children: [{ type: 'text', value: licenseInfo.license }]
      });
    } else {
      line2Children.push({ type: 'text', value: licenseInfo.license });
    }
  }

  if (line2Children.length > 0) {
    children.push({
      type: 'element',
      tagName: 'span',
      properties: { class: 'license-line' },
      children: line2Children
    });
  }

  return {
    type: 'element',
    tagName: 'div',
    properties: { class: 'img-attribution img-attribution--light' },
    children
  };
}
