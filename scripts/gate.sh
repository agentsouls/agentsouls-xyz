#!/bin/bash
# gate.sh — strips all route HTML from out/ except index.html
# Firebase's "**" → "/index.html" rewrite then serves the gate for every URL
# Run: npm run build && bash scripts/gate.sh && firebase deploy --only hosting --project agentsouls-xyz

set -euo pipefail
OUT="$(dirname "$0")/../out"

echo "🔒 Applying full gate — stripping route HTML files..."

# Remove all HTML files except the root index.html
find "$OUT" -name "*.html" ! -path "$OUT/index.html" -delete

# Remove all route directories (shop/, items/, sell/, about/, etc.)
# but keep _next/ (assets) and static files
find "$OUT" -mindepth 1 -maxdepth 1 -type d ! -name "_next" -exec rm -rf {} +

echo "✅ Gate applied. Only out/index.html remains — Firebase will serve it for all routes."
echo ""
echo "Files remaining in out/:"
ls "$OUT"
