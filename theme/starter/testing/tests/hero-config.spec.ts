import { test, expect } from '@playwright/test';
import { getHeroContent } from '../utils/content-parser';

test.describe('Hero Configuration', () => {
    // Fetch live configuration from the markdown file
    const heroConfig = getHeroContent();

    test('Desktop Background Anchor matches config', async ({ page }) => {
        // Skip if no anchor is configured
        test.skip(!heroConfig.background_image_anchor, 'No background_image_anchor configured');

        // Enforce desktop viewport (since mobile overrides this)
        await page.setViewportSize({ width: 1280, height: 720 });
        await page.goto('/');

        const heroImage = page.locator('.hero img');

        // Browser normalization makes exact matching tricky (e.g., "bottom right" -> "100% 100%")
        const configuredValue = heroConfig.background_image_anchor || 'right bottom';

        // Get the actual computed value
        const actualValue = await heroImage.evaluate((el) => {
            return window.getComputedStyle(el).objectPosition;
        });

        console.log(`Configured: "${configuredValue}", Computed: "${actualValue}"`);

        // Assert equivalents
        // 1. Exact Match
        if (actualValue === configuredValue) return;

        // 2. Common Mappings
        const equivalents: string[] = [];

        if (configuredValue.includes('right') && configuredValue.includes('bottom')) {
            equivalents.push('100% 100%', 'right bottom', 'bottom right');
        } else if (configuredValue.includes('top') && configuredValue.includes('right')) {
            equivalents.push('100% 0%', 'right top', 'top right');
        } else if (configuredValue.includes('center')) {
            equivalents.push('50% 50%', 'center center');
        }

        const matches = equivalents.some(val => actualValue === val);

        if (!matches) {
            // Fail with clear message showing actual value
            expect(actualValue).toBe(configuredValue);
        }
    });

    test('Mobile Text Alignment matches config', async ({ page }) => {
        // Skip if not configured
        test.skip(!heroConfig.mobile_text_align, 'No mobile_text_align configured');

        // Set viewport to mobile
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto('/');

        const configAlign = heroConfig.mobile_text_align;
        const expectedJustify = configAlign === 'center' ? 'center' :
            configAlign === 'right' ? 'flex-end' : 'flex-start';

        // 1. Check Flex Container Alignment (Typing Wrapper)
        const typingWrapper = page.locator('.hero .typing-wrapper');
        await expect(typingWrapper).toHaveCSS('justify-content', expectedJustify);

        // 2. Check Flex Container Alignment (Social Links)
        const socialLinks = page.locator('.hero .social-links');
        await expect(socialLinks).toHaveCSS('justify-content', expectedJustify);

        // 3. Check Text Alignment (Paragraph)
        // The hero.scss forces: text-align: var(--mobile-text-align, left) !important;
        const heroText = page.locator('.hero p');
        await expect(heroText).toHaveCSS('text-align', configAlign!);
    });
});
