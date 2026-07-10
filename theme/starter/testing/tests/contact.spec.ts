// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';
import { themeConfig } from '@/freelance-persona.config';

test('Contact Form Submission', async ({ page }, testInfo) => {
    if (testInfo.project.name === 'noscript') test.skip(true, 'Contact form intercept requires JS');

    // Mock the external provider request to avoid spamming real services
    // The config uses formspark with access_key "your-access-key-here"
    // This creates action URL: https://submit-form.com/your-access-key-here
    
    // Use a wildcard pattern for the route
    await page.route('https://submit-form.com/**', async (route) => {
        if (route.request().method() === 'POST') {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ ok: true, message: "Submission successful" })
            });
        } else {
            await route.continue();
        }
    });

    await page.goto('/');

    // Scroll to contact section
    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();

    // Fill Form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="subject"]', 'Automated Test Subject');
    await page.fill('textarea[name="message"]', 'This is a test message from Playwright.');

    // Submit form by dispatching submit event (click doesn't trigger handler in test mode)
    await page.evaluate(() => {
        const form = document.querySelector('form.contact-form');
        if (form) {
            const event = new Event('submit', { cancelable: true, bubbles: true });
            form.dispatchEvent(event);
        }
    });

    // Wait for the fetch to complete
    await page.waitForTimeout(2000);

    // Verify Success Message
    const successMsg = page.locator('.sent-message');
    await expect(successMsg).toBeVisible({ timeout: 10000 });
    await expect(successMsg).toContainText('Your message has been sent');
});