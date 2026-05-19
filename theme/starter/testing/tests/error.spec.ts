// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';

test('404 Page Visual Regression', async ({ page }, testInfo) => {
    // Visit a non-existent URL
    await page.goto('/non-existent-page-for-testing-404');
    await page.waitForLoadState('load');
    if (testInfo.project.name !== 'noscript') {
        await page.evaluate(() => document.fonts.ready);
    }

    await expect(page).toHaveTitle(/404/); // Adjust based on your 404 page title

    // Disable animations for stability
    if (testInfo.project.name !== 'noscript') {
        await page.addStyleTag({
            content: `* { transition: none !important; animation: none !important; }`
        });
    }

    await expect(page).toHaveScreenshot('404-desktop.png', {
        fullPage: true,
        mask: [page.locator('.typing-lock'), page.locator('.typed-cursor'), page.locator('.mascot-container')]
    });
});
