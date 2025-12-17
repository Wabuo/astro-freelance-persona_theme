#!/usr/bin/env node
// bin/init.mjs
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import readline from 'readline';
import { fileURLToPath } from 'url';

// --- 1. Setup Environment ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, '..'); // Points to astro-persona-theme root
const projectRoot = process.cwd();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log('\n🚀 Initializing (or Repairing) Persona Theme...\n');

// --- 2. Definition of Source Files ---

// A. Core Files: exist in theme root, copied to project root
//    Use this for config files that must sit in the base directory.
const coreFiles = [
  'astro.config.mjs'
];

// B. Starter Directory: folder in theme containing the template structure
//    Everything inside this folder is copied 1:1 to the user's project root.
const starterSrcDir = path.join(packageRoot, 'starter');


// --- 3. Helper Functions ---

/**
 * Copies a single file with an overwrite prompt.
 * @param {string} sourcePath - Absolute path to source file
 * @param {string} destPath - Absolute path to destination
 * @param {string} displayName - Name to show in logs
 * @param {boolean} isSystemFile - If true, warns differently about overwrites
 */
async function safeCopy(sourcePath, destPath, displayName, isSystemFile = false) {
  if (!fs.existsSync(sourcePath)) {
    console.warn(`   ⚠️  Source file not found: ${displayName}`);
    return;
  }

  // Create directory if it doesn't exist
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  if (fs.existsSync(destPath)) {
    // If the files are identical (size check), skip without prompting to reduce noise
    const srcStat = fs.statSync(sourcePath);
    const destStat = fs.statSync(destPath);
    if (srcStat.size === destStat.size) {
        // A simple size check is usually enough to assume it's the same default file
        // You could add a content hash check here if you want to be 100% sure
        console.log(`      ⏭️  Skipped (Identical): ${displayName}`);
        return;
    }

    console.log(`\n   ⚠️  Found existing ${displayName}`);
    if (isSystemFile) {
      console.log(`      (System file: Resetting might fix configuration issues)`);
    } else {
      console.log(`      (Content file: Overwriting will delete your custom work)`);
    }

    const answer = await ask(`      ❓ Overwrite ${displayName}? (y/N) `);
    if (!answer.toLowerCase().startsWith('y')) {
      console.log(`      ⏭️  Skipped: ${displayName}`);
      return;
    }
  }

  fs.copyFileSync(sourcePath, destPath);
  console.log(`   ✅ Created/Updated: ${displayName}`);
}

/**
 * Recursively walks a directory and returns a list of files relative to the base.
 */
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles;
}


// --- 4. Main Execution Logic ---

async function processFiles() {

  // --- Step A: Copy Core System Files ---
  console.log('📂 Checking System Configuration...');
  for (const file of coreFiles) {
    await safeCopy(
      path.join(packageRoot, file), 
      path.join(projectRoot, file), 
      file,                         
      true                          
    );
  }

  // --- Step B: Copy Starter Content ---
  console.log('\n📝 Checking Starter Content & Assets...');
  if (fs.existsSync(starterSrcDir)) {
    const starterFiles = getAllFiles(starterSrcDir);
    
    for (const fullSourcePath of starterFiles) {
      const relPath = path.relative(starterSrcDir, fullSourcePath);
      
      // SKIP: Don't copy the config files via the generic loop.
      // We handle them explicitly in Step C to ensure they go to the right place.
      if (relPath === 'src/config.ts') continue;
      if (relPath === 'src/content/config.ts') continue;
      if (relPath === 'src/content.config.ts') continue;

      const fullDestPath = path.join(projectRoot, relPath);
      await safeCopy(fullSourcePath, fullDestPath, relPath, false);
    }
  }

  // --- Step C: Inject Configurations ---
  console.log('\n⚙️  Injecting Configuration...');
  
  // 1. Master Config (The User Settings)
  await safeCopy(
    path.join(packageRoot, 'starter/src/config.ts'), 
    path.join(projectRoot, 'src/config.ts'), 
    'src/config.ts',
    false 
  );

  // 2. Content Collections Config (The Schema - Required by Astro to be in src/)
  // We check for the new Astro v5 naming convention
  const contentConfigSource = fs.existsSync(path.join(packageRoot, 'starter/src/content.config.ts'))
    ? path.join(packageRoot, 'starter/src/content.config.ts')
    : path.join(packageRoot, 'starter/src/content/config.ts'); // Fallback for older structure

  await safeCopy(
    contentConfigSource, 
    path.join(projectRoot, 'src/content.config.ts'), // Destination is always root src/content.config.ts for Astro 5
    'src/content.config.ts',
    true // Treat as system file (users shouldn't delete this)
  );

  // --- Step C: Dependencies ---
  console.log('\n📦 Checking dependencies...');
  try {
    const pkgPath = path.join(projectRoot, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
      
      // 1. Check for Sass (Dev Dependency)
      if (!allDeps.sass) {
        console.log('   Installing Sass...');
        execSync('yarn add -D sass', { stdio: 'inherit' });
      } else {
        console.log('   ✅ Sass is already installed.');
      }

      // 2. Check for Sharp (Image Optimization Engine)
      if (!allDeps.sharp) {
        console.log('   Installing Sharp (Required for Image Optimization)...');
        // Sharp is best installed as a regular dependency to ensure it exists in prod builds
        execSync('yarn add sharp', { stdio: 'inherit' });
      } else {
        console.log('   ✅ Sharp is already installed.');
      }

    }
  } catch (e) {
    console.warn('   Failed to check/install dependencies:', e.message);
  }

  console.log('\n🎉 Setup complete! Run "yarn dev" to start.\n');
  rl.close();
}

// Run
processFiles();