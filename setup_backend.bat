@echo off
echo ===== Backend Setup =====
echo.
echo Creating Python virtual environment...
python -m venv .venv
if %ERRORLEVEL% NEQ 0 (
    echo Failed to create virtual environment.
    pause
    exit /b 1
)

echo.
echo Activating virtual environment and installing dependencies...
call .venv\Scripts\activate && pip install -r backend\requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install dependencies.
    pause
    exit /b 1
)

echo.
echo Backend setup completed successfully!
echo.
echo To start the backend server, run:
echo   .\start_backend.bat
echo.
pause
