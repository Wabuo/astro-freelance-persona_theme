// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

/// <reference path="../.astro/types.d.ts" />

declare module '@freelance-persona/config' {
  import type { PersonaConfig } from './freelance-persona/types/index';
  export const themeConfig: PersonaConfig;
  export default themeConfig;
}

declare module 'katex/dist/contrib/auto-render' {
  export default function renderMathInElement(element: HTMLElement, options?: any): void;
}

declare module 'astro:content' {
  export interface CollectionEntryMock {
    id: string;
    slug: string;
    body: string;
    collection: string;
    data: any;
  }

  export function getCollection(
    collection: 'sections' | 'blog_posts' | 'legal',
    filter?: (entry: CollectionEntryMock) => unknown
  ): Promise<CollectionEntryMock[]>;

  export function getEntry(
    collection: 'sections' | 'blog_posts' | 'legal',
    idOrSlug: string
  ): Promise<CollectionEntryMock>;

  export function getEntry(
    entry: { collection: 'sections' | 'blog_posts' | 'legal'; id: string }
  ): Promise<CollectionEntryMock>;

  export function getEntry(
    entry: { collection: 'sections' | 'blog_posts' | 'legal'; slug: string }
  ): Promise<CollectionEntryMock>;

  export function render(entry: any): Promise<any>;
}