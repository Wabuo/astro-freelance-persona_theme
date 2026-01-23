// SPDX-FileCopyrightText: 2026 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('Header Links work', async ({ page, isMobile }) => {
        if (isMobile) test.skip(); // Mobile navigation handled in interactions.spec.ts

        // Helper to check navigation.
        // We use 'header #navmenu a' to target the specific list items

        // About
        const aboutLink = page.locator('header #navmenu a[href*="about"]');
        await expect(aboutLink).toBeVisible();
        await aboutLink.click();
        await expect(page).toHaveURL(/#about/);
        // Ensure section is in view? (Mocked by checking URL hash for now)

        // Freelance (Services)
        const servicesLink = page.locator('header #navmenu a[href*="freelance"]');
        await expect(servicesLink).toBeVisible();
        await servicesLink.scrollIntoViewIfNeeded(); // Ensure it's in viewport
        await servicesLink.click();
        await expect(page).toHaveURL(/#freelance/);

        // Contact
        const contactLink = page.locator('header #navmenu a[href*="contact"]');
        await contactLink.click();
        await expect(page).toHaveURL(/#contact/);


        // Blog (External Link behavior or Page Nav?)
        // If it goes to /posts
        const blogLink = page.locator('header nav a[href="/posts"]');
        if (await blogLink.count() > 0) {
            await blogLink.click();
            await expect(page).toHaveURL(/\/posts/);
        }
    });

});
