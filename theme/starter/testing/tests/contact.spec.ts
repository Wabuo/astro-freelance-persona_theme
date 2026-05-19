// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';

test('Contact Form Submission', async ({ page }, testInfo) => {
    if (testInfo.project.name === 'noscript') test.skip('Contact form intercept requires JS');
    if (testInfo.project.name === 'firefox') test.skip('Contact form intercept is flaky in Firefox');

    // Mock the external provider request to avoid spamming real services
    // This catches ANY POST to external sites or common form endpoints
    await page.route('**/*', async (route) => {
        const url = route.request().url();
        if (route.request().method() === 'POST' && (url.includes('contact') || url.includes('submit') || url.includes('ntfy'))) {
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

    // Click Send
    await page.click('button[type="submit"]');

    // Verify Success Message
    const successMsg = page.locator('.sent-message');
    await expect(successMsg).toBeVisible({ timeout: 10000 });
    await expect(successMsg).toContainText('Your message has been sent');
});
