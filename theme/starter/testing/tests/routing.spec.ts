// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';

test.describe('Flat Blog Routing', () => {

    test('Access nested post at root URL (Archive)', async ({ page }) => {
        // Test case: archive/2024/astro-tips.md -> /posts/astro-tips
        await page.goto('/posts/astro-tips');
        await expect(page.locator('h1.post-title')).toHaveText(/Astro Tips/i);
    });

    test('Access nested post at root URL (Lore Ipsum)', async ({ page }) => {
        // Test case: lore-ipsum/lore-ipsum-1.md -> /posts/lore-ipsum-1
        await page.goto('/posts/lore-ipsum-1');
        await expect(page.locator('h1.post-title')).toBeVisible(); // Just check it loads a post
    });

    test('Nested URL should NOT exist', async ({ page }) => {
        const nestedUrls = [
            '/posts/archive/2024/astro-tips',
            '/posts/lore-ipsum/lore-ipsum-1'
        ];

        for (const url of nestedUrls) {
            const response = await page.goto(url);
            expect(response?.status()).toBe(404);
        }
    });

    test('Category page links use flat URLs (Regression)', async ({ page }) => {
        // This test prevents the bug where links used raw post.id (e.g., /posts/lore-ipsum/lore-ipsum-1)
        // instead of flattened slug (e.g., /posts/lore-ipsum-1)
        await page.goto('/blogs/development');

        const postLinks = page.locator('a[href^="/posts/"]');
        const count = await postLinks.count();

        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < Math.min(count, 5); i++) {
            const href = await postLinks.nth(i).getAttribute('href');
            // Flat URL: /posts/slug (one segment after /posts/)
            // Nested URL: /posts/folder/slug (multiple segments - BAD)
            const pathAfterPosts = href?.replace('/posts/', '') || '';
            expect(pathAfterPosts).not.toContain('/');
        }
    });

});
