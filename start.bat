@echo off
echo =========================================
echo    ESPORTS TOURNAMENT MANAGEMENT SYSTEM
echo =========================================
echo.

echo Starting Backend Server (Port 5000)...
start cmd /k "cd backend && npm start"

echo Starting Frontend Dev Server...
start cmd /k "cd frontend && npm run dev"

echo.
echo Both services are starting!
echo The frontend will be available at http://localhost:5173
echo.
pause
