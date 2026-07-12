// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { expect, type Page, type TestInfo } from '@playwright/test';

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export interface ConfigExpectation {
  // CSS custom property values (checked via getComputedStyle on :root)
  // Only verified in light-scheme projects
  cssVars?: Record<string, string>;

  // Dark mode CSS vars (checked only in dark-scheme projects)
  darkCssVars?: Record<string, string>;

  // Font families (checked via getComputedStyle on target elements)
  fonts?: Record<'headings' | 'body' | 'navigation' | 'monospace', string>;

  // Font sizes (checked via getComputedStyle on target elements)
  // Keys are CSS selectors, values are computed pixel values (e.g., "40px")
  fontSizes?: Record<string, string>;

  // Contact form (checked via DOM attributes)
  contactForm?: {
    action?: string;
    provider?: string;
    checkboxCount?: number;
  };

  // Animation config (checked via data-animations attribute on <html>)
  // Requires BaseLayout to emit data-animations="disabled" when scroll_animations.enabled === false
  animationsEnabled?: boolean;

  // Page title (checked via page.title())
  title?: string;
}

export async function verifyConfigApplied(page: Page, expected: ConfigExpectation, testInfo: TestInfo) {
  // Determine project color scheme
  const isDarkProject = testInfo.project.name.includes('dark') || 
                        testInfo.project.use?.colorScheme === 'dark';

  // 1. CSS Custom Properties — computed on :root (light mode only)
  //    CSS-tooling-agnostic: works with Bootstrap, UnoCSS, raw CSS, anything
  //    Only verify light mode vars in light-scheme projects (dark mode overrides them in dark projects)
  if (!isDarkProject) {
    for (const [varName, expectedValue] of Object.entries(expected.cssVars ?? {})) {
      const actual = await page.evaluate((name) =>
        getComputedStyle(document.documentElement).getPropertyValue(name).trim(), varName);
      expect(actual).toBe(expectedValue);
    }
  }

  // 2. Dark mode CSS vars — only verify in dark-scheme projects
  if (expected.darkCssVars && isDarkProject) {
    for (const [varName, expectedValue] of Object.entries(expected.darkCssVars)) {
      const actual = await page.evaluate((name) =>
        getComputedStyle(document.documentElement).getPropertyValue(name).trim(), varName);
      expect(actual).toBe(expectedValue);
    }
  }

  // 3. Font families — computed on target elements
  const fontTargets = {
    headings: 'h1',
    body: 'body',
    navigation: 'nav a',
    monospace: 'code',
  };
  for (const [role, font] of Object.entries(expected.fonts ?? {})) {
    const selector = fontTargets[role];
    const actual = await page.locator(selector).first().evaluate(
      el => getComputedStyle(el).fontFamily);
    expect(actual).toContain(font);
  }

  // 4. Font sizes — computed on target elements
  //    Values must be in computed pixels (e.g., "40px" not "2.5rem")
  for (const [selector, expectedSize] of Object.entries(expected.fontSizes ?? {})) {
    const actual = await page.locator(selector).first().evaluate(
      el => getComputedStyle(el).fontSize);
    expect(actual).toBe(expectedSize);
  }

  // 5. Contact form
  if (expected.contactForm) {
    const form = page.locator('form.contact-form');
    if (expected.contactForm.provider) {
      await expect(form).toHaveAttribute('data-provider', expected.contactForm.provider);
    }
    if (expected.contactForm.action) {
      await expect(form).toHaveAttribute('action', expected.contactForm.action);
    }
    if (expected.contactForm.checkboxCount !== undefined) {
      const count = await form.locator('input[type="checkbox"]').count();
      expect(count).toBe(expected.contactForm.checkboxCount);
    }
  }

  // 6. Animation config — check data-animations attribute on <html>
  //    Requires BaseLayout to emit data-animations="disabled" when scroll_animations.enabled === false
  if (expected.animationsEnabled === false) {
    await expect(page.locator('html')).toHaveAttribute('data-animations', 'disabled');
  }

  // 7. Page title
  if (expected.title) {
    await expect(page).toHaveTitle(new RegExp(escapeRegex(expected.title)));
  }
}
