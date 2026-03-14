# Loan App - Windows Development Servers Script
# This script runs both backend and frontend servers concurrently on Windows
# Usage: .\run-dev.ps1

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Loan Application - Dev Servers" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Backend server block
$backendBlock = {
    Write-Host "Starting Backend Server..." -ForegroundColor Green
    Set-Location "backend"
    
    Write-Host "Running migrations..." -ForegroundColor Yellow
    python manage.py migrate
    
    Write-Host "Backend running on: http://localhost:8000" -ForegroundColor Green
    Write-Host "API: http://localhost:8000/api/" -ForegroundColor Green
    Write-Host "Admin: http://localhost:8000/admin/" -ForegroundColor Green
    Write-Host ""
    
    python manage.py runserver 0.0.0.0:8000
}

# Frontend server block
$frontendBlock = {
    Write-Host "Starting Frontend Server..." -ForegroundColor Green
    Start-Sleep -Seconds 3
    
    Set-Location "frontend"
    
    Write-Host "Frontend running on: http://localhost:3000" -ForegroundColor Green
    Write-Host ""
    
    npm run dev
}

# Launch servers in parallel
Write-Host "Launching servers..." -ForegroundColor Cyan
Write-Host ""

try {
    # Start backend in background job
    $backendJob = Start-Job -ScriptBlock $backendBlock -Name "Backend"
    
    # Start frontend in background job
    Start-Sleep -Seconds 5
    $frontendJob = Start-Job -ScriptBlock $frontendBlock -Name "Frontend"
    
    Write-Host "Waiting for servers to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
    
    # Test backend
    Write-Host "Testing Backend API..." -ForegroundColor Yellow
    try {
        $backendTest = Invoke-RestMethod -Uri "http://localhost:8000/api/" -ErrorAction SilentlyContinue
        Write-Host "✓ Backend API is running" -ForegroundColor Green
    } catch {
        Write-Host "⚠ Backend API not ready yet, please wait..." -ForegroundColor Yellow
    }
    
    # Test frontend
    Write-Host "Testing Frontend..." -ForegroundColor Yellow
    try {
        $frontendTest = Invoke-WebRequest -Uri "http://localhost:3000" -ErrorAction SilentlyContinue
        Write-Host "✓ Frontend is running" -ForegroundColor Green
    } catch {
        Write-Host "⚠ Frontend not ready yet, please wait..." -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "Servers Running" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
    Write-Host "Backend API: http://localhost:8000/api/" -ForegroundColor Green
    Write-Host "Django Admin: http://localhost:8000/admin/" -ForegroundColor Green
    Write-Host ""
    Write-Host "Press Ctrl+C to stop servers" -ForegroundColor Yellow
    Write-Host ""
    
    # Wait for jobs
    Wait-Job -Job $backendJob, $frontendJob
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
finally {
    Write-Host "Stopping servers..." -ForegroundColor Yellow
    Get-Job | Stop-Job
    Write-Host "Servers stopped" -ForegroundColor Green
}
