Param()

function Write-Info($m){ Write-Host "[INFO] $m" -ForegroundColor Cyan }
function Write-Err($m){ Write-Host "[ERROR] $m" -ForegroundColor Red }

$root = Resolve-Path "$PSScriptRoot/.."
$app = Join-Path $root 'app'
$www = Join-Path $root 'www'

if (-not (Test-Path $app)) {
  Write-Err "Source app folder not found: $app"
  exit 2
}

if (Test-Path $www) {
  Remove-Item -Recurse -Force -Path $www
}

New-Item -ItemType Directory -Path $www | Out-Null

function Copy-Folder($source, $dest) {
  Get-ChildItem -Path $source -Force | ForEach-Object {
    $target = Join-Path $dest $_.Name
    if ($_.PSIsContainer) {
      New-Item -ItemType Directory -Path $target | Out-Null
      Copy-Folder $_.FullName $target
    } else {
      Copy-Item -Path $_.FullName -Destination $target -Force
    }
  }
}

Write-Info "Copying app -> www"
Copy-Folder $app $www
Write-Info "Completed build to www"
exit 0
