
Write-Host "Checking Python version..."
$python = "$PSScriptRoot\backend\venv\Scripts\python.exe"
if (-not (Test-Path $python)) {
  Write-Error "Python executable not found at $python"
  exit 1
}

$envFile = "$PSScriptRoot\backend\.env"
if (-not (Test-Path $envFile)) {
  Write-Error ".env file not found at $envFile"
  exit 1
}

Write-Host "Python path: $python"
Write-Host ".env file: $envFile"
Write-Host "Current directory: $PSScriptRoot"

Get-Content $envFile | ForEach-Object {
  $name, $value = $_.split('=', 2)
  if ($name -and $name[0] -ne '#') {
    [System.Environment]::SetEnvironmentVariable($name, $value.Trim('"'''))
    Write-Host "Set $name"
  }
}

Write-Host "`nStarting FastAPI server..."
Set-Location "$PSScriptRoot\backend"
& $python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000