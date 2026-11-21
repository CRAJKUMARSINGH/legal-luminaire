# Legal Luminaire - 1-hour validation autopilot
# Repeats validation until DurationSeconds elapses (default 3600 = 1 hour).
#
# Default "green" suite (expected to pass): shared libs tsc, legal-luminaire, scripts, then Vite build.
# With -AllChecks also runs the full recursive workspace typecheck.
#
# NOTE: artifacts/mockup-sandbox and artifacts/api-server were retired per ADR-009
# and archived under archive/retired-packages/, so they are no longer built here.
#
# Usage:
#   pwsh -File scripts/autopilot-one-hour.ps1
#   pwsh -File scripts/autopilot-one-hour.ps1 -Fast -AllChecks
#   pwsh -File scripts/autopilot-one-hour.ps1 -DurationSeconds 1800 -SleepBetweenSeconds 60
# Logs: scripts/autopilot-one-hour.log

param(
    [int] $DurationSeconds = 3600,
    [int] $SleepBetweenSeconds = 120,
    [string] $LogFile = "",
    [switch] $AllChecks,
    # Shorter loop gap (20s) when you did not override -SleepBetweenSeconds
    [switch] $Fast
)

if ($Fast -and -not $PSBoundParameters.ContainsKey("SleepBetweenSeconds")) {
    $SleepBetweenSeconds = 20
}

$ErrorActionPreference = "Continue"
$env:CI = "true"

$root = Split-Path -Parent $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }
Set-Location $root

if (-not $LogFile) {
    $LogFile = Join-Path $PSScriptRoot "autopilot-one-hour.log"
}

function Write-Log([string] $msg) {
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $msg
    Write-Host $line
    Add-Content -Path $LogFile -Value $line -Encoding utf8
}

function Invoke-PnpmStep([string] $label, [scriptblock] $block) {
    Write-Log "RUN: $label"
    try {
        & $block 2>&1 | ForEach-Object { Write-Log $_ }
        if ($LASTEXITCODE -ne 0) {
            Write-Log "FAIL: $label exit=$LASTEXITCODE"
        } else {
            Write-Log "OK: $label"
        }
    } catch {
        Write-Log "FAIL: $label - $($_.Exception.Message)"
    }
}

$start = Get-Date
$deadline = $start.AddSeconds($DurationSeconds)
$iteration = 0

Write-Log "=== AUTOPILOT START duration=${DurationSeconds}s sleep=${SleepBetweenSeconds}s AllChecks=$($AllChecks.IsPresent) root=$root ==="

if (-not (Test-Path (Join-Path $root "node_modules\typescript"))) {
    Invoke-PnpmStep "pnpm install (deps missing)" { pnpm install }
}

while ((Get-Date) -lt $deadline) {
    $iteration++
    $elapsed = [math]::Round(((Get-Date) - $start).TotalSeconds, 0)
    Write-Log "--- iteration $iteration (elapsed ${elapsed}s) ---"

    # Green path: libraries + main SPA + tooling packages
    Invoke-PnpmStep "pnpm run typecheck:libs" { pnpm run typecheck:libs }
    Invoke-PnpmStep 'pnpm --filter "@workspace/legal-luminaire" run typecheck' { pnpm --filter "@workspace/legal-luminaire" run typecheck }
    Invoke-PnpmStep 'pnpm --filter "@workspace/scripts" run typecheck' { pnpm --filter "@workspace/scripts" run typecheck }
    Invoke-PnpmStep 'pnpm --filter "@workspace/legal-luminaire" run build' { pnpm --filter "@workspace/legal-luminaire" run build }

    if ($AllChecks) {
        Invoke-PnpmStep "pnpm run typecheck (full workspace)" { pnpm run typecheck }
    }

    $remaining = ($deadline - (Get-Date)).TotalSeconds
    if ($remaining -le 0) { break }
    $sleep = [math]::Min($SleepBetweenSeconds, [math]::Max(0, [int]$remaining))
    if ($sleep -gt 0) {
        Write-Log "SLEEP ${sleep}s (remaining ~$([math]::Round($remaining / 60, 1)) min)"
        Start-Sleep -Seconds $sleep
    }
}

Write-Log "=== AUTOPILOT END iterations=$iteration log=$LogFile ==="
