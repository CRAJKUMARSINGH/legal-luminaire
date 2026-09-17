# Legal Luminaire -- Governance Checks (ADR-009 / ADR-010)
# Run: powershell -ExecutionPolicy Bypass -File scripts/check-governance.ps1
# Returns exit code 1 if any forbidden pattern is found.

param([string]$Root = $PSScriptRoot + "\..")
Set-Location $Root

$SRC = "artifacts\legal-luminaire\src"
$errors = 0

Write-Host "=== Legal Luminaire Governance Check ===" -ForegroundColor Cyan
Write-Host ""

# -- Rule 1: No hardcoded localhost backend URLs -------------------------------
Write-Host "1. Checking for hardcoded localhost:8000..."
$allowed1 = @("api-client.ts")
$hits1 = Get-ChildItem "$SRC" -Recurse -Include "*.ts","*.tsx" |
          Where-Object { $_.Name -notin $allowed1 } |
          Select-String "localhost:8000"
if ($hits1) {
    Write-Host "   FAIL: Hardcoded localhost:8000 found:" -ForegroundColor Red
    $hits1 | ForEach-Object { Write-Host "     $($_.Filename):$($_.LineNumber) -- $($_.Line.Trim())" -ForegroundColor Red }
    $errors++
} else {
    Write-Host "   PASS: No hardcoded localhost:8000 found." -ForegroundColor Green
}

# -- Rule 2: No raw http fetch outside api-client.ts --------------------------
Write-Host ""
Write-Host "2. Checking for raw http:// fetch outside api-client..."
$allowed2 = @("api-client.ts","variantsApi.ts")
$hits2 = Get-ChildItem "$SRC" -Recurse -Include "*.ts","*.tsx" |
          Where-Object { $_.Name -notin $allowed2 } |
          Select-String 'fetch\("http' |
          Where-Object { $_.Line -notmatch "//.*fetch" }
if ($hits2) {
    Write-Host "   FAIL: Raw http fetch found outside api-client:" -ForegroundColor Red
    $hits2 | ForEach-Object { Write-Host "     $($_.Filename):$($_.LineNumber) -- $($_.Line.Trim())" -ForegroundColor Red }
    $errors++
} else {
    Write-Host "   PASS: No raw http fetch outside api-client." -ForegroundColor Green
}

# -- Rule 3: vercel.json uses pnpm, not npm ------------------------------------
Write-Host ""
Write-Host "3. Checking vercel.json for npm commands..."
$vercelPath = "artifacts\legal-luminaire\vercel.json"
if (Test-Path $vercelPath) {
    $vercel = Get-Content $vercelPath -Raw
    if ($vercel -match '"npm ') {
        Write-Host "   FAIL: npm command found in vercel.json" -ForegroundColor Red
        $errors++
    } else {
        Write-Host "   PASS: vercel.json uses pnpm (or no build command)." -ForegroundColor Green
    }
} else {
    Write-Host "   WARN: vercel.json not found." -ForegroundColor Yellow
}

# -- Rule 4: No duplicate route paths in routes.tsx ---------------------------
Write-Host ""
Write-Host "4. Checking for duplicate routes in routes.tsx..."
$routesContent = Get-Content "artifacts\legal-luminaire\src\routes.tsx" -Raw
$pathMatches = [regex]::Matches($routesContent, 'path="([^"]+)"')
$allPaths = $pathMatches | ForEach-Object { $_.Groups[1].Value }
$dupes = $allPaths | Group-Object | Where-Object { $_.Count -gt 1 }
if ($dupes) {
    Write-Host "   FAIL: Duplicate route paths found:" -ForegroundColor Red
    $dupes | ForEach-Object { Write-Host "     $($_.Name) (x$($_.Count))" -ForegroundColor Red }
    $errors++
} else {
    Write-Host "   PASS: No duplicate routes." -ForegroundColor Green
}

# -- Rule 5: No orphan page files ---------------------------------------------
Write-Host ""
Write-Host "5. Checking for orphan page files not imported in routes.tsx..."
$pageFiles = Get-ChildItem "artifacts\legal-luminaire\src\pages" -Filter "*.tsx" |
             Select-Object -ExpandProperty BaseName
$orphans = $pageFiles | Where-Object { $routesContent -notmatch [regex]::Escape($_) }
if ($orphans) {
    Write-Host "   FAIL: Orphan pages (not in routes.tsx):" -ForegroundColor Red
    $orphans | ForEach-Object { Write-Host "     $_" -ForegroundColor Red }
    $errors++
} else {
    Write-Host "   PASS: All $($pageFiles.Count) pages are routed." -ForegroundColor Green
}

# -- Rule 6: Protected files still present ------------------------------------
Write-Host ""
Write-Host "6. Checking protected files are present..."
$protected = @(
    "artifacts\legal-luminaire\src\App.tsx",
    "artifacts\legal-luminaire\src\main.tsx",
    "artifacts\legal-luminaire\src\lib\citation-gate.ts",
    "artifacts\legal-luminaire\src\lib\verification-engine.ts",
    "artifacts\legal-luminaire\src\lib\case01-data.ts",
    "artifacts\legal-luminaire\vite.config.ts"
)
$missing = $protected | Where-Object { -not (Test-Path $_) }
if ($missing) {
    Write-Host "   FAIL: Protected files missing:" -ForegroundColor Red
    $missing | ForEach-Object { Write-Host "     $_" -ForegroundColor Red }
    $errors++
} else {
    Write-Host "   PASS: All $($protected.Count) protected files present." -ForegroundColor Green
}

# -- Summary ------------------------------------------------------------------
Write-Host ""
Write-Host "========================================"
if ($errors -gt 0) {
    Write-Host "GOVERNANCE CHECK FAILED: $errors issue(s) found." -ForegroundColor Red
    exit 1
} else {
    Write-Host "GOVERNANCE CHECK PASSED: All rules satisfied." -ForegroundColor Green
    exit 0
}
