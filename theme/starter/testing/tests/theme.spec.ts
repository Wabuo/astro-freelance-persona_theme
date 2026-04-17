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
        // Check for specific CSS variable (computed check)
        const bgColor = await page.evaluate(() => {
            return getComputedStyle(document.body).getPropertyValue('--background-color').trim();
        });

        // #272829 is rgb(39, 40, 41) - Background for Dark Theme
        // #303030 is rgb(48, 48, 48) - Background for Dark Theme on Home Page
        // We accept all formats depending on the page type and browser compute strategy
        expect(['#272829', 'rgb(39, 40, 41)', '#303030', 'rgb(48, 48, 48)']).toContain(bgColor);
    });

    test('Default matches system preference (Light)', async ({ page }) => {
        // 1. Emulate System Light Mode
        await page.emulateMedia({ colorScheme: 'light' });

        await page.goto('/');

        // 2. Check CSS variable

        const bgColor = await page.evaluate(() => {
            return getComputedStyle(document.body).getPropertyValue('--background-color').trim();
        });
        // #ffffff is rgb(255, 255, 255)
        expect(['#ffffff', 'rgb(255, 255, 255)']).toContain(bgColor);
    });

    test('Toggle Button Switches Theme', async ({ page, isMobile }) => {
        // Start with Light
        await page.emulateMedia({ colorScheme: 'light' });
        await page.goto('/');

        // Listen for console logs
        page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));

        // Wait for hydration/listener attachment
        await page.waitForTimeout(1000);

        // Mobile Handling: Open Menu first
        if (isMobile) {
            console.log('Mobile View detected. Opening menu...');
            await page.click('.nav-toggle', { force: true });
            // Wait for the menu container to be visible
            await expect(page.locator('#navmenu-mobile')).toBeVisible();
            await page.waitForTimeout(500); // Allow animation to settle
        }

        // Open Dropdown
        const toggleId = isMobile ? '#theme-menu-toggle-mobile' : '#theme-menu-toggle-desktop';
        await page.locator(`label[for="${toggleId.substring(1)}"].theme-toggle`).click({ force: true });

        const menuPrefix = isMobile ? '#navmenu-mobile' : '#navmenu';

        // Click Dark Theme Toggle
        await page.locator(`${menuPrefix} label[for="theme-dark"]`).click({ force: true });

        await page.waitForTimeout(100);

        // Should be Dark now
        const isDarkChecked = await page.locator('#theme-dark').isChecked();
        expect(isDarkChecked).toBe(true);

        // Click Light Theme Toggle
        const isMenuOpen = await page.locator(`#${toggleId.substring(1)}`).isChecked();
        if (!isMenuOpen) {
            await page.locator(`label[for="${toggleId.substring(1)}"].theme-toggle`).click({ force: true });
        }
        await page.locator(`${menuPrefix} label[for="theme-light"]`).click({ force: true });

        await page.waitForTimeout(100);

        // Should be Light again
        const isLightChecked = await page.locator('#theme-light').isChecked();
        expect(isLightChecked).toBe(true);
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
            await expect(page.locator('#navmenu-mobile')).toBeVisible();
            await page.waitForTimeout(500);
        }

        const toggleId = isMobile ? '#theme-menu-toggle-mobile' : '#theme-menu-toggle-desktop';
        await page.locator(`label[for="${toggleId.substring(1)}"].theme-toggle`).click({ force: true });
        const menuPrefix = isMobile ? '#navmenu-mobile' : '#navmenu';
        await page.locator(`${menuPrefix} label[for="theme-dark"]`).click({ force: true });

        await page.waitForTimeout(100);

        // Debug: Check localStorage before reload
        const storageBefore = await page.evaluate(() => localStorage.getItem('theme'));
        expect(storageBefore).toBe('dark');

        // Reload
        await page.reload();

        // Should still be Dark
        const isDarkChecked = await page.locator('#theme-dark').isChecked();
        expect(isDarkChecked).toBe(true);
    });
});
