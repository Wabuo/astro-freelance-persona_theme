import { test, expect } from '@playwright/test';

test.describe('Flat Blog Routing', () => {

    test('Access nested post at root URL', async ({ page }) => {
        // Test case: archive/2024/astro-tips.md
        // Expectation: Served at /posts/astro-tips (Flattened)

        const flatUrl = '/posts/astro-tips';
        await page.goto(flatUrl);

        // Verify we hit the right page
        const title = page.locator('h1.post-title');
        await expect(title).toBeVisible();
        await expect(title).toHaveText(/Astro Tips/i);

        // Optional: Check Canonical to ensure it matches
        const canonical = page.locator('link[rel="canonical"]');
        await expect(canonical).toHaveAttribute('href', new RegExp(flatUrl));
    });

    test('Nested URL should NOT exist', async ({ page }) => {
        const nestedUrl = '/posts/archive/2024/astro-tips';
        const response = await page.goto(nestedUrl);

        // Should be 404
        expect(response?.status()).toBe(404);
    });

});
