import { test, expect } from '@playwright/test';

test.describe('Blog Visuals & Functionality', () => {

    // Blog List View replaced by Category Views below


    test.describe('Category Views', () => {
        test('List View Layout (Default)', async ({ page }) => {
            // "Design System" category is List by default
            await page.goto('/blogs/design-system');

            // Check for list elements
            const listItems = page.locator('.posts-list .post-entry');
            await expect(listItems.first()).toBeVisible();
            await expect(page.locator('.filtered-posts')).toBeHidden();

            await expect(page).toHaveScreenshot('blog-category-list-desktop.png', { fullPage: true });
        });

        test('Grid View Layout (configured)', async ({ page }) => {
            // "Development" category is configured as Grid (style: "cards") in BlogCategories.md
            await page.goto('/blogs/development');

            // Check for grid elements
            // Card.astro uses .card-wrapper as the outer container
            const gridItems = page.locator('.filtered-posts .card-wrapper');
            await expect(gridItems.first()).toBeVisible();
            await expect(page.locator('.posts-list')).toBeHidden();

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

    test('Post View: With Image', async ({ page }) => {
        // 'lancy-intro' has a thumbnail
        await page.goto('/posts/lancy-intro');

        // Verify Image is present (Correct selector from BlogPostTemplate)
        const heroImage = page.locator('.post-img img');
        await expect(heroImage).toBeVisible();

        await expect(page).toHaveScreenshot('post-with-image-desktop.png', {
            fullPage: true,
        });
    });

    test('Post View: Text Only', async ({ page }) => {
        // 'hello-world' (or 'first-post') has no image
        await page.goto('/posts/first-post');

        // Verify Image is NOT present
        const heroImage = page.locator('.post-img img');
        await expect(heroImage).toBeHidden();

        await expect(page).toHaveScreenshot('post-text-only-desktop.png', {
            fullPage: true,
        });
    });

});
