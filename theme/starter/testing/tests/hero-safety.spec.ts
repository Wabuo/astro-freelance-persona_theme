// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';

test('Hero Layout Safety Check', async ({ page }) => {
    // 1. Mobile Portrait (Safe? Should show full height usually)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page).toHaveScreenshot('hero-mobile-portrait.png', {
        mask: [page.locator('.typing-lock'), page.locator('.typed-cursor'), page.locator('.mascot-container')]
    });

    // 2. Mobile Landscape / Short Desktop (Risk Zone!)
    // Wide enough to force 'cover' to scale by width.
    // Short enough to force vertical cropping.
    // With 'bottom' alignment, top should be cropped.
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto('/');
    await expect(page).toHaveScreenshot('hero-landscape-short.png', {
        mask: [page.locator('.typing-lock'), page.locator('.typed-cursor'), page.locator('.mascot-container')]
    });
});
