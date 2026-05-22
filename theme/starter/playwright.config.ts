// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './testing/tests',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [['html', { outputFolder: 'testing/playwright-report' }], ['list']],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    outputDir: './testing/test-results', // Artifacts (screenshots/videos)

    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: 'http://localhost:4321',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
    },
    
    /* Global Snapshot Configuration to reduce flakiness */
    expect: {
        toHaveScreenshot: {
            threshold: 0.3,
            maxDiffPixels: 200,
            animations: 'disabled',
        },
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        // Test against mobile viewports.
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
        /* Dark Mode Testing in Firefox */
        {
            name: 'firefox-dark',
            use: { 
                ...devices['Desktop Firefox'],
                colorScheme: 'dark'
            },
        },
        /* NoScript Environment */
        {
            name: 'noscript',
            use: {
                ...devices['Desktop Chrome'],
                javaScriptEnabled: false
            },
        },
        /* WebKit disabled locally due to missing system dependencies (libicu). 
           Playwright bundled WebKit does not use system libraries on Linux. 
           Enable in CI environment. */
        // {
        //    name: 'webkit',
        //    use: { ...devices['Desktop Safari'] },
        // },
    ],

    /* Run your local dev server before starting the tests */
    webServer: {
        command: 'bun run build && bun run preview',
        url: 'http://localhost:4321',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },
});
