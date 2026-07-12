// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

// src/freelance-persona/plugins/virtualConfig.ts
import path from 'path';
import fs from 'fs';

export interface FreelancePersonaVirtualConfig {
  mathPackages: string[];
  codeBlocksConfig: {
    frames?: {
      enabled?: boolean;
      showCopyButton?: boolean;
      defaultFrame?: 'auto' | 'code' | 'terminal' | 'none';
    };
    lineNumbers?: boolean;
  };
}

function parseConfig(configText: string): FreelancePersonaVirtualConfig {
  const result: FreelancePersonaVirtualConfig = {
    mathPackages: ['mhchem', 'physics', 'color', 'cancel', 'mathtools'],
    codeBlocksConfig: {}
  };

  try {
    // Parse mathPackages
    const packagesMatch = configText.match(/packages\s*:\s*\[([^\]]*)\]/);
    if (packagesMatch) {
      const packagesListStr = packagesMatch[1];
      const pkgRegex = /['"`]([^'"`]+)['"`]/g;
      const extracted: string[] = [];
      let match;
      while ((match = pkgRegex.exec(packagesListStr)) !== null) {
        extracted.push(match[1]);
      }
      if (extracted.length > 0) {
        result.mathPackages = extracted;
      }
    }

    // Parse codeBlocks config
    const codeBlocksMatch = configText.match(/codeBlocks\s*:\s*\{([\s\S]*?)\n\s*\}/);
    if (codeBlocksMatch) {
      const codeBlocksStr = codeBlocksMatch[1];
      const framesMatch = codeBlocksStr.match(/frames\s*:\s*\{([\s\S]*?)\}/);
      if (framesMatch) {
        const framesStr = framesMatch[1];
        result.codeBlocksConfig.frames = {};
        const enabledMatch = framesStr.match(/enabled\s*:\s*(true|false)/);
        if (enabledMatch) result.codeBlocksConfig.frames.enabled = enabledMatch[1] === 'true';
        const copyBtnMatch = framesStr.match(/showCopyButton\s*:\s*(true|false)/);
        if (copyBtnMatch) result.codeBlocksConfig.frames.showCopyButton = copyBtnMatch[1] === 'true';
        const frameMatch = framesStr.match(/defaultFrame\s*:\s*['"`](auto|code|terminal|none)['"`]/);
        if (frameMatch) result.codeBlocksConfig.frames.defaultFrame = frameMatch[1] as 'auto' | 'code' | 'terminal' | 'none';
      }
      const lineNumbersMatch = codeBlocksStr.match(/lineNumbers\s*:\s*(true|false)/);
      if (lineNumbersMatch) result.codeBlocksConfig.lineNumbers = lineNumbersMatch[1] === 'true';
    }
  } catch (e) {
    console.warn(`[FreelancePersona] Failed to parse config, using defaults.`, e);
  }

  return result;
}

export function virtualConfigPlugin() {
  let projectRoot = '';
  let virtualConfig: FreelancePersonaVirtualConfig = {
    mathPackages: ['mhchem', 'physics', 'color', 'cancel', 'mathtools'],
    codeBlocksConfig: {}
  };

  const virtualModuleId = 'virtual:freelance-persona-config';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  function getConfigPath(): string {
    if (process.env.THEME_CONFIG_PATH) {
      return path.resolve(process.env.THEME_CONFIG_PATH);
    }
    return path.join(projectRoot, 'src', 'freelance-persona.config.ts');
  }

  return {
    name: 'freelance-persona:virtual-config',
    configResolved(config) {
      projectRoot = config.root;
      const configPath = getConfigPath();
      let configContent = '';
      try {
        configContent = fs.readFileSync(configPath, 'utf-8');
      } catch {
        configContent = '';
      }
      if (configContent) {
        virtualConfig = parseConfig(configContent);
      }
    },
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        // Return the full config file content with TypeScript imports and type annotations stripped
        // This allows Vite to properly process the module
        const configPath = getConfigPath();
        let configContent = '';
        try {
          configContent = fs.readFileSync(configPath, 'utf-8');
        } catch {
          configContent = 'export const themeConfig = {}; export default themeConfig;';
        }
        // Strip TypeScript-only imports (import type ...)
        configContent = configContent.replace(/^import\s+type\s+.*?;\s*$/gm, '');
        // Also strip any bare `import type` lines
        configContent = configContent.replace(/^import\s+type\s+.*?from\s+.*?;\s*$/gm, '');
        // Strip type annotations from const declarations (e.g., ": PersonaConfig")
        configContent = configContent.replace(/:\s*PersonaConfig/g, '');
        
        return configContent;
      }
    }
  };
}