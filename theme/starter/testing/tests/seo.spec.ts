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

        // Open Graph website card (hero image -> large card)
        await expect(page.locator('meta[property="og:site_name"]')).toHaveCount(1);
        await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
        await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
        const ogType = await page
            .locator('meta[property="og:type"]')
            .getAttribute('content');
        expect(ogType).toBe('website');
        const ogUrl = await page
            .locator('meta[property="og:url"]')
            .getAttribute('content');
        expect(ogUrl).toMatch(/^https?:\/\//);
        const card = await page
            .locator('meta[name="twitter:card"]')
            .getAttribute('content');
        expect(card).toBe('summary_large_image');

        // JSON-LD: WebSite + Person on the homepage
        const ldJson = page.locator('script[type="application/ld+json"]');
        await expect(ldJson).toHaveCount(2);
        const website = JSON.parse((await ldJson.nth(0).textContent()) ?? '{}');
        expect(website['@type']).toBe('WebSite');
        expect(website.url).toMatch(/^https?:\/\//);
        const person = JSON.parse((await ldJson.nth(1).textContent()) ?? '{}');
        expect(person['@type']).toBe('Person');
        expect(person.name).toBeTruthy();
    });

    test('Blog Post Meta Tags', async ({ page }) => {
        await page.goto('/posts/bun-future');

        const desc = page.locator('meta[name="description"]');
        await expect(desc).toHaveCount(1);
        const descContent = await desc.getAttribute('content');
        expect(descContent).toBeTruthy();

        // Article card: og:type article + published time
        const ogType = await page
            .locator('meta[property="og:type"]')
            .getAttribute('content');
        expect(ogType).toBe('article');
        await expect(
            page.locator('meta[property="article:published_time"]'),
        ).toHaveCount(1);

        // Post with a thumbnail gets an absolute og:image and a large card
        const ogImage = page.locator('meta[property="og:image"]');
        await expect(ogImage).toHaveCount(1);
        const ogImageContent = await ogImage.getAttribute('content');
        expect(ogImageContent).toMatch(/^https?:\/\//);
        const card = await page
            .locator('meta[name="twitter:card"]')
            .getAttribute('content');
        expect(card).toBe('summary_large_image');

        // JSON-LD: BlogPosting on posts
        const ldJson = page.locator('script[type="application/ld+json"]');
        await expect(ldJson).toHaveCount(1);
        const posting = JSON.parse((await ldJson.textContent()) ?? '{}');
        expect(posting['@type']).toBe('BlogPosting');
        expect(posting.headline).toBeTruthy();
        expect(posting.datePublished).toBeTruthy();
        expect(posting.author?.['@type']).toBe('Person');
    });
});
