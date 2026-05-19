// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';

test.describe('Global Icon Fixes', () => {
    test('Icons should not be selectable as text', async ({ page }) => {
        // Navigate to the home page (or a page with icons)
        await page.goto('/');

        // Selectors for icons we expect to find
        const iconSelectors = [
            '.bi',
            '.ai',
            '[class*="icon-"]'
        ];

        // Combine into a single locator strategy
        const combinedSelector = iconSelectors.join(', ');

        // Wait for at least one icon to be present (attached to DOM, not necessarily visible)
        await page.waitForSelector(combinedSelector, { state: 'attached' });

        // Get all matching icon elements
        const icons = await page.locator(combinedSelector).all();

        console.log(`Found ${icons.length} icons to test.`);

        // Check a sample of icons (or all) to ensure user-select is none
        for (const icon of icons) {
            const computedStyle = await icon.evaluate((el) => {
                const style = window.getComputedStyle(el);
                return {
                    userSelect: style.getPropertyValue('user-select'),
                    caretColor: style.getPropertyValue('caret-color'),
                };
            });

            // Verification
            expect(computedStyle.userSelect).toBe('none');

            // Note: caret-color might be 'rgba(0, 0, 0, 0)' or 'transparent' dependong on browser
            // We mainly care about user-select here for the "text" behavior
        }
    });
});
