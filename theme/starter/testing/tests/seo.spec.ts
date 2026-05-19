// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';

test.describe('SEO Checks', () => {
    test('Homepage Meta Tags', async ({ page }) => {
        await page.goto('/');

        const desc = page.locator('meta[name="description"]');
        await expect(desc).toHaveCount(1);
        const content = await desc.getAttribute('content');
        expect(content).toBeTruthy();

        // Canonical
        const canonical = page.locator('link[rel="canonical"]');
        await expect(canonical).toHaveCount(1);
    });

    test('Blog Post Meta Tags', async ({ page }) => {
        await page.goto('/posts/first-post');

        const desc = page.locator('meta[name="description"]');
        await expect(desc).toHaveCount(1);

        // OG Image
        // const ogImage = page.locator('meta[property="og:image"]');
        // await expect(ogImage).toHaveCount(1);
    });
});
