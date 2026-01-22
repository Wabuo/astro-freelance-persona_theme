/*
 * SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
 * SPDX-License-Identifier: MIT
 */

import { test, expect } from '@playwright/test';

test.describe('Features/Services Section Links', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('Services section should have variable link types', async ({ page }) => {
        // 1. Internal Link Card (Coming Soon) - Title: Blazing Fast
        // Locate the card wrapper or the card itself
        const comingSoonCard = page.locator('.feature-card', { hasText: 'Blazing Fast' });
        await expect(comingSoonCard).toBeVisible();

        // Trigger hover to show the button text
        await comingSoonCard.hover();

        // Check button text visibility
        const comingSoonAction = comingSoonCard.locator('.feature-hover-action');
        await expect(comingSoonAction).toBeVisible();
        await expect(comingSoonAction).toHaveText('Tell me More');

        // Check Link URL (The card itself is the link)
        await expect(comingSoonCard).toHaveAttribute('href', '/coming-soon');


        // 2. Anchor Link Card (Contact) - Title: SEO Optimized
        const contactCard = page.locator('.feature-card', { hasText: 'SEO Optimized' });
        await expect(contactCard).toBeVisible();

        await contactCard.hover();
        const contactAction = contactCard.locator('.feature-hover-action');
        await expect(contactAction).toBeVisible();
        await expect(contactAction).toHaveText('Contact Form');
        await expect(contactCard).toHaveAttribute('href', '#contact');


        // 3. External Link Card (Source Code) - Title: Responsive Design
        const sourceCard = page.locator('.feature-card', { hasText: 'Responsive Design' });
        await expect(sourceCard).toBeVisible();

        await sourceCard.hover();
        const sourceAction = sourceCard.locator('.feature-hover-action');
        await expect(sourceAction).toBeVisible();
        await expect(sourceAction).toHaveText('Source Code');
        await expect(sourceCard).toHaveAttribute('href', 'https://github.com/freelance-persona');
    });

});
