// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';

test.describe('Theme Toggle & Dark Mode', () => {

    test('Default matches system preference (Dark)', async ({ page }) => {
        // 1. Emulate System Dark Mode
        await page.emulateMedia({ colorScheme: 'dark' });

        await page.goto('/');

        // 2. Attribute should be NULL (handled by CSS)
        await expect(page.locator('html')).not.toHaveAttribute('data-theme');

        // 3. Check for specific CSS variable (computed check)
        // We wait a bit to ensure styles are applied
        await page.waitForTimeout(1000);

        const bgColor = await page.evaluate(() => {
            const el = document.documentElement;
            const computed = getComputedStyle(el);
            return computed.getPropertyValue('--background-color').trim();
        });

        // #1a1a1a is rgb(26, 26, 26)
        // We accept both formats
        expect(['#1a1a1a', 'rgb(26, 26, 26)']).toContain(bgColor);
    });

    test('Default matches system preference (Light)', async ({ page }) => {
        // 1. Emulate System Light Mode
        await page.emulateMedia({ colorScheme: 'light' });

        await page.goto('/');

        // 2. Attribute should be NULL (handled by CSS)
        await expect(page.locator('html')).not.toHaveAttribute('data-theme');

        // 3. Check CSS variable
        const bgColor = await page.evaluate(() => {
            return getComputedStyle(document.documentElement).getPropertyValue('--background-color').trim();
        });
        // #ffffff is rgb(255, 255, 255)
        expect(['#ffffff', 'rgb(255, 255, 255)']).toContain(bgColor);
    });

    test('Toggle Button Switches Theme', async ({ page, isMobile }) => {
        // Start with Light
        await page.emulateMedia({ colorScheme: 'light' });
        await page.goto('/');

        const html = page.locator('html');
        await expect(html).not.toHaveAttribute('data-theme');

        // Listen for console logs
        page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));

        // Wait for hydration/listener attachment
        await page.waitForTimeout(1000);

        // Mobile Handling: Open Menu first
        if (isMobile) {
            console.log('Mobile View detected. Opening menu...');
            await page.click('.nav-toggle', { force: true });
            // Wait for the menu container to be visible
            await expect(page.locator('#navmenu')).toBeVisible();
            await page.waitForTimeout(500); // Allow animation to settle
        }

        // Click Toggle (Force if necessary, though good practice to wait)
        // We use force:true to bypass potential overlay issues if animation is slightly off
        await page.click('#theme-toggle', { force: true });

        // Should be Dark now
        await expect(html).toHaveAttribute('data-theme', 'dark');

        // Click Toggle Again
        await page.click('#theme-toggle', { force: true });

        // Should be Light again
        await expect(html).toHaveAttribute('data-theme', 'light');
    });

    test('Preference Persists on Reload', async ({ page, isMobile }) => {
        await page.emulateMedia({ colorScheme: 'light' });
        await page.goto('/');

        // Wait for hydration/listener attachment
        await page.waitForTimeout(1000);

        // Switch to Dark
        if (isMobile) {
            console.log('Mobile View detected. Opening menu...');
            await page.click('.nav-toggle', { force: true });
            await expect(page.locator('#navmenu')).toBeVisible();
            await page.waitForTimeout(500);
        }

        await page.click('#theme-toggle', { force: true });
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

        // Debug: Check localStorage before reload
        const storageBefore = await page.evaluate(() => localStorage.getItem('theme'));
        expect(storageBefore).toBe('dark');

        // Reload
        await page.reload();

        // Should still be Dark (localStorage check handled by script)
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    });
});
