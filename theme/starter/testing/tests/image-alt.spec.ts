// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

/**
 * Image Alt Text (`img_alt`) — required whenever an image is present.
 *
 * The build already fails on a missing/empty `img_alt` (zod, in
 * content.config.ts). These tests pin the RENDER side: the description
 * lands on the img alt, and `img_alt: "hidden"` renders alt="" +
 * aria-hidden so decorative graphics stay silent.
 */

import { test, expect } from '@playwright/test';
import { getHeroContent, getAboutContent, getBlogPostContent } from '../utils/content-parser';

const hero = getHeroContent() as any;
const about = getAboutContent() as any;
const post = getBlogPostContent('lancy-intro') as any;

const isDecorative = (value: unknown) => value === 'hidden';

test.describe('Image alt text (img_alt)', () => {

    test('Hero background image renders its frontmatter img_alt', async ({ page }) => {
        test.skip(!hero.background_image, 'No hero background_image');
        await page.goto('/');
        const img = page.locator('.hero .hero-bg');
        await expect(img).toHaveAttribute('alt', String(hero.img_alt));
    });

    test('About avatar renders its frontmatter img_alt', async ({ page }) => {
        test.skip(!about.avatar, 'No about avatar');
        await page.goto('/');
        await page.locator('#about').scrollIntoViewIfNeeded();
        const img = page.locator('#about .avatar-image').first();
        if (isDecorative(about.img_alt)) {
            await expect(img).toHaveAttribute('alt', '');
            await expect(img).toHaveAttribute('aria-hidden', 'true');
        } else {
            await expect(img).toHaveAttribute('alt', String(about.img_alt));
        }
    });

    test('Post thumbnail renders its frontmatter img_alt', async ({ page }) => {
        test.skip(!post.thumbnail, 'Post fixture has no thumbnail');
        await page.goto('/posts/lancy-intro/');
        const img = page.locator('.blog-post .post-thumbnail, .blog-post article img').first();
        if (isDecorative(post.img_alt)) {
            await expect(img).toHaveAttribute('alt', '');
            await expect(img).toHaveAttribute('aria-hidden', 'true');
        } else {
            await expect(img).toHaveAttribute('alt', String(post.img_alt));
        }
    });

    test('Decorative figure (img_alt="hidden") is aria-hidden', async ({ page }) => {
        await page.goto('/posts/lancy-intro/');
        const decorative = page.locator('.post-figure .figure-img[aria-hidden="true"]');
        // The starter fixture carries layout-demo figures marked hidden.
        await expect(decorative.first()).toHaveAttribute('alt', '');
    });

    test('No image ships without an alt attribute', async ({ page }) => {
        await page.goto('/');
        const missing = await page.evaluate(() =>
            Array.from(document.querySelectorAll('img'))
                .filter(img => !img.hasAttribute('alt'))
                .map(img => img.getAttribute('src') || img.className)
        );
        expect(missing).toEqual([]);
    });

});