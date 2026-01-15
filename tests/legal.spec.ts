import { test, expect } from '@playwright/test';
import { themeConfig } from '../theme/starter/src/freelance-persona.config';

test.describe('Legal Page', () => {

    test('Footer Link Navigates to Legal', async ({ page }) => {
        if (!themeConfig.legal?.enabled) test.skip();

        await page.goto('/');

        const legalLink = page.getByRole('link', { name: themeConfig.legal?.link_text || "Legal Notice" });
        await legalLink.scrollIntoViewIfNeeded();
        await legalLink.click();

        await expect(page).toHaveURL(/\/legal\/legal-notice/);
    });

    test('Legal Page Visual Regression', async ({ page }) => {
        await page.goto('/legal/legal-notice');
        await expect(page).toHaveTitle(/Legal/);

        await expect(page).toHaveScreenshot('legal-page-desktop.png', {
            fullPage: true
        });
    });

});
