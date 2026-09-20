Param(
  [string]$BaseUrl = 'http://localhost:8080',
  [int]$TimeoutSec = 8
)

function Write-Info($m){ Write-Host "[INFO] $m" -ForegroundColor Cyan }
function Write-Err($m){ Write-Host "[ERROR] $m" -ForegroundColor Red }

$router = Join-Path -Path $PSScriptRoot -ChildPath '..\app\assets\js\router.js'
if (-not (Test-Path $router)) {
  Write-Err "Router file not found: $router"; exit 2
}

$content = Get-Content $router -Raw
$seps = @('"', "'", "`n", "`r", ' ', ',', '(', ')', ';')
$tokens = $content.Split($seps, [System.StringSplitOptions]::RemoveEmptyEntries)
$paths = New-Object System.Collections.Generic.HashSet[string]
$paths.Add('index.html') | Out-Null
foreach ($t in $tokens) {
  if ($t -like '*pages/*.html') { $paths.Add($t) | Out-Null }
}

Write-Info "Checking $($paths.Count) routes on $BaseUrl"

$failed = @()
foreach ($p in $paths) {
  $url = $BaseUrl.TrimEnd('/') + '/' + ($p -replace '^\.\/', '')
  Write-Host -NoNewline "GET $url ... "
  try {
    $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec $TimeoutSec -ErrorAction Stop
    if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 400) {
      Write-Host "OK $($resp.StatusCode)" -ForegroundColor Green
    } else {
      Write-Host "FAIL $($resp.StatusCode)" -ForegroundColor Yellow
      $failed += @{ path = $p; status = $resp.StatusCode }
    }
  } catch {
    Write-Host "ERROR" -ForegroundColor Red
    $failed += @{ path = $p; error = $_.Exception.Message }
  }
}

Write-Info "Summary: Total=$($paths.Count) Failed=$($failed.Count)"
if ($failed.Count -gt 0) {
  Write-Err "Failed routes:"; $failed | ForEach-Object { Write-Err " - $($_.path) $($_.status) $($_.error)" }
  exit 1
}

Write-Info "All routes responded OK."
exit 0
