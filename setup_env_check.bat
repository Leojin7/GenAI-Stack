@echo off
echo ===== Environment Setup Check =====
echo.
echo Checking Python installation...
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Python is not installed or not in PATH.
    echo Please install Python 3.8 or later from: https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation.
    pause
    exit /b 1
) else (
    python --version
    echo Python is installed correctly.
)

echo.
echo Checking Node.js installation...
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed or not in PATH.
    echo Please install Node.js from: https://nodejs.org/
    echo Choose the LTS version.
    pause
    exit /b 1
) else (
    node --version
    echo Node.js is installed correctly.
)

echo.
echo Checking npm installation...
npm --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo npm is not installed or not in PATH.
    echo This usually comes with Node.js. Please reinstall Node.js.
    pause
    exit /b 1
) else (
    npm --version
    echo npm is installed correctly.
)

echo.
echo Environment check completed successfully!
echo.
echo Next steps:
echo 1. Run 'setup_backend.bat' to set up the Python backend
pause
