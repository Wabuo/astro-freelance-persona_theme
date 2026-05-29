// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import rehypeKatex from 'rehype-katex';

/**
 * ============================================================================
 * 🚨 CRUFTY WRAPPER WARNING / ECOSYSTEM DEPRECATION NOTE
 * ============================================================================
 * 
 * WHY THIS FILE EXISTS:
 * JavaScript package manager and singleton state resolution is notoriously fragile.
 * 
 * 1. KaTeX extensions (like `mhchem` via `\ce{...}`) register themselves by mutating
 *    the global, in-memory `katex` module state.
 * 2. `rehype-katex` depends on `katex: "^0.16.0"`. But our theme declares `"katex": "^0.17.0"`.
 * 3. In typical npm/Bun monorepos, this version mismatch causes the package manager
 *    to install TWO separate versions of KaTeX in the node_modules graph.
 * 4. As a result, static imports of `mhchem` in the theme mutate the KaTeX 0.17.0 instance,
 *    but `rehype-katex` executes its compilation using the KaTeX 0.16.x instance.
 *    Because they are separate objects in memory, KaTeX throws "Undefined control sequence: \ce"
 *    errors, rendering chemical formulas as raw unparsed text.
 * 5. Downstream sites (end-users) do not inherit our root monorepo overrides, so the issue
 *    will break their builds immediately out of the box.
 * 
 * THE SANDBOX PROBLEM:
 * Astro compiles markdown content using an isolated Vite Module Runner sandbox in dev mode.
 * Standard configuration-level imports do not propagate to the sandbox. Thus, module mutation
 * must happen *inside* the execution context of the Rehype plugin itself.
 * 
 * THE WORKAROUND:
 * This wrapper intercepts the Rehype pipeline inside the sandbox, dynamically resolves
 * `rehype-katex`'s nested KaTeX installation path using `createRequire`, converts it to
 * an ESM `file://` URL, and dynamically imports `mhchem` directly into it.
 * This guarantees they share the exact same in-memory ESM cache instance under the sandbox.
 * 
 * TO BE DEPRECATED:
 * This wrapper can (and should) be deleted once `rehype-katex` supports dependency injection,
 * i.e., passing a custom `katex` instance in options: `rehypeKatex({ katex })`.
 * ============================================================================
 */

export default function rehypeKatexWrapper(options?: any) {
  const basePlugin = rehypeKatex(options);

  return async function (tree: any, file: any) {
    try {
      const requirePlugin = createRequire(import.meta.url);
      const rehypeKatexPath = requirePlugin.resolve('rehype-katex');
      const requireRehype = createRequire(rehypeKatexPath);
      const nestedKatexMhchemPath = requireRehype.resolve('katex/contrib/mhchem');
      
      // Resolve path to a file URL to support ESM dynamic import under all OSes
      const fileUrl = pathToFileURL(nestedKatexMhchemPath).href;
      await import(/* @vite-ignore */ fileUrl);
    } catch (e: any) {
      file.message(`[rehypeKatexWrapper] Failed to dynamically load mhchem inside sandbox: ${e.message}`);
    }

    // Delegate the actual compilation to the underlying rehype-katex plugin
    return basePlugin(tree, file);
  };
}
