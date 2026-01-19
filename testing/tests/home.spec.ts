// SPDX-FileCopyrightText: 2026 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';

test('Home Visual Regression', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/freelance-persona/); // Adjust based on your config

    // Wait for fonts or animations if necessary
    // await page.waitForTimeout(1000); 

    await expect(page).toHaveScreenshot('home-desktop.png', {
        fullPage: true,
        mask: [
            page.locator('.typing-lock'), // Mask the animated text
            page.locator('.typed-cursor') // Mask the blinking cursor
        ]
    });
});
