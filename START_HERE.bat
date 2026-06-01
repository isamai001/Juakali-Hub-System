@echo off
REM JuaKaliHub - Complete Startup Instructions for Windows

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║     JuaKaliHub - Windows Setup Guide                  ║
echo ║     Follow these steps to get started                 ║
echo ╚════════════════════════════════════════════════════════╝
echo.

echo [Step 1] Verify Prerequisites
echo ================================
echo Checking for required software...
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    echo Please install from https://nodejs.org/
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%A in ('node --version') do echo ✓ %%A
)

REM Check MySQL
where mysql >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: MySQL not found!
    echo Please install MySQL from https://dev.mysql.com/
    pause
    exit /b 1
) else (
    echo ✓ MySQL installed
)

echo.
echo [Step 2] Setup MySQL Database
echo ================================
echo.
echo Open MySQL and run database/schema.sql:
echo.
echo   1. Open Command Prompt or PowerShell
echo   2. Run: mysql -u root -p
echo   3. Paste contents of database\schema.sql
echo   4. Verify: USE juakalihub_db; SHOW TABLES;
echo.
echo Press any key once database is setup...
pause >nul

echo.
echo [Step 3] Install Backend Dependencies
echo ================================
echo.
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✓ Backend dependencies installed
cd ..

echo.
echo [Step 4] Backend Environment Configuration
echo ================================
echo.
echo Update backend\.env with your database credentials:
echo.
echo   DB_HOST=localhost
echo   DB_USER=root
echo   DB_PASSWORD=your_password
echo   DB_NAME=juakalihub_db
echo   JWT_SECRET=your_secret_key
echo   PORT=3000
echo.
pause

echo.
echo [Step 5] Start the Services
echo ================================
echo.
echo You need to open THREE command windows:
echo.
echo WINDOW 1 - Start Backend Server:
echo   cd backend
echo   npm run dev
echo.
echo WINDOW 2 - Start Frontend Server:
echo   cd frontend
echo   python -m http.server 8000
echo.
echo WINDOW 3 - (Optional) MySQL Monitor:
echo   mysql -u root -p
echo.

echo.
echo [Step 6] Access Application
echo ================================
echo.
echo Once servers are running, open browser:
echo   Frontend: http://localhost:8000
echo   Backend:  http://localhost:3000/
echo.
echo API Documentation:
echo   POST   /api/v1/auth/register
echo   POST   /api/v1/auth/login
echo   GET    /api/v1/workers
echo   GET    /api/v1/jobs
echo.

echo.
echo ═══════════════════════════════════════════════════════
echo Setup Complete! Follow the instructions above.
echo ═══════════════════════════════════════════════════════
echo.
pause
