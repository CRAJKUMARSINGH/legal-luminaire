#!/usr/bin/env bash
# Legal Luminaire — Governance Checks (ADR-009 / ADR-010)
# Run from repo root: bash scripts/check-governance.sh
set -euo pipefail

SRC="artifacts/legal-luminaire/src"
errors=0

echo "=== Legal Luminaire Governance Check ==="
echo ""

echo "1. Checking for hardcoded localhost:8000..."
if grep -R --include='*.ts' --include='*.tsx' 'localhost:8000' "$SRC" \
  | grep -v 'api-client.ts' >/tmp/ll-gov-1.txt 2>/dev/null; then
  if [[ -s /tmp/ll-gov-1.txt ]]; then
    echo "   FAIL: Hardcoded localhost:8000 found:"
    cat /tmp/ll-gov-1.txt
    errors=$((errors + 1))
  else
    echo "   PASS: No hardcoded localhost:8000 found."
  fi
else
  echo "   PASS: No hardcoded localhost:8000 found."
fi

echo ""
echo "2. Checking for raw http:// fetch outside approved API modules..."
allowed='(api-client\.ts|variantsApi\.ts|draft-family\.ts)'
if grep -R --include='*.ts' --include='*.tsx' -n 'fetch[[:space:]]*([[:space:]]*"http' "$SRC" \
  | grep -Ev "$allowed" >/tmp/ll-gov-2.txt 2>/dev/null; then
  if [[ -s /tmp/ll-gov-2.txt ]]; then
    echo "   FAIL: Raw http fetch found outside api-client:"
    cat /tmp/ll-gov-2.txt
    errors=$((errors + 1))
  else
    echo "   PASS: No raw http fetch outside api-client."
  fi
else
  echo "   PASS: No raw http fetch outside api-client."
fi

echo ""
echo "3. Checking for npm install/run in deploy configs..."
fail_npm=0
for f in vercel.json artifacts/legal-luminaire/vercel.json netlify.toml; do
  if [[ -f "$f" ]] && grep -E '(^|[^p])npm (install|run)' "$f" >/dev/null; then
    echo "   FAIL: npm command found in $f"
    fail_npm=1
  fi
done
if [[ "$fail_npm" -eq 1 ]]; then
  errors=$((errors + 1))
else
  echo "   PASS: deploy configs use pnpm."
fi

echo ""
echo "4. Checking for duplicate routes in routes.tsx..."
ROUTES="artifacts/legal-luminaire/src/routes.tsx"
dups=$(grep -oE 'path="[^"]+"' "$ROUTES" | sort | uniq -d || true)
if [[ -n "$dups" ]]; then
  echo "   FAIL: Duplicate route paths found:"
  echo "$dups"
  errors=$((errors + 1))
else
  echo "   PASS: No duplicate routes."
fi

echo ""
echo "5. Checking for orphan page files..."
orphans=""
while IFS= read -r page; do
  base=$(basename "$page" .tsx)
  if ! grep -q "$base" "$ROUTES"; then
    orphans="${orphans}${base}"$'\n'
  fi
done < <(find artifacts/legal-luminaire/src/pages -name '*.tsx' -maxdepth 1)
if [[ -n "$orphans" ]]; then
  echo "   FAIL: Orphan pages (not in routes.tsx):"
  echo "$orphans"
  errors=$((errors + 1))
else
  echo "   PASS: All pages are routed."
fi

echo ""
echo "6. Checking protected files exist..."
protected=(
  "artifacts/legal-luminaire/src/App.tsx"
  "artifacts/legal-luminaire/src/main.tsx"
  "artifacts/legal-luminaire/src/lib/citation-gate.ts"
  "artifacts/legal-luminaire/src/lib/verification-engine.ts"
  "artifacts/legal-luminaire/src/lib/case01-data.ts"
  "artifacts/legal-luminaire/vite.config.ts"
)
missing=0
for f in "${protected[@]}"; do
  if [[ ! -f "$f" ]]; then
    echo "   FAIL: missing $f"
    missing=1
  fi
done
if [[ "$missing" -eq 1 ]]; then
  errors=$((errors + 1))
else
  echo "   PASS: Protected files present."
fi

echo ""
echo "========================================"
if [[ "$errors" -gt 0 ]]; then
  echo "GOVERNANCE CHECK FAILED: $errors issue(s) found."
  exit 1
fi
echo "GOVERNANCE CHECK PASSED: All rules satisfied."
exit 0
