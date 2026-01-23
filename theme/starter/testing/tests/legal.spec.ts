// SPDX-FileCopyrightText: 2026 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';
import { themeConfig } from '@/freelance-persona.config';

test.describe('Legal Page', () => {

    test('Footer Link Navigates to Legal', async ({ page }) => {
        if (!themeConfig.legal?.enabled) test.skip();

        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');

        // Wait for preloader to be removed to ensure footer is clickable
        await expect(page.locator('#preloader')).toHaveCount(0);

        const legalLink = page.getByRole('link', { name: themeConfig.legal?.link_text || "Legal Notice" });
        await legalLink.scrollIntoViewIfNeeded();
        await legalLink.click();

        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(/\/legal\/legal-notice/);
    });

    test('Legal Page Visual Regression', async ({ page }) => {
        await page.goto('/legal/legal-notice');
        await expect(page).toHaveTitle(/Legal/);

        await expect(page).toHaveScreenshot('legal-page-desktop.png', {
            fullPage: true
        });
    });

});
