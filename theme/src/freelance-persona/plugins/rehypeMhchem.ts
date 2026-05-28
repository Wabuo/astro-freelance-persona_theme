import 'katex/contrib/mhchem';

/**
 * A tiny Rehype plugin that statically imports KaTeX's mhchem extension
 * inside the markdown compilation context. This ensures that mhchem registers
 * on the exact same instance of KaTeX that rehype-katex resolves and uses.
 */
export default function rehypeMhchem() {
  return () => {
    // No-op: the static import at the top registers the macros
  };
}
