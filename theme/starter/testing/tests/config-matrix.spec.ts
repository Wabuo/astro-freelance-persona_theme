// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';
import { expectations } from '../configs/expectations';
import { verifyConfigApplied } from '../utils/verify-config';

// NOTE: Mobile-specific theme config knobs do NOT exist.
// Mobile drawer width, button sizes, and border widths are hardcoded in base.scss.
// The only mobile-specific color (nav_mobile_background) appears unused.
// Mobile hero positioning settings (mobile_position_y, mobile_text_align, etc.)
// exist in the content schema (hero.md frontmatter), not the theme config.
// These are already tested by hero-config.spec.ts.
// The matrix tests focus on proving theme config → page pipeline.
// If a theme config works on desktop, it works on mobile (same CSS vars, same DOM).

// CONFIG_NAME is set by the matrix build script (scripts/test-config-matrix.ts)
const configName = process.env.CONFIG_NAME;

if (configName && expectations[configName]) {
  const expected = expectations[configName];

  test.describe(`Config Matrix: ${configName}`, () => {
    test('Config settings propagate correctly (programmatic)', async ({ page }, testInfo) => {
      await page.goto('/');
      await page.waitForLoadState('load');
      await verifyConfigApplied(page, expected, testInfo);
    });

    test('Homepage renders with config (visual)', async ({ page }, testInfo) => {
      await page.goto('/');
      await page.waitForLoadState('load');
      if (testInfo.project.name !== 'noscript') {
        await page.evaluate(() => document.fonts.ready).catch(() => {});
        await page.evaluate(async () => {
          const images = Array.from(document.querySelectorAll('img'));
          await Promise.all(images.map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.addEventListener('load', resolve);
              img.addEventListener('error', resolve);
              setTimeout(resolve, 3000);
            });
          }));
        });
        // Stop typing animation to prevent layout shifts
        await page.evaluate(() => {
          document.querySelectorAll('.typed').forEach(el => {
            el.setAttribute('data-typed-items', '');
          });
        });
      }
      await page.waitForTimeout(1000);
      const screenshot = await page.screenshot({
        fullPage: true,
        mask: [
          page.locator('.typing-lock'),
          page.locator('.typed-cursor'),
          page.locator('.mascot-container'),
          page.locator('.hero .typing-wrapper'),
        ],
      });
      expect(screenshot).toMatchSnapshot(`matrix-${configName}-home.png`, {
        maxDiffPixelRatio: 0.15,
      });
    });

    test('Blog post renders with config (visual)', async ({ page }, testInfo) => {
      await page.goto('/posts/lancy-intro');
      await page.waitForLoadState('load');
      if (testInfo.project.name !== 'noscript') {
        await page.evaluate(() => document.fonts.ready).catch(() => {});
        await page.evaluate(async () => {
          const images = Array.from(document.querySelectorAll('img'));
          await Promise.all(images.map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.addEventListener('load', resolve);
              img.addEventListener('error', resolve);
              setTimeout(resolve, 3000);
            });
          }));
        });
      }
      await page.waitForTimeout(500);
      await expect(page).toHaveScreenshot(`matrix-${configName}-blog-post.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.1,
        mask: [
          page.locator('.typing-lock'),
          page.locator('.typed-cursor'),
          page.locator('.mascot-container'),
        ],
      });
    });
  });
} else {
  test.skip('Config matrix not active (set CONFIG_NAME env var)', () => {});
}
