@echo off
echo ===== Frontend Setup =====
echo.
echo Installing frontend dependencies...
npm install
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install frontend dependencies.
    pause
    exit /b 1
)

echo.
echo Frontend setup completed successfully!
echo.
echo To start the development server, run:
echo   npm run dev
echo.
pause
