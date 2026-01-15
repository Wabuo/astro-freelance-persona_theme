import { test, expect } from '@playwright/test';

test('404 Page Visual Regression', async ({ page }) => {
    // Visit a non-existent URL
    await page.goto('/non-existent-page-for-testing-404');

    await expect(page).toHaveTitle(/404/); // Adjust based on your 404 page title

    await expect(page).toHaveScreenshot('404-desktop.png', {
        fullPage: true
    });
});
