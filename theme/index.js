// index.js
// This file allows users to import components nicely
// e.g., import { BaseLayout } from 'astro-persona-theme';

// index.js
export { default as BaseLayout } from './src/layouts/BaseLayout.astro';
export { default as HomeTemplate } from './src/components/templates/HomeTemplate.astro';
export { default as BlogPostTemplate } from './src/components/templates/BlogPostTemplate.astro';
// For now, let's stick to exporting components:
export { default as Hero } from './src/components/Hero.astro';
export { default as Footer } from './src/components/Footer.astro';
export { default as Navigation } from './src/components/Navigation.astro';