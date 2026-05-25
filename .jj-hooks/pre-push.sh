#!/bin/sh
# Path: .jj-hooks/pre-push.sh

# 1. Check if we are on the main bookmark
# We evaluate if the working copy revision (@) is exactly the 'main' bookmark.
if [ -n "$(jj --no-pager log -r "@ & main" --no-graph)" ]; then
  echo "ℹ️ On main bookmark. Skipping changeset check."
else
  # 2. Check for changeset files
  changeset_count=$(find .changeset -maxdepth 1 -name "*.md" ! -name "README.md" | grep -c "")
  if [ "$changeset_count" -eq 0 ]; then
    echo "🛑 HALT: No changeset found!"
    echo "You are pushing commits without declaring a version bump."
    echo "Run 'bunx changeset' to generate release notes before pushing."
    exit 1
  fi
  echo "✅ Changeset check passed."
fi

# 3. Check for secrets using Betterleaks
if ! command -v betterleaks >/dev/null 2>&1; then
  echo "🛑 HALT: 'betterleaks' command not found in your PATH!"
  echo "Secrets scan is mandatory before pushing code. Please install Betterleaks (https://github.com/betterleaks/betterleaks) or add it to your PATH."
  exit 1
else
  echo "🔍 Running Betterleaks scanner..."
  # Scan the current workspace
  if ! betterleaks detect -v; then
    echo "🛑 HALT: Secrets detected by Betterleaks!"
    exit 1
  fi
  echo "✅ No secrets detected."
fi

# 4. Proceed with native jj git push
echo "🚀 Pre-push checks passed. Forwarding to jj git push..."
jj git push "$@"
