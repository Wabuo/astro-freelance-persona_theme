// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

/**
 * Config Matrix Build Script
 * 
 * Iterates through all config files in testing/configs/, builds with each config,
 * and runs the config matrix tests. Each config gets its own build + test run.
 * 
 * Usage: bun run scripts/test-config-matrix.ts
 * 
 * The script:
 * 1. Finds all config files (testing/configs/config-*.ts)
 * 2. For each config:
 *    - Derives CONFIG_NAME from filename (e.g., config-colors.ts → config-colors)
 *    - Kills any existing server on port 4321
 *    - Sets THEME_CONFIG_PATH to the config file
 *    - Runs build with PLAYWRIGHT_TEST=true
 *    - Starts preview server
 *    - Runs playwright test with playwright.matrix.config.ts
 *    - Kills preview server
 * 3. Reports pass/fail summary
 * 
 * Continues even if one config fails. Exit code reflects overall success.
 */

import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIGS_DIR = path.join(__dirname, '../testing/configs');
const PORT = 4321;

interface TestResult {
  configName: string;
  passed: boolean;
  error?: string;
}

function killPort(port: number): void {
  try {
    execSync(`fuser -k ${port}/tcp 2>/dev/null || true`, { stdio: 'ignore' });
  } catch {
    // Ignore errors
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForServer(url: string, timeoutMs: number = 10000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      execSync(`curl -s -o /dev/null -w "%{http_code}" ${url} | grep -q "200"`, { stdio: 'ignore' });
      return true;
    } catch {
      await sleep(500);
    }
  }
  return false;
}

async function testConfig(configFile: string): Promise<TestResult> {
  const configName = path.basename(configFile, '.ts');
  const configPath = path.resolve(configFile);
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing config: ${configName}`);
  console.log(`${'='.repeat(60)}\n`);

  try {
    // Kill any existing server
    killPort(PORT);

    // Build with this config
    console.log(`Building with ${configName}...`);
    execSync('bun run build', {
      stdio: 'inherit',
      env: {
        ...process.env,
        PLAYWRIGHT_TEST: 'true',
        THEME_CONFIG_PATH: configPath,
      },
    });

    // Start preview server
    console.log(`Starting preview server on port ${PORT}...`);
    const previewProcess = spawn('bun', ['run', 'preview'], {
      stdio: 'ignore',
      detached: true,
      env: {
        ...process.env,
      },
    });
    previewProcess.unref();

    // Wait for server to be ready
    const serverReady = await waitForServer(`http://localhost:${PORT}`);
    if (!serverReady) {
      throw new Error('Preview server did not start in time');
    }

    // Run playwright tests
    console.log(`Running config matrix tests...`);
    execSync('bunx playwright test --config=playwright.matrix.config.ts', {
      stdio: 'inherit',
      env: {
        ...process.env,
        CONFIG_NAME: configName,
      },
    });

    // Kill preview server
    killPort(PORT);

    console.log(`✓ ${configName} passed\n`);
    return { configName, passed: true };
  } catch (error) {
    killPort(PORT);
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`✗ ${configName} failed: ${errorMsg}\n`);
    return { configName, passed: false, error: errorMsg };
  }
}

async function main() {
  console.log('Config Matrix Test Runner\n');

  // Find all config files
  const configFiles = fs.readdirSync(CONFIGS_DIR)
    .filter(f => f.startsWith('config-') && f.endsWith('.ts'))
    .sort()
    .map(f => path.join(CONFIGS_DIR, f));

  if (configFiles.length === 0) {
    console.error('No config files found in testing/configs/');
    process.exit(1);
  }

  console.log(`Found ${configFiles.length} config files:`);
  configFiles.forEach(f => console.log(`  - ${path.basename(f)}`));
  console.log();

  // Test each config
  const results: TestResult[] = [];
  for (const configFile of configFiles) {
    const result = await testConfig(configFile);
    results.push(result);
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60) + '\n');

  const passed = results.filter(r => r.passed);
  const failed = results.filter(r => !r.passed);

  if (passed.length > 0) {
    console.log(`✓ Passed (${passed.length}):`);
    passed.forEach(r => console.log(`  - ${r.configName}`));
  }

  if (failed.length > 0) {
    console.log(`\n✗ Failed (${failed.length}):`);
    failed.forEach(r => console.log(`  - ${r.configName}: ${r.error}`));
  }

  console.log(`\nTotal: ${results.length} configs, ${passed.length} passed, ${failed.length} failed\n`);

  // Exit with error if any failed
  if (failed.length > 0) {
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
