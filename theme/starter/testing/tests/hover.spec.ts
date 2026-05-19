// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';

// We group these by component to keep it organized.
// Note: We use { fullPage: false } for component snapshots to focus on the element states, 
// unless the hover affects the wider page.

test.describe('Visual Hover States', () => {

    test.beforeEach(async ({ page }, testInfo) => {
        await page.goto('/');
        await page.waitForLoadState('load');
        if (testInfo.project.name !== 'noscript') {
            await page.evaluate(() => document.fonts.ready);
        }
        // Disable transitions and reveal animations for stability
        if (testInfo.project.name !== 'noscript') {
            await page.addStyleTag({
                content: `
                    * { transition: none !important; animation: none !important; }
                    [data-reveal] { opacity: 1 !important; transform: none !important; transition: none !important; }
                `
            });
        }
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
        if (isMobile) test.skip();

        const availableCard = page.locator('.feature-card:not(.unavailable)').first();
        if (await availableCard.count() > 0) {
            const wrapper = availableCard.locator('..'); 
            await wrapper.hover({ force: true });
            await page.waitForTimeout(600); 
            await expect(wrapper).toHaveScreenshot('feature-card-available-hover.png', {
                maxDiffPixelRatio: 0.2,
                threshold: 0.6,
                mask: [page.locator('.mascot-container')]
            });
        }

        const unavailableCard = page.locator('.feature-card.unavailable').first();
        if (await unavailableCard.count() > 0) {
            const wrapper = unavailableCard.locator('..');
            await wrapper.hover({ force: true });
            await page.waitForTimeout(600);
            await expect(wrapper).toHaveScreenshot('feature-card-unavailable-hover.png', {
                maxDiffPixelRatio: 0.2,
                threshold: 0.6,
                mask: [page.locator('.mascot-container')]
            });
        }
    });

    test('Navigation: Side/Top Nav Pills', async ({ page, isMobile }) => {
        if (isMobile) {
            // Mobile Menu Hover (Tap state essentially)
            const toggleBtn = page.locator('.nav-toggle');
            await toggleBtn.click();
            await expect(page.locator('#mobile-nav')).toBeVisible();

            const firstLink = page.locator('#navmenu-mobile a').first();
            await firstLink.hover(); // Emulate touch/active
            await expect(page.locator('#navmenu-mobile')).toHaveScreenshot('mobile-nav-hover.png');
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

    test('Contact: Inputs & Button', async ({ page }, testInfo) => {
        if (testInfo.project.name === 'noscript') test.skip(true, 'Focus/Hover interactions behave differently without JS');
        await page.locator('#contact').scrollIntoViewIfNeeded();

        // Submit Button
        const btn = page.locator('#contact button[type="submit"]');
        await btn.hover();
        await page.waitForTimeout(500); // Increased from 300 to match 0.4s transition
        await expect(btn).toHaveScreenshot('contact-submit-hover.png');

        // Email Link
        const emailLink = page.locator('.email-wrapper');
        if (await emailLink.count() > 0) {
            await emailLink.hover();
            await page.waitForTimeout(500); // Increased from 300
            await expect(emailLink).toHaveScreenshot('contact-email-hover.png');
        }
    });

    test('Theme Menu: Dropdown Hovers', async ({ page, isMobile }) => {
        if (isMobile) {
            // 3. Mobile drawer
            await page.goto('/');
            await page.waitForLoadState('load');
            
            const toggleBtn_nav = page.locator('.nav-toggle');
            await toggleBtn_nav.click();
            
            const mobileNav = page.locator('#mobile-nav');
            await expect(async () => {
                const isOpen = await mobileNav.evaluate(el => el.matches(':popover-open'));
                expect(isOpen).toBe(true);
            }).toPass({ timeout: 5000 });
            await page.waitForTimeout(500);

            // Expand theme menu
            const toggleBtn = page.locator('#navmenu-mobile label.theme-toggle');
            await toggleBtn.click();
            await page.waitForTimeout(500);
            
            await expect(page.locator('#navmenu-mobile .theme-dropdown-menu')).toBeVisible();
            await expect(page.locator('#navmenu-mobile')).toHaveScreenshot('theme-menu-mobile-expanded.png', {
                mask: [page.locator('.typing-lock'), page.locator('.typed-cursor')]
            });
            
            // Hover a theme option
            // Ensure we use the correct label in the dropdown, not the noscript one
            const darkLabel = page.locator('#navmenu-mobile .theme-dropdown-menu label.theme-label-dark');
            await darkLabel.hover();
            await page.waitForTimeout(300);
            await expect(page.locator('#navmenu-mobile')).toHaveScreenshot('theme-menu-mobile-hover.png', {
                mask: [page.locator('.typing-lock'), page.locator('.typed-cursor')]
            });
        } else {
            // 1. Desktop Side-Nav (Homepage)
            await page.waitForLoadState('domcontentloaded');
            // Expand Theme menu via native checkbox logic (clicking the label)
            await page.locator('#navmenu label.theme-toggle').click({ force: true });
            await page.waitForTimeout(500);
            
            await expect(page.locator('#navmenu .theme-dropdown-menu')).toBeVisible();
            await expect(page.locator('#navmenu .theme-toggle-container')).toHaveScreenshot('theme-menu-side-expanded.png', {
                animations: 'disabled',
                scale: 'css'
            });
            
            // Explicitly target label in the dropdown to avoid ambiguity
            await page.locator('#navmenu .theme-dropdown-menu label.theme-label-dark').hover();
            await page.waitForTimeout(300);
            await expect(page.locator('#navmenu .theme-toggle-container')).toHaveScreenshot('theme-menu-side-hover.png', {
                animations: 'disabled',
                scale: 'css'
            });

            // 2. Desktop Top-Nav (Inner page)
            await page.goto('/blogs/design-system');
            await page.waitForLoadState('domcontentloaded');
            
            await page.locator('.desktop-nav label.theme-toggle').click({ force: true });
            await page.waitForTimeout(500);
            
            await expect(page.locator('.desktop-nav .theme-dropdown-menu')).toBeVisible();
            await expect(page.locator('.desktop-nav .theme-toggle-container')).toHaveScreenshot('theme-menu-top-expanded.png', {
                animations: 'disabled',
                scale: 'css'
            });
            
            await page.locator('.desktop-nav .theme-dropdown-menu label.theme-label-dark').hover();
            await page.waitForTimeout(300);
            await expect(page.locator('.desktop-nav .theme-toggle-container')).toHaveScreenshot('theme-menu-top-hover.png', {
                animations: 'disabled',
                scale: 'css'
            });
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
