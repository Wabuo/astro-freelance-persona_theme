// SPDX-FileCopyrightText: 2026 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';
import { themeConfig } from '@/freelance-persona.config';

test.describe('Configuration Integrity', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('Page Title matches Config', async ({ page }) => {
        // Escape special regex characters in the title (and trim whitespace)
        const escapedTitle = themeConfig.title.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        await expect(page).toHaveTitle(new RegExp(escapedTitle));
    });

    test('Social Links are rendered correctly', async ({ page }) => {
        for (const link of themeConfig.social_links) {
            // Select the anchor that contains the icon class
            // This avoids ambiguity if there are accessible hidden text versions
            const linkEl = page.locator(`.social-links a[href="${link.url}"]`).first();
            await expect(linkEl).toBeVisible();
            await expect(linkEl).toHaveAttribute('aria-label', link.name);
        }
    });

    test('Contact Form Provider is applied', async ({ page }) => {
        const form = page.locator('form.contact-form');
        const provider = themeConfig.contact_form?.provider || 'formspark';

        await expect(form).toBeVisible();
        await expect(form).toHaveAttribute('data-provider', provider);

        if (provider === 'custom' && themeConfig.contact_form?.action) {
            await expect(form).toHaveAttribute('action', themeConfig.contact_form.action);
        }
        // Add more provider specific checks here
    });
});
