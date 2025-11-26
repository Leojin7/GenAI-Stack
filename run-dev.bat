@echo off
set VITE_API_BASE_URL=http://localhost:8000/api
set VITE_GEMINI_API_KEY= 

REM Start the backend server in a new command window
start "Backend Server" cmd /k "cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

REM Start the frontend development server
call npm run dev
