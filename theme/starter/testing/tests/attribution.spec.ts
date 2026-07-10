// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';
import {
    getHeroContent,
    getAboutContent,
    getBlogPostContent,
    getExpectedCreditText,
} from '../utils/content-parser';

// Load content at module level for all tests
const heroContent = getHeroContent();
const aboutContent = getAboutContent();

test.use({ deviceScaleFactor: 2 }); // Request high-resolution screenshots for small UI details

test.describe('Attribution Logic & Interactions', () => {

    test.beforeEach(async ({ page }, testInfo) => {
        await page.goto('/');
        await page.waitForLoadState('load');
        if (testInfo.project.name !== 'noscript') {
            await page.evaluate(() => document.fonts.ready).catch(() => {});
        }
    });

    test('Hero Section: Standard Credit', async ({ page }) => {
        const attribution = page.locator('.hero .img-attribution').first();
        await expect(attribution).toBeVisible();

        // Get expected values from content
        const credit = heroContent.img_credit;
        const copyright = heroContent.img_copyright;
        const license = heroContent.img_license;

        // Line 1: Check Credit Name and Link (if credit is an object with url)
        if (typeof credit === 'object' && credit.url) {
            const creditLink = attribution.locator('.credit-line a');
            await expect(creditLink).toBeVisible();
            await expect(creditLink).toHaveText(new RegExp(credit.name));
            await expect(creditLink).toHaveAttribute('href', credit.url);
            await expect(creditLink).toHaveAttribute('target', '_blank');
            await expect(creditLink).toHaveAttribute('rel', 'noopener noreferrer');
            // Check Icon if specified
            await expect(attribution.locator('.bi-camera-fill')).toBeVisible();
        }

        // Line 2: Check License
        const licenseLine = attribution.locator('.license-line');
        await expect(licenseLine).toBeVisible();
        if (copyright) {
            await expect(licenseLine).toHaveText(new RegExp(copyright));
        }
        const licenseText = typeof license === 'string' ? license : license?.license;
        if (licenseText) {
            await expect(licenseLine).toHaveText(new RegExp(licenseText));
        }
    });

    test('About Section: Hidden Credit / Promoted Copyright', async ({ page }) => {
        const aboutSection = page.locator('#about');
        await expect(aboutSection).toBeVisible();

        // Find the first qualification with an image (Theme License)
        const themeLicenseQual = aboutContent.qualifications_sidebar?.find(q => q.text === 'Theme License');
        if (!themeLicenseQual) {
            test.skip();
            return;
        }

        const certItem = aboutSection.locator('.qualifications-item').filter({ hasText: 'Theme License' }).first();
        const attribution = certItem.locator('.cert-attribution');

        await expect(attribution).toBeVisible();

        // Verify Promoted Copyright (Line 1)
        const line1 = attribution.locator('.credit-line');
        await expect(line1).toBeVisible();
        const expectedCredit = getExpectedCreditText(themeLicenseQual.img_credit, themeLicenseQual.img_copyright);
        await expect(line1).toHaveText(new RegExp(expectedCredit));

        // Hidden credit should not show camera icon
        if (themeLicenseQual.img_credit === 'hidden') {
            await expect(line1.locator('.bi-camera-fill')).not.toBeVisible();
            await expect(line1).not.toHaveText(/©/);
        }

        // Verify License (Line 2)
        const line2 = attribution.locator('.license-line');
        await expect(line2).toBeVisible();
        const licenseText = typeof themeLicenseQual.img_license === 'string'
            ? themeLicenseQual.img_license
            : themeLicenseQual.img_license?.license;
        if (licenseText) {
            await expect(line2).toHaveText(new RegExp(licenseText));
        }

        // Visual Regression for Attributions (Snapshotting parent certItem for context)
        await expect(certItem).toHaveScreenshot('cert-attribution-hidden.png', { animations: 'disabled' });
    });

    test('About Section: Certificate Hover Interaction', async ({ page, isMobile }) => {
        if (isMobile) test.skip();
        const certItem = page.locator('#about .qualifications-item').filter({ hasText: 'Theme License' }).first();
        const titleLink = certItem.locator('.qualifications-link');
        const imgLink = certItem.locator('.cert-img-only-link');
        const img = imgLink.locator('img');

        // Initial State
        await expect(img).toHaveCSS('transform', 'none');

        // 1. Hover Title
        await titleLink.locator('.qualifications-text').hover();
        await page.waitForTimeout(600); // Give transitions plenty of time to finish
        await expect(certItem).toHaveScreenshot('cert-hover-title.png', { maxDiffPixelRatio: 0.2, animations: 'disabled' });

        // 2. Hover Image
        await page.mouse.move(0, 0);
        await page.waitForTimeout(400);
        await imgLink.hover();
        await page.waitForTimeout(600);
        await expect(certItem).toHaveScreenshot('cert-hover-image.png', { maxDiffPixelRatio: 0.2, animations: 'disabled' });

        // 3. Hover Attribution (Should NOT trigger image scale)
        await page.mouse.move(0, 0);
        await page.waitForTimeout(400);

        const attribution = certItem.locator('.cert-attribution');
        await attribution.hover();
        await page.waitForTimeout(600);

        // Image should be at rest
        await expect(img).toHaveCSS('transform', 'none');
    });

    test('Blog Post: Hidden Credit Logic', async ({ page }, testInfo) => {
        // Get blog post content dynamically
        const postContent = getBlogPostContent('lore-ipsum-1');

        await page.goto('/posts/lore-ipsum-1');
        await page.waitForLoadState('load');
        if (testInfo.project.name !== 'noscript') {
            await page.evaluate(() => document.fonts.ready).catch(() => {});
        }

        const attribution = page.locator('.post-img .img-attribution');
        await expect(attribution).toBeVisible();

        // Line 1: Credit or Promoted Copyright
        const line1 = attribution.locator('.credit-line');
        const expectedCredit = getExpectedCreditText(postContent.img_credit, postContent.img_copyright);
        await expect(line1).toHaveText(new RegExp(expectedCredit));

        // Hidden credit should not show camera icon
        if (postContent.img_credit === 'hidden') {
            await expect(line1.locator('.bi-camera-fill')).not.toBeVisible();
        }

        // Line 2: License
        const line2 = attribution.locator('.license-line');
        const licenseText = typeof postContent.img_license === 'string'
            ? postContent.img_license
            : postContent.img_license?.license;
        if (licenseText) {
            await expect(line2).toHaveText(new RegExp(licenseText));
        }
    });

});
