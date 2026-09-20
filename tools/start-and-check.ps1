Param(
  [int]$Port = 8080,
  [switch]$NoInstall
)

function Write-Info($m){ Write-Host "[INFO] $m" -ForegroundColor Cyan }
function Write-Err($m){ Write-Host "[ERROR] $m" -ForegroundColor Red }

Write-Info "Starting AGRI-NEST server and health-check wrapper (port $Port)"

# Verify npm; if missing fall back to python http.server
if (Get-Command npm -ErrorAction SilentlyContinue) {
  if (-not $NoInstall) {
    Write-Info "Running 'npm install' to ensure dependencies are present"
    $rc = & npm install
    if ($LASTEXITCODE -ne 0) { Write-Err "'npm install' failed. Check output above."; exit $LASTEXITCODE }
  }

  # Start server using npx http-server
  Write-Info "Starting local static server (npx http-server app -p $Port)"
  try {
    $serverProc = Start-Process -FilePath "npx" -ArgumentList "http-server","app","-p",$Port,"-c-1" -NoNewWindow -PassThru
  } catch {
    Write-Err "Failed to start server with Start-Process. Falling back to start-job. Error: $_"
    $job = Start-Job -ScriptBlock { param($p) npx http-server app -p $p -c-1 } -ArgumentList $Port
    Start-Sleep -Seconds 2
    $serverProc = Get-Job -Id $job.Id
  }

  Start-Sleep -Seconds 2

  Write-Info "Running route health-check against http://localhost:$Port"
  try {
    # Use npm script which runs node tools/health-check.js
    & npm run check:routes --silent
    $checkCode = $LASTEXITCODE
  } catch {
    Write-Err "Health-check execution failed: $_"; $checkCode = 1
  }

  Write-Info "Stopping server"
  try {
    if ($serverProc -and $serverProc.Id) { Stop-Process -Id $serverProc.Id -Force -ErrorAction SilentlyContinue }
    elseif ($job) { Stop-Job -Job $job -Force -ErrorAction SilentlyContinue; Remove-Job -Job $job -Force -ErrorAction SilentlyContinue }
  } catch { Write-Err "Failed to stop server cleanly: $_" }

  if ($checkCode -ne 0) { Write-Err "Health-check reported failures (exit code $checkCode)"; exit $checkCode }

  Write-Info "Success - all routes responded OK."
  exit 0
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
  Write-Info "npm not found; falling back to Python http.server"
  Write-Info "Starting Python server: python -m http.server $Port --directory app"
  $pyProc = Start-Process -FilePath "python" -ArgumentList "-m","http.server",$Port,"--directory","app" -NoNewWindow -PassThru
  Start-Sleep -Seconds 2

  Write-Info "Running PowerShell route health-check against http://localhost:$Port"
  try {
    & powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\health-check-ps.ps1 -BaseUrl "http://localhost:$Port"
    $checkCode = $LASTEXITCODE
  } catch {
    Write-Err "Health-check execution failed: $_"; $checkCode = 1
  }

  Write-Info "Stopping Python server"
  try { if ($pyProc -and $pyProc.Id) { Stop-Process -Id $pyProc.Id -Force -ErrorAction SilentlyContinue } } catch { Write-Err "Failed to stop Python server: $_" }

  if ($checkCode -ne 0) { Write-Err "Health-check reported failures (exit code $checkCode)"; exit $checkCode }

  Write-Info "Success - all routes responded OK."
  exit 0
} else {
  Write-Err "Neither npm nor python are available on PATH. Install Node.js or Python and rerun."
  exit 2
}
