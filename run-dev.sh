#!/bin/bash
# Loan App - Unix Development Servers Script
# This script runs both backend and frontend servers concurrently
# Works on macOS, Linux, and WSL (Windows Subsystem for Linux)

set -e

echo "================================"
echo "Loan Application - Dev Servers"
echo "================================"
echo ""

# Trap to kill background processes on exit
trap 'kill $(jobs -p) 2>/dev/null; echo "Servers stopped"; exit' EXIT INT TERM

# Function to start backend
start_backend() {
    echo "Starting Backend Server..."
    cd "$(dirname "$0")/backend"
    
    # Activate virtual environment if it exists
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
    fi
    
    echo "Running migrations..."
    python manage.py migrate
    
    echo "Backend running on: http://localhost:8000"
    echo "API: http://localhost:8000/api/"
    echo "Admin: http://localhost:8000/admin/"
    echo ""
    
    python manage.py runserver 0.0.0.0:8000
}

# Function to start frontend
start_frontend() {
    echo "Starting Frontend Server..."
    cd "$(dirname "$0")/frontend"
    
    # Wait for backend to start
    sleep 3
    
    echo "Frontend running on: http://localhost:3000"
    echo ""
    
    npm run dev
}

# Function to test servers
test_servers() {
    sleep 2
    echo ""
    echo "Testing Backend API..."
    if curl -s http://localhost:8000/api/ > /dev/null 2>&1; then
        echo "✓ Backend API is running"
    else
        echo "⚠ Backend API not ready yet"
    fi
    
    echo "Testing Frontend..."
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✓ Frontend is running"
    else
        echo "⚠ Frontend not ready yet"
    fi
    echo ""
}

# Run servers in parallel
echo "Launching servers..."
echo ""

# Start backend in background
start_backend &
BACKEND_PID=$!

# Start frontend in background
start_frontend &
FRONTEND_PID=$!

# Test servers
test_servers

echo "================================"
echo "Servers Running"
echo "================================"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000/api/"
echo "Django Admin: http://localhost:8000/admin/"
echo ""
echo "Press Ctrl+C to stop servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
echo "================================"
echo "Servers Running"
echo "================================"
echo ""
echo "Access the application:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:8000/api/"
echo "  Django Admin: http://localhost:8000/admin/"
echo ""
echo "PIDs: Backend=$BACKEND_PID, Frontend=$FRONTEND_PID"
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
