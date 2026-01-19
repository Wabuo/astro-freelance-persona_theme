// SPDX-FileCopyrightText: 2026 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';

test.describe('Attribution Logic & Interactions', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');
    });

    test('Hero Section: Standard Credit', async ({ page }) => {
        // Hero has explicit credit: "Your Photographers social"
        const attribution = page.locator('.hero .img-attribution').first();
        await expect(attribution).toBeVisible();

        // Line 1: Check Credit Name and Link
        const creditLink = attribution.locator('.credit-line a');
        await expect(creditLink).toBeVisible();
        await expect(creditLink).toHaveText(/Your Photographers social/);
        await expect(creditLink).toHaveAttribute('href', 'https://instagram.com');
        await expect(creditLink).toHaveAttribute('target', '_blank');
        await expect(creditLink).toHaveAttribute('rel', 'noopener noreferrer');

        // Check Icon
        await expect(attribution.locator('.bi-camera-fill')).toBeVisible();

        // Line 2: Check License
        const licenseLine = attribution.locator('.license-line');
        await expect(licenseLine).toBeVisible();
        await expect(licenseLine).toHaveText(/Fabio Rieker/); // Copyright owner
        await expect(licenseLine).toHaveText(/CC BY-SA 4.0/); // License
    });

    test('About Section: Hidden Credit / Promoted Copyright', async ({ page }) => {
        await page.goto('/'); // About is a section on the Home page
        await page.waitForLoadState('domcontentloaded');

        // Scroll to about section to ensure element is in view/rendered
        const aboutSection = page.locator('#about');
        await expect(aboutSection).toBeVisible();

        // Target the certificate attribution
        // We look for the first one (Theme License)
        const certItem = aboutSection.locator('.qualifications-item').filter({ hasText: 'Theme License' }).first();
        const attribution = certItem.locator('.cert-attribution');

        await expect(attribution).toBeVisible();

        // Verify Promoted Copyright (Line 1)
        const line1 = attribution.locator('.credit-line');
        await expect(line1).toBeVisible();
        await expect(line1).toHaveText(/Gemini/);
        await expect(line1.locator('.bi-camera-fill')).not.toBeVisible();
        await expect(line1).not.toHaveText(/©/);

        // Verify License (Line 2)
        const line2 = attribution.locator('.license-line');
        await expect(line2).toBeVisible();
        await expect(line2).toHaveText(/CC0/);

        // Visual Regression for Attributions
        await expect(attribution).toHaveScreenshot('cert-attribution-hidden.png');
    });

    test('About Section: Certificate Hover Interaction', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');

        const certItem = page.locator('#about .qualifications-item').filter({ hasText: 'Theme License' }).first();
        const titleLink = certItem.locator('.qualifications-link');
        const imgLink = certItem.locator('.cert-img-only-link');
        const img = imgLink.locator('img');

        // Initial State
        await expect(img).toHaveCSS('transform', 'none');

        // 1. Hover Title
        // Hover the text explicitly to avoid hitting overlapping areas or empty space
        await titleLink.locator('.qualifications-text').hover();
        await page.waitForTimeout(300);
        await expect(certItem).toHaveScreenshot('cert-hover-title.png');

        // 2. Hover Image
        await page.mouse.move(0, 0); // Reset
        await page.waitForTimeout(300);
        await imgLink.hover();
        await page.waitForTimeout(300);
        await expect(certItem).toHaveScreenshot('cert-hover-image.png');

        // 3. Hover Attribution (Should NOT trigger image scale)
        await page.mouse.move(0, 0); // Reset
        await page.waitForTimeout(300);

        const attribution = certItem.locator('.cert-attribution');
        await attribution.hover();
        await page.waitForTimeout(300);

        // Image should be at rest
        await expect(img).toHaveCSS('transform', 'none');
    });

    test('Blog Post: Hidden Credit Logic', async ({ page }) => {
        // Navigate to a known post with hidden credit
        await page.goto('/posts/lore-ipsum-1');
        await page.waitForLoadState('domcontentloaded');

        const attribution = page.locator('.post-img .img-attribution');
        await expect(attribution).toBeVisible();

        // Line 1: Gemini (Promoted)
        const line1 = attribution.locator('.credit-line');
        await expect(line1).toHaveText(/Gemini/);
        await expect(line1.locator('.bi-camera-fill')).not.toBeVisible();

        // Line 2: CC0
        const line2 = attribution.locator('.license-line');
        await expect(line2).toHaveText(/CC0/);
    });

});
