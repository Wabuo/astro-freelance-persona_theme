// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';

test.describe('Blog Visuals & Functionality', () => {

    // Blog List View replaced by Category Views below


    test.describe('Category Views', () => {
        test('List View Layout (Default)', async ({ page }) => {
            // "Design System" category is List by default
            await page.goto('/blogs/design-system');

            // List view = news-rows UI (FilteredPostsSection layout="rows",
            // same component as cards mode — .rows class is the discriminator).
            // The legacy static .posts-list markup no longer exists.
            const listItems = page.locator('.filtered-posts.rows .card-wrapper');
            await expect(listItems.first()).toBeVisible();
            await expect(page.locator('.filtered-posts:not(.rows)')).toHaveCount(0);

            await expect(page).toHaveScreenshot('blog-category-list-desktop.png', { fullPage: true });
        });

        test('Grid View Layout (configured)', async ({ page }) => {
            // "Development" category is configured as Grid (style: "cards") in BlogCategories.md
            await page.goto('/blogs/development');

            // Check for grid elements
            // Card.astro uses .card-wrapper as the outer container
            const gridItems = page.locator('.filtered-posts:not(.rows) .card-wrapper');
            await expect(gridItems.first()).toBeVisible();
            // cards mode renders FilteredPostsSection WITHOUT the .rows modifier
            await expect(page.locator('.filtered-posts.rows')).toHaveCount(0);

            await expect(page).toHaveScreenshot('blog-category-grid-desktop.png', { fullPage: true });
        });
    });

    /* 
    test('Category Filter Functionality', async ({ page }) => {
        await page.goto('/');

        // Click on a category card link (e.g. Astro)
        // We look for a link pointing to /blogs/ something
        const categoryLink = page.locator('.category-card a[href^="/blogs/"]').first();
        const categoryHref = await categoryLink.getAttribute('href');

        await categoryLink.click();

        // Verify URL changes
        await expect(page).toHaveURL(new RegExp(categoryHref!));

        // Visual Snapshot of Category Page
        await expect(page).toHaveScreenshot(`blog-category-page-desktop.png`, {
            fullPage: true
        });
    });
    */

    test('Post View: With Image', async ({ page }, testInfo) => {
        // 'lancy-intro' has a thumbnail
        await page.goto('/posts/lancy-intro');
        await page.waitForLoadState('load');
        if (testInfo.project.name !== 'noscript') {
            await page.evaluate(() => document.fonts.ready);
        }

        // Verify Image is present (Correct selector from BlogPostTemplate)
        const heroImage = page.locator('.post-img img');
        await expect(heroImage).toBeVisible();

        // Ensure image is actually loaded
        await heroImage.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);

        await expect(page).toHaveScreenshot('post-with-image-desktop.png', {
            fullPage: true,
            maxDiffPixelRatio: 0.05,
            animations: 'disabled',
            mask: [
                page.locator('.mascot-container'),
                page.locator('.typing-lock'),
                page.locator('.typed-cursor'),
                page.locator('.hero .typing-wrapper'),
            ]
        });
    });

    test('Post View: Text Only', async ({ page }, testInfo) => {
        // 'hello-world' (or 'first-post') has no image
        await page.goto('/posts/first-post');
        await page.waitForLoadState('load');
        if (testInfo.project.name !== 'noscript') {
            await page.evaluate(() => document.fonts.ready);
        }

        // Verify Image is NOT present
        const heroImage = page.locator('.post-img img');
        await expect(heroImage).toBeHidden();

        await expect(page).toHaveScreenshot('post-text-only-desktop.png', {
            fullPage: true,
            maxDiffPixelRatio: 0.05,
            mask: [
                page.locator('.mascot-container'),
                page.locator('.typing-lock'),
                page.locator('.typed-cursor'),
                page.locator('.hero .typing-wrapper'),
            ]
        });
    });

});
