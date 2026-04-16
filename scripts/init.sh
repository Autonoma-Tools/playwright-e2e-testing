#!/usr/bin/env bash
# scripts/init.sh
#
# Bootstrap a Playwright project in the current directory.
#
# Requirements:
#   - Node.js 18 or newer
#   - npm
#
# Usage:
#   bash scripts/init.sh
#
# After running this script, follow the installer prompts:
#   1. Pick a language        -> TypeScript
#   2. Pick browsers          -> Chromium, Firefox, WebKit
#   3. Add GitHub Actions     -> yes
#   4. Install Playwright     -> yes
#
# Then run `npx playwright install` to download the browser binaries.

set -euo pipefail

# --- preflight checks -------------------------------------------------------

if ! command -v node >/dev/null 2>&1; then
  echo "error: node is not installed. Install Node.js 18+ from https://nodejs.org" >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "error: npm is not installed (it ships with Node.js)." >&2
  exit 1
fi

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "${NODE_MAJOR}" -lt 18 ]; then
  echo "error: Node.js 18+ is required. Detected v$(node -v)." >&2
  exit 1
fi

# --- init -------------------------------------------------------------------

echo "Initialising Playwright project in $(pwd) ..."
npm init playwright@latest -- --yes || npm init playwright@latest

# --- install browsers -------------------------------------------------------

echo "Downloading Playwright browsers (Chromium, Firefox, WebKit) ..."
npx playwright install

echo
echo "Done. Try: npx playwright test"
