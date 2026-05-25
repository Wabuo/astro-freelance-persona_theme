#!/bin/sh
# Path: .jj-hooks/pre-push.sh

# 1. Check if theme or package.json changes are being pushed
# We list files modified in the commits between the remote tracking bookmark and the current revision (@).
echo "🔍 Checking for theme and package.json changes in this push..."
push_diff=$(jj --no-pager diff -r "remote_bookmarks(remote=origin)..@" --summary 2>/dev/null)

if echo "$push_diff" | grep -E '^(M|A|D|R) (theme/|package\.json)' >/dev/null 2>&1; then
  # Yes, theme or package.json changes were detected.
  # We must ensure that at least one changeset file (.changeset/*.md) is being added or modified in the pushed commits.
  if ! echo "$push_diff" | grep -E '^(M|A) \.changeset/[^/]*\.md$' >/dev/null 2>&1; then
    echo "🛑 HALT: No changeset found for your changes!"
    echo "You are pushing commits that modify the theme or package.json without declaring a version bump."
    echo "Run 'bunx changeset' to generate release notes before pushing."
    exit 1
  fi
  echo "✅ Changeset check passed (changeset found)."
else
  echo "ℹ️ No theme or package.json changes detected in this push. Skipping changeset check."
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
