// SPDX-FileCopyrightText: 2026 The freelance-persona_theme Project Contributors
//
// SPDX-License-Identifier: MIT

import rehypeKatex from 'rehype-katex';

// Side-effect import: registers \ce, \pu, etc. on the KaTeX singleton.
// Because this module and rehype-katex live in the same Vite module graph,
// Vite resolves `katex` to the exact same ESM instance for both imports.
// This import MUST be static (not dynamic) to avoid "Vite module runner
// has been closed" errors during Astro's content sync phase.
import 'katex/contrib/mhchem';

/**
 * ============================================================================
 * 🚨 CRUFTY WRAPPER WARNING / ECOSYSTEM DEPRECATION NOTE
 * ============================================================================
 *
 * WHY THIS FILE EXISTS:
 * KaTeX extensions (like `mhchem` for `\ce{...}`) register themselves by
 * mutating the global, in-memory `katex` module singleton via side-effect
 * imports. The import MUST resolve to the exact same `katex` instance that
 * `rehype-katex` uses internally.
 *
 * THE PROBLEM:
 * 1. `rehype-katex` depends on `katex: "^0.16.0"`. Our theme declares
 *    `"katex": "^0.17.0"`. Package managers may install two separate versions,
 *    creating two independent singletons.
 * 2. Astro compiles markdown inside a Vite Module Runner sandbox. Dynamic
 *    `import()` calls fail with "Vite module runner has been closed".
 *    Only static imports work reliably in this context.
 *
 * THE WORKAROUND:
 * This wrapper file statically imports both `rehype-katex` and
 * `katex/contrib/mhchem`. Because they are static imports in the same
 * module, Vite resolves `katex` to a single shared ESM instance, ensuring
 * mhchem's `\ce` macro is registered on the correct object.
 *
 * TO BE DEPRECATED:
 * This wrapper can (and should) be deleted once `rehype-katex` supports
 * dependency injection, i.e., passing a custom `katex` instance in options:
 * `rehypeKatex({ katex })`.
 * ============================================================================
 */

export default function rehypeKatexWrapper(options?: any) {
  // mhchem is already registered on the katex singleton via the static
  // import above. Just delegate directly to rehype-katex.
  return rehypeKatex(options);
}
