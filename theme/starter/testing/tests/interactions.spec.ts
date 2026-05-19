// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';

test.describe('Interactions & Responsiveness', () => {

    test('Scrollspy Updates Active Nav Link', async ({ page }, testInfo) => {
        // Scrollspy requires JS
        if (testInfo.project.name === 'noscript') test.skip();
        
        await page.goto('/');

        // Targets
        const servicesSection = page.locator('#freelance');
        const servicesNav = page.locator('#navmenu a[href*="freelance"]');

        // Scroll to Services explicitly to trigger scrollspy (top of section)
        // scrollIntoViewIfNeeded is inconsistent with offset logic
        const offsetTop = await servicesSection.evaluate(el => (el as HTMLElement).offsetTop);
        await page.evaluate((pos) => window.scrollTo(0, pos), offsetTop);

        // Allow scrollspy script to fire and apply class
        await expect(async () => {
            await expect(servicesNav).toHaveClass(/active/);
        }).toPass();
    });

    test('Mobile Menu Interaction', async ({ page, isMobile }) => {
        if (!isMobile) test.skip();

        await page.goto('/');

        const toggleBtn = page.locator('.nav-toggle');
        const mobileNav = page.locator('#mobile-nav');

        // Open
        await toggleBtn.click();

        // Wait for popover to be open (using pseudo-class check since we use native Popover API)
        await expect(async () => {
            const isOpen = await mobileNav.evaluate(el => el.matches(':popover-open'));
            expect(isOpen).toBe(true);
        }).toPass();

        await expect(page).toHaveScreenshot('mobile-menu-open.png', {
            animations: 'disabled',
            mask: [page.locator('.typing-lock'), page.locator('.typed-cursor'), page.locator('.mascot-container')]
        });

        // Close via the dedicated close button (nav-toggle only shows, not hides)
        const closeBtn = page.locator('button.nav-close[aria-label="Close navigation menu"]');
        await closeBtn.click();
        await expect(async () => {
            const isOpen = await mobileNav.evaluate(el => el.matches(':popover-open'));
            expect(isOpen).toBe(false);
        }).toPass();

        // Re-open and test light dismiss via Escape key (Popover API natively supports this)
        await toggleBtn.click();
        await expect(async () => {
            const isOpen = await mobileNav.evaluate(el => el.matches(':popover-open'));
            expect(isOpen).toBe(true);
        }).toPass();

        // Light dismiss via Escape
        await page.keyboard.press('Escape');
        
        await expect(async () => {
            const isOpen = await mobileNav.evaluate(el => el.matches(':popover-open'));
            expect(isOpen).toBe(false);
        }).toPass();
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

    test('Contact Form Input Focus', async ({ page }, testInfo) => {
        if (testInfo.project.name === 'noscript') test.skip(true, 'Focus styles/interactions behave differently without JS');
        await page.goto('/');
        
        // Find the name input
        const nameInput = page.locator('#contact input[name="name"]');
        await expect(nameInput).toBeVisible();
        
        // Scroll to the contact section so it's in view
        await nameInput.scrollIntoViewIfNeeded();
        
        // Focus the input
        await nameInput.focus();
        
        // Focus Subject field
        await page.locator('.contact-form input[name="subject"]').focus();
        await page.waitForTimeout(500); // Allow focus ring animation to settle

        const contactForm = page.locator('.contact-form');
        await expect(contactForm).toHaveScreenshot('contact-form-focus.png', {
            animations: 'disabled',
            mask: [page.locator('.typed-cursor'), page.locator('.mascot-container')] // Mask cursor and mascot
        });
    });

});
