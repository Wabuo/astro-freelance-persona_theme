// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';

test('Home Visual Regression', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.waitForLoadState('load');
    if (testInfo.project.name !== 'noscript') {
        await page.evaluate(() => document.fonts.ready);
    }
    await expect(page).toHaveTitle(/freelance-persona/); // Adjust based on your config

    if (testInfo.project.name !== 'noscript') {
        // In test mode, animations are disabled via CSS, so no need to scroll
        // Just ensure all images are loaded
        await page.evaluate(async () => {
            const images = Array.from(document.querySelectorAll('img'));
            images.forEach(img => img.loading = 'eager'); // Force eager loading
            await Promise.all(images.map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise((resolve) => {
                    img.addEventListener('load', resolve);
                    img.addEventListener('error', resolve);
                    setTimeout(resolve, 3000);
                });
            }));
        });
    }

    await expect(page).toHaveScreenshot('home-desktop.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.25,
        mask: [
            page.locator('.typing-lock'),
            page.locator('.typed-cursor'),
            page.locator('.mascot-container'),
            page.locator('.hero .typing-wrapper'),
        ]
    });
});
