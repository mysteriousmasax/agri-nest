@echo off
echo ============================================
echo   AGRI-NEST Development Server
echo   Deep Green + Gold Edition
echo ============================================
echo.
echo Starting server on http://localhost:8090
echo Press Ctrl+C to stop
echo.

cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -Command "$l=New-Object System.Net.HttpListener;$l.Prefixes.Add('http://localhost:8090/');$l.Start();Write-Host 'AGRI-NEST running at http://localhost:8090';while($l.IsListening){try{$c=$l.GetContext();$u=$c.Request.Url.LocalPath;if($u -eq '/'){$u='/index.html'};$f=Join-Path '%~dp0' $u.TrimStart('/');$c.Response.Headers.Add('Cache-Control','no-cache, no-store, must-revalidate');if(Test-Path $f -PathType Leaf){$e=[IO.Path]::GetExtension($f);$m=@{'.html'='text/html';'.css'='text/css';'.js'='application/javascript';'.json'='application/json';'.svg'='image/svg+xml';'.png'='image/png';'.jpg'='image/jpeg'};$ct=if($m[$e]){$m[$e]}else{'application/octet-stream'};$b=[IO.File]::ReadAllBytes($f);$c.Response.ContentType=$ct;$c.Response.ContentLength64=$b.Length;$c.Response.OutputStream.Write($b,0,$b.Length)}else{$c.Response.StatusCode=404};$c.Response.Close()}catch{break}}"

pause
