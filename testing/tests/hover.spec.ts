// SPDX-FileCopyrightText: 2026 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';

// We group these by component to keep it organized.
// Note: We use { fullPage: false } for component snapshots to focus on the element states, 
// unless the hover affects the wider page.

test.describe('Visual Hover States', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');
    });

    test('Hero Section: Social Links', async ({ page }) => {
        const socialLinks = page.locator('#hero .social-links a');
        const count = await socialLinks.count();

        for (let i = 0; i < count; i++) {
            const link = socialLinks.nth(i);
            // Hover
            // Hover
            // Use dispatchEvent to bypass potential header obstruction
            await link.dispatchEvent('mouseenter');
            await link.dispatchEvent('mouseover'); // Dispatch both for robustness

            // Wait for transition
            await page.waitForTimeout(500);

            await expect(page.locator('#hero .social-links')).toHaveScreenshot(`hero-social-hover-${i}.png`);

            // Cleanup
            await link.dispatchEvent('mouseleave');
        }
    });

    test('Features: Available vs Unavailable Cards', async ({ page, isMobile }) => {
        if (isMobile) test.skip(); // Hover not applicable on mobile in strict sense

        const availableCard = page.locator('.feature-card:not(.unavailable)').first();
        if (await availableCard.count() > 0) {
            await availableCard.hover();
            await page.waitForTimeout(300);
            await expect(availableCard).toHaveScreenshot('feature-card-available-hover.png');
        }

        const unavailableCard = page.locator('.feature-card.unavailable').first();
        if (await unavailableCard.count() > 0) {
            await unavailableCard.hover();
            await page.waitForTimeout(300);
            await expect(unavailableCard).toHaveScreenshot('feature-card-unavailable-hover.png');
        }
    });

    test('Navigation: Side/Top Nav Pills', async ({ page, isMobile }) => {
        if (isMobile) {
            // Mobile Menu Hover (Tap state essentially)
            const toggleBtn = page.locator('.nav-toggle');
            await toggleBtn.click();
            await expect(page.locator('.navmenu')).toBeVisible();

            const firstLink = page.locator('#navmenu a').first();
            await firstLink.hover(); // Emulate touch/active
            await expect(page.locator('#navmenu')).toHaveScreenshot('mobile-nav-hover.png');
        } else {
            // Desktop Side Nav
            const navLinks = page.locator('#navmenu a');
            const aboutLink = navLinks.filter({ hasText: 'About' }).first();

            await aboutLink.hover();
            await page.waitForTimeout(500);
            await expect(page.locator('#navmenu')).toHaveScreenshot('desktop-nav-hover-about.png');
        }
    });

    test('Blog: Recent Post Card (Home)', async ({ page }) => {
        const recentPost = page.locator('.recent-post-link').first();
        if (await recentPost.count() > 0) {
            await recentPost.hover();
            await page.waitForTimeout(500);
            // Snapshot the specific list item container
            await expect(recentPost.locator('..')).toHaveScreenshot('home-recent-post-hover.png');
        }
    });

    test('Footer: Socials & Legal', async ({ page }) => {
        const footer = page.locator('#footer');
        await footer.scrollIntoViewIfNeeded();

        // Socials
        const firstSocial = footer.locator('.social-links a').first();
        if (await firstSocial.count() > 0) {
            await firstSocial.hover();
            await page.waitForTimeout(300);
            await expect(footer.locator('.social-links')).toHaveScreenshot('footer-social-hover.png');
        }

        // Legal Link
        const legalLink = footer.locator('.legal-link').first();
        if (await legalLink.count() > 0) {
            await legalLink.hover();
            await page.waitForTimeout(300);
            await expect(footer).toHaveScreenshot('footer-legal-hover.png');
        }
    });

    test('Contact: Inputs & Button', async ({ page }) => {
        await page.locator('#contact').scrollIntoViewIfNeeded();

        // Name Input Focus/Hover
        const nameInput = page.locator('#name-field');
        await nameInput.hover();
        await expect(nameInput).toHaveScreenshot('contact-input-hover.png');
        await nameInput.focus();
        await expect(nameInput).toHaveScreenshot('contact-input-focus.png');

        // Submit Button
        const btn = page.locator('#contact button[type="submit"]');
        await btn.hover();
        await page.waitForTimeout(300);
        await expect(btn).toHaveScreenshot('contact-submit-hover.png');

        // Email Link
        const emailLink = page.locator('.email-wrapper');
        if (await emailLink.count() > 0) {
            await emailLink.hover();
            await page.waitForTimeout(300);
            await expect(emailLink).toHaveScreenshot('contact-email-hover.png');
        }
    });

});

test.describe('Blog Category Card Hovers', () => {
    test('Category Cards variants', async ({ page, isMobile }) => {
        if (isMobile) test.skip();
        await page.goto('/'); // Assuming they are on home or we go to /posts? 
        // Based on analysis, blog categories are on Home usually.

        const categoryCards = page.locator('.category-card-wrapper');

        // We'll try to find different variants if possible, or just hover the first
        if (await categoryCards.count() > 0) {
            const firstCard = categoryCards.first();
            await firstCard.scrollIntoViewIfNeeded();
            await firstCard.hover();
            await page.waitForTimeout(300);
            await expect(firstCard).toHaveScreenshot('blog-category-card-hover.png');
        }

        // Mini Categories
        const miniCards = page.locator('.mini-category-card-wrapper');
        if (await miniCards.count() > 0) {
            const firstMini = miniCards.first();
            await firstMini.scrollIntoViewIfNeeded();
            await firstMini.hover();
            await page.waitForTimeout(300);
            await expect(firstMini).toHaveScreenshot('blog-mini-card-hover.png');
        }
    });
});
