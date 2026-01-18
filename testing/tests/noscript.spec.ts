import { test, expect } from '@playwright/test';

test.describe('NoScript / JS Disabled Fallback', () => {

    // Force disable JavaScript for this block
    test.use({ javaScriptEnabled: false });

    test('Homepage loads correctly without JS', async ({ page }) => {
        await page.goto('/');

        // 1. Preloader shoud be HIDDEN
        // The <noscript> tag sets #preloader { display: none !important }
        const preloader = page.locator('#preloader');
        await expect(preloader).toBeHidden();

        // 2. Content should be VISIBLE
        // The <noscript> tag sets [data-reveal] { opacity: 1 !important }
        // We pick the first revealed element (usually Hero title or Main)
        const firstReveal = page.locator('[data-reveal]').first();
        await expect(firstReveal).toBeVisible();
        await expect(firstReveal).toHaveCSS('opacity', '1');

        // 3. Visual Snapshot (Baseline for NoScript)
        // This ensures layout isn't broken when JS is off
        await expect(page).toHaveScreenshot('noscript-homepage.png', {
            fullPage: true,
            animations: 'disabled' // Irrelevant as JS is off, but good practice
        });
    });

    test('Blog Post loads correctly without JS', async ({ page }) => {
        await page.goto('/posts/lore-ipsum-1');

        // Check content visibility
        const postContent = page.locator('.blog-post');
        await expect(postContent).toBeVisible();

        // Ensure images are visible (no lazy loading JS blocking them if applicable)
        const heroImg = page.locator('.post-img img');
        await expect(heroImg).toBeVisible();
    });

});
