Write-Host "=== Python Environment Setup ==="

$pythonPath = (Get-Command python -ErrorAction SilentlyContinue).Source

if (-not $pythonPath) {
  Write-Host "Python is not installed or not in PATH. Please install Python 3.8 or later from https://www.python.org/downloads/"
  exit 1
}

Write-Host "Python found at: $pythonPath"


$venvPath = ".\.venv"
if (-not (Test-Path $venvPath)) {
  Write-Host "Creating virtual environment..."
  python -m venv $venvPath
}


Write-Host "Activating virtual environment..."
& ".\.venv\Scripts\Activate.ps1"


Write-Host "Upgrading pip..."
python -m pip install --upgrade pip

if (Test-Path "backend\requirements.txt") {
  Write-Host "Installing Python dependencies..."
  pip install -r backend\requirements.txt
}
else {
  Write-Host "requirements.txt not found in backend directory"
}

Write-Host "`nSetup complete! You can now start the FastAPI server with:"
Write-Host "cd backend"
Write-Host "uvicorn main:app --reload --host 0.0.0.0 --port 8000"
