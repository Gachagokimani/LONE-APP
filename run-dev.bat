@echo off
REM Loan App - Windows Batch Development Servers Script
REM This script runs both backend and frontend servers concurrently
REM Also works from Windows Command Prompt (cmd.exe)

setlocal enabledelayedexpansion

echo ================================
echo Loan Application - Dev Servers
echo ================================
echo.

echo Starting Backend Server...
cd backend
python manage.py migrate
echo Backend running on: http://localhost:8000
echo API: http://localhost:8000/api/
echo Admin: http://localhost:8000/admin/
echo.

REM Start backend in new window
start "Loan App - Backend" python manage.py runserver 0.0.0.0:8000

REM Wait for backend to start
echo Waiting for backend to start...
timeout /t 3 /nobreak

cd ..
echo.
echo Starting Frontend Server...
cd frontend

REM Start frontend in new window
start "Loan App - Frontend" cmd /k npm run dev

echo.
echo ================================
echo Servers Running
echo ================================
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000/api/
echo Django Admin: http://localhost:8000/admin/
echo.
echo Close the windows above to stop servers
echo.

pause
