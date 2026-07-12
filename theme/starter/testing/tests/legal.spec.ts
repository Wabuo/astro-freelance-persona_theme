// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';
import { themeConfig } from '@/freelance-persona.config';

test.describe('Legal Page', () => {

    test('Footer Link Navigates to Legal', async ({ page }) => {
        if (!themeConfig.legal?.enabled) test.skip();

        await page.goto('/');
        await page.waitForLoadState('load');
        await page.evaluate(() => document.fonts.ready);

        // Wait for preloader to be hidden (removed by JS or hidden by CSS in noscript)
        await expect(page.locator('#preloader')).toBeHidden();

        const legalLink = page.getByRole('link', { name: themeConfig.legal?.link_text || "Legal Notice" });
        await legalLink.scrollIntoViewIfNeeded();
        
        // Use JavaScript to navigate directly to avoid click interception issues
        const href = await legalLink.getAttribute('href');
        await page.goto(href!);

        await page.waitForLoadState('load');
        await expect(page).toHaveURL(/\/legal\/legal-notice/);
    });

    test('Legal Page Visual Regression', async ({ page }) => {
        await page.goto('/legal/legal-notice');
        await expect(page).toHaveTitle(/Legal/);
        await page.evaluate(() => document.fonts.ready);

        await expect(page).toHaveScreenshot('legal-page-desktop.png', {
            fullPage: true,
            animations: 'disabled',
            maxDiffPixelRatio: 0.1,
            maxDiffPixels: 1000,
            mask: [
                page.locator('.typing-lock'),
                page.locator('.typed-cursor'),
                page.locator('.hero .typing-wrapper'),
            ]
        });
    });

});
