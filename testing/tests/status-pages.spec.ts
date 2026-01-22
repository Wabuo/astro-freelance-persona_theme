/*
 * SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
 * SPDX-License-Identifier: MIT
 */

import { test, expect } from '@playwright/test';

test.describe('New Pages Verification', () => {

    test('404 Page should load with Lancy mascot', async ({ page }) => {
        // Navigate to a non-existent page
        await page.goto('/does-not-exist');

        // Check for 404 Heading
        await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
        await expect(page.getByText('Page Not Found')).toBeVisible();

        // Check for Lancy Image
        const lancyImage = page.locator('.lancy-404');
        await expect(lancyImage).toBeVisible();

        // Check for Return Home button
        const homeBtn = page.getByRole('link', { name: 'Return to Home' });
        await expect(homeBtn).toBeVisible();
        await expect(homeBtn).toHaveAttribute('href', '/');
    });

    test('403 Page should load with "You Shall Not Pass" theme', async ({ page }) => {
        await page.goto('/403');

        // Check for 403 Heading
        await expect(page.getByRole('heading', { name: '403' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'YOU SHALL NOT PASS!' })).toBeVisible();

        // Check for Lancy Image
        const lancyImage = page.locator('.lancy-403');
        await expect(lancyImage).toBeVisible();

        // Check for Retreat button
        const retreatBtn = page.getByRole('link', { name: 'Retreat to Safety' });
        await expect(retreatBtn).toBeVisible();
        await expect(retreatBtn).toHaveAttribute('href', '/');
    });

    test('Coming Soon Page should load with "Watch This Space"', async ({ page }) => {
        await page.goto('/coming-soon');

        // Check for Headings
        await expect(page.getByRole('heading', { name: 'Watch This Space!' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Something Awesome is Brewing' })).toBeVisible();

        // Check for Lancy Image
        const lancyImage = page.locator('.lancy-working');
        await expect(lancyImage).toBeVisible();

        // Check for Back to Home button
        const backBtn = page.getByRole('link', { name: 'Back to Home' });
        await expect(backBtn).toBeVisible();
        await expect(backBtn).toHaveAttribute('href', '/');
    });

});
