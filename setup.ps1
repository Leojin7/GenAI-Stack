# Setup script for GenAI Stack Backend
Write-Host "=== GenAI Stack Backend Setup ===" -ForegroundColor Cyan

# Check Python installation
Write-Host "`nChecking Python installation..." -ForegroundColor Yellow
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Python is not installed or not in PATH. Please install Python 3.7+ and try again." -ForegroundColor Red
    exit 1
}
Write-Host "Found Python version: $pythonVersion" -ForegroundColor Green

# Create virtual environment
$venvPath = ".\.venv"
if (-not (Test-Path $venvPath)) {
    Write-Host "`nCreating virtual environment..." -ForegroundColor Yellow
    python -m venv $venvPath
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to create virtual environment" -ForegroundColor Red
        exit 1
    }
    Write-Host "Virtual environment created" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "`nActivating virtual environment..." -ForegroundColor Yellow
$activateScript = "$venvPath\Scripts\Activate.ps1"
if (-not (Test-Path $activateScript)) {
    Write-Host "Activation script not found at $activateScript" -ForegroundColor Red
    exit 1
}
. $activateScript

# Install dependencies
Write-Host "`nInstalling dependencies..." -ForegroundColor Yellow
$requirements = @(
    "fastapi",
    "uvicorn",
    "sqlalchemy",
    "python-jose[cryptography]",
    "passlib[bcrypt]",
    "python-multipart",
    "python-dotenv"
)

pip install $requirements
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "Dependencies installed successfully" -ForegroundColor Green

# Create required directories
$dbDir = ".\backend\db"
if (-not (Test-Path $dbDir)) {
    New-Item -ItemType Directory -Path $dbDir -Force | Out-Null
    Write-Host "Created database directory at $dbDir" -ForegroundColor Green
}

# Start the server
Write-Host "`nStarting backend server..." -ForegroundColor Yellow
$env:PYTHONPATH = "."
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload

Write-Host "`nBackend server started successfully!" -ForegroundColor Green
Write-Host "API Documentation: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
