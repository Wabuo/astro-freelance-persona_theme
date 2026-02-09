// SPDX-FileCopyrightText: 2026 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';

test.describe('Interactions & Responsiveness', () => {

    test('Scrollspy Updates Active Nav Link', async ({ page }) => {
        await page.goto('/');

        // Targets
        const servicesSection = page.locator('#freelance');
        const servicesNav = page.locator('#navmenu a[href*="freelance"]');

        // Scroll to Services explicitly to trigger scrollspy (top of section)
        // scrollIntoViewIfNeeded is inconsistent with offset logic
        const offsetTop = await servicesSection.evaluate(el => (el as HTMLElement).offsetTop);
        await page.evaluate((pos) => window.scrollTo(0, pos), offsetTop);

        // Allow scrollspy script to fire
        await page.waitForTimeout(1000);

        await expect(servicesNav).toHaveClass(/active/);
    });

    test('Mobile Menu Interaction', async ({ page, isMobile }) => {
        if (!isMobile) test.skip();

        await page.goto('/');

        const toggleBtn = page.locator('.nav-toggle');
        const header = page.locator('.header');

        // Open
        await toggleBtn.click();

        // Wait for popover to be open (using pseudo-class check since we use native Popover API)
        await expect(header).toHaveJSProperty('matches', (el: HTMLElement) => el.matches(':popover-open'));

        await expect(page).toHaveScreenshot('mobile-menu-open.png', {
            mask: [page.locator('.typing-lock'), page.locator('.typed-cursor')]
        });

        // Close via button
        await toggleBtn.click();
        await expect(header).not.toHaveJSProperty('matches', (el: HTMLElement) => el.matches(':popover-open'));

        // Re-open and test overlay click (Backdrop is part of the element in standard inspection, but click might need coords)
        // With Popover API, the backdrop is a pseudo-element. 
        // We can test light dismiss by clicking outside.
        await toggleBtn.click();
        await expect(header).toHaveJSProperty('matches', (el: HTMLElement) => el.matches(':popover-open'));

        // Click body (outside nav) to trigger light dismiss
        await page.mouse.click(10, 10); // Click top-left of viewport (header is top-right/drawer is left but we want safe outside)
        // Actually drawer is left 0. safe spot is far right.
        await page.mouse.click(viewportWidth - 10, viewportHeight / 2);

        await expect(header).not.toHaveJSProperty('matches', (el: HTMLElement) => el.matches(':popover-open'));
    });

    test('Layout Stability on Resize', async ({ page }) => {
        // This is implicitly tested by running the suite on 'Mobile Chrome', 
        // but we can add specific checks here if needed.
        await page.goto('/');

        // Verify no horizontal scrollbar on main body (common overflow issue)
        const pageWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = await page.evaluate(() => window.innerWidth);

        // Allowing for small discrepancies due to scrollbars
        expect(pageWidth).toBeLessThanOrEqual(viewportWidth + 20);
    });

});
