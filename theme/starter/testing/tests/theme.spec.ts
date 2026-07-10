// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';

test.describe('Theme Toggle & Dark Mode', () => {
    test.beforeEach(async ({ page }, testInfo) => {
        // Test-mode CSS handles animations/transitions
        if (testInfo.project.name !== 'noscript') {
            await page.evaluate(() => document.fonts.ready);
        }
    });

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

    test('Toggle Button Switches Theme', async ({ page }, testInfo) => {
        await page.goto('/');
        await page.waitForLoadState('load');
        if (testInfo.project.name !== 'noscript') {
            await page.evaluate(() => document.fonts.ready);
        }

        const isMobile = page.viewportSize()!.width < 992;
        const toggleId = isMobile ? 'theme-menu-toggle-mobile' : 'theme-menu-toggle-desktop';
        const navId = isMobile ? '#navmenu-mobile' : '#navmenu';
        
        // Use a more specific locator to avoid strict mode violations
        const toggleBtn = page.locator(`${navId} label[for="${toggleId}"].theme-toggle`);
        const toggleCheckbox = page.locator(`#${toggleId}`);
        
        // Mobile Toggle (Popover) handling
        if (isMobile) {
            await page.locator('.nav-toggle').click();
            await expect(page.locator('#mobile-nav')).toBeVisible();
        }

        // Expand Theme menu if not already open (especially for noscript)
        if (!(await toggleCheckbox.isChecked())) {
            await toggleBtn.click();
        }
        
        // Ensure menu is visible (specific to the current navId to avoid noscript ambiguity)
        const menu = page.locator(`${navId} .theme-dropdown-menu`);
        await expect(menu).toBeVisible();

        // Click Dark Theme Toggle
        // In noscript mode, both dropdowns might be 'visible' if the checkboxes are checked.
        // We ensure we only click the one in our target navId.
        const darkLabel = menu.locator('label.theme-label-dark');
        await darkLabel.dispatchEvent('click');

        await page.waitForTimeout(200);

        // Verify theme change (check radio state)
        const darkRadio = page.locator('#theme-dark');
        await expect(darkRadio).toBeChecked();

        // Switch back to Light
        if (!(await toggleCheckbox.isChecked())) {
            await toggleBtn.click();
        }
        await menu.locator('label.theme-label-light').dispatchEvent('click');
        await page.waitForTimeout(200);
        await expect(page.locator('#theme-light')).toBeChecked();
    });

    test('Preference Persists on Reload', async ({ page }, testInfo) => {
        if (testInfo.project.name === 'noscript') test.skip(true, 'Persistence requires JavaScript');
        
        await page.goto('/');
        await page.waitForLoadState('load');

        const isMobile = page.viewportSize()!.width < 992;
        const navId = isMobile ? '#navmenu-mobile' : '#navmenu';
        const toggleId = isMobile ? 'theme-menu-toggle-mobile' : 'theme-menu-toggle-desktop';
        
        if (isMobile) {
            await page.locator('.nav-toggle').click();
        }

        // Open menu
        const menu = page.locator(`${navId} .theme-dropdown-menu`);
        await page.locator(`${navId} label[for="${toggleId}"].theme-toggle`).click();
        await expect(menu).toBeVisible();
        
        // Switch to Dark
        await menu.locator('label.theme-label-dark').dispatchEvent('click');
        
        // Verify it changed before reloading
        const darkRadio = page.locator('#theme-dark');
        await expect(darkRadio).toBeChecked();
        
        await page.waitForTimeout(500); // Give a moment for potential async persistence

        // Reload
        await page.reload();
        await page.waitForLoadState('load');

        // Use toPass to allow for hydration/CSS application time
        await expect(async () => {
            await expect(page.locator('#theme-dark')).toBeChecked();
        }).toPass();
    });

    test('Layout Stability on Theme Switch (Home Page)', async ({ page }, testInfo) => {
        if (testInfo.project.name === 'noscript') test.skip(true, 'Redundant');

        await page.goto('/');
        await page.waitForLoadState('load');
        if (testInfo.project.name !== 'noscript') {
            await page.evaluate(() => document.fonts.ready);
        }
        
        const isMobile = page.viewportSize()!.width < 992;
        const navId = isMobile ? '#navmenu-mobile' : '#navmenu';
        const toggleId = isMobile ? 'theme-menu-toggle-mobile' : 'theme-menu-toggle-desktop';

        const getLayoutBounds = async () => {
            const footer = page.locator('#footer');
            await footer.scrollIntoViewIfNeeded();
            return await footer.boundingBox();
        };

        // 1. Initial Bounds (Light/Auto)
        const lightBounds = await getLayoutBounds();

        // 2. Switch to Dark
        if (isMobile) {
            await page.locator('.nav-toggle').click();
        }
        const menu = page.locator(`${navId} .theme-dropdown-menu`);
        await page.locator(`${navId} label[for="${toggleId}"].theme-toggle`).click();
        await expect(menu).toBeVisible();
        await menu.locator('label.theme-label-dark').dispatchEvent('click');
        
        // Close the menu to remove backdrop side-effects
        await page.locator(`${navId} label[for="${toggleId}"].theme-toggle`).click();
        
        await page.waitForTimeout(500); // Wait for theme transition

        // 3. Compare Bounds
        const darkBounds = await getLayoutBounds();
        // Allow for minor sub-pixel or font-induced shifts (up to 2px)
        expect(Math.abs(darkBounds!.width - lightBounds!.width)).toBeLessThan(2);
        expect(Math.abs(darkBounds!.height - lightBounds!.height)).toBeLessThan(2);
        expect(Math.abs(darkBounds!.x - lightBounds!.x)).toBeLessThan(2);
        expect(Math.abs(darkBounds!.y - lightBounds!.y)).toBeLessThan(2);
    });

    // Sub-pages list for stability check
    const pages = [
        { name: 'Blog: Development', url: '/blogs/development' },
        { name: 'Blog: Design System', url: '/blogs/design-system' },
        { name: 'Post: First Post', url: '/posts/first-post' },
        { name: 'Post: Lore Ipsum 10', url: '/posts/lore-ipsum-10' },
        { name: 'Legal Notice', url: '/legal/legal-notice' },
        { name: '404 Error Page', url: '/404' },
        { name: '403 Error Page', url: '/403' },
        { name: 'Coming Soon Page', url: '/coming-soon' }
    ];

    for (const p of pages) {
        test(`Layout Stability on Theme Switch (${p.name})`, async ({ page }, testInfo) => {
            if (testInfo.project.name === 'noscript') test.skip(true, 'Redundant');

            await page.goto(p.url);
            await page.waitForLoadState('load');
            if (testInfo.project.name !== 'noscript') {
                await page.evaluate(() => document.fonts.ready);
            }
            
            const isMobile = page.viewportSize()!.width < 992;
            const navId = isMobile ? '#navmenu-mobile' : '#navmenu';
            const toggleId = isMobile ? 'theme-menu-toggle-mobile' : 'theme-menu-toggle-desktop';

            const getLayoutBounds = async () => {
                const footer = page.locator('#footer');
                await footer.scrollIntoViewIfNeeded();
                return await footer.boundingBox();
            };

            const lightBounds = await getLayoutBounds();

            if (isMobile) {
                await page.locator('.nav-toggle').click();
            }
            const menu = page.locator(`${navId} .theme-dropdown-menu`);
            await page.locator(`${navId} label[for="${toggleId}"].theme-toggle`).click();
            await expect(menu).toBeVisible();
            await menu.locator('label.theme-label-dark').dispatchEvent('click');
            
            // Close menu
            await page.locator(`${navId} label[for="${toggleId}"].theme-toggle`).click();
            
            await page.waitForTimeout(500);

            const darkBounds = await getLayoutBounds();
            
            // Sub-pixel rendering and font-weight shifts in dark mode can cause 
            // tiny mismatches (e.g. 0.5-1.5px). We use a 2px tolerance for stability.
            expect(Math.abs(darkBounds!.width - lightBounds!.width)).toBeLessThan(2);
            expect(Math.abs(darkBounds!.height - lightBounds!.height)).toBeLessThan(2);
            expect(Math.abs(darkBounds!.x - lightBounds!.x)).toBeLessThan(2);
            expect(Math.abs(darkBounds!.y - lightBounds!.y)).toBeLessThan(2);
        });
    }
});
