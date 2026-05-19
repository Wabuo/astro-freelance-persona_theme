// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

// index.js
// This file allows users to import components nicely
// e.g., import { BaseLayout } from 'astro-freelance-persona_theme';

// index.js
export { default as BaseLayout } from './src/freelance-persona/layouts/BaseLayout.astro';
export { default as HomeTemplate } from './src/freelance-persona/components/templates/HomeTemplate.astro';
export { default as BlogPostTemplate } from './src/freelance-persona/components/templates/BlogPostTemplate.astro';
// For now, let's stick to exporting components:
export { default as Hero } from './src/freelance-persona/components/Hero.astro';
export { default as Footer } from './src/freelance-persona/components/Footer.astro';
export { default as Navigation } from './src/freelance-persona/components/Navigation.astro';