// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { existsSync, readdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { defineConfig, devices } from '@playwright/test';

// Pre-flight check: verify Playwright browsers are installed
const browserCache = join(homedir(), '.cache', 'ms-playwright');
if (!existsSync(browserCache) || readdirSync(browserCache).length === 0) {
  console.error('\n❌ Playwright browsers not installed.');
  console.error('   Run: bunx playwright install\n');
  process.exit(1);
}

/**
 * Config Matrix Playwright Configuration
 * 
 * This config is used by the config matrix build script (scripts/test-config-matrix.ts)
 * to test different theme config variants. The server lifecycle is managed by the script,
 * not by Playwright's webServer config.
 * 
 * Only 2 projects are used:
 * - chromium: catches layout/color issues in light mode
 * - firefox-dark: catches dark mode color propagation
 * 
 * Cross-browser visual differences are handled by the main test suite (playwright.config.ts).
 */
export default defineConfig({
  testDir: './testing/tests',
  testMatch: /config-matrix\.spec\.ts/,
  fullyParallel: false,
  retries: 0,
  reporter: [['html', { outputFolder: 'testing/playwright-report-matrix' }], ['list']],
  outputDir: './testing/test-results-matrix',

  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },

  expect: {
    toHaveScreenshot: {
      threshold: 0.3,
      maxDiffPixels: 200,
      animations: 'disabled',
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox-dark',
      use: { ...devices['Desktop Firefox'], colorScheme: 'dark' },
    },
  ],

  webServer: {
    command: 'echo "Server managed by test-config-matrix.ts"',
    url: 'http://localhost:4321',
    reuseExistingServer: true,
    timeout: 5 * 1000,
  },
});
