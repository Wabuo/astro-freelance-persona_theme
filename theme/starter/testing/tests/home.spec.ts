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
        // Scroll down the page to trigger lazy loading and IntersectionObserver animations
        await page.evaluate(async () => {
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
            const scrollHeight = document.body.scrollHeight;
            for (let i = 0; i < scrollHeight; i += window.innerHeight / 2) {
                window.scrollTo(0, i);
                await delay(100);
            }
            window.scrollTo(0, 0);
        });

        // Wait for animations and ensure everything is revealed
        await page.waitForTimeout(2000); // Increased timeout to ensure Mobile Chrome scrollbars and fonts settle

        // Disable reveal animations and transitions for stability
        await page.addStyleTag({
            content: `
                [data-reveal] { opacity: 1 !important; transform: none !important; transition: none !important; }
                * { transition: none !important; animation: none !important; }
            `
        });

        // Ensure all images are fully loaded and decoded
        await page.evaluate(async () => {
            const images = Array.from(document.querySelectorAll('img'));
            images.forEach(img => img.loading = 'eager'); // Force eager loading
            await Promise.all(images.map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise((resolve) => {
                    img.addEventListener('load', resolve);
                    img.addEventListener('error', resolve);
                    setTimeout(resolve, 5000); // 5s fallback timeout
                });
            }));
        });
    }

    await expect(page).toHaveScreenshot('home-desktop.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.2, // Increased from 0.1 to allow for minor font rendering diffs and mobile scrollbars
        mask: [
            page.locator('.typing-lock'), // Mask the animated text
            page.locator('.typed-cursor'), // Mask the blinking cursor
            page.locator('.mascot-container') // Mask the bouncing mascot
        ]
    });
});
