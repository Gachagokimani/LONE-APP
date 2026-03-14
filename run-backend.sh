#!/bin/bash
# Loan App - Unix Backend Start Script

echo "================================"
echo "Backend Server - Development"
echo "================================"
echo ""

cd backend

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "Virtual environment not found. Creating..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

echo ""
echo "Starting Django development server..."
echo "Access at: http://localhost:8000"
echo "API endpoint: http://localhost:8000/api/"
echo "Admin panel: http://localhost:8000/admin/"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python manage.py runserver 0.0.0.0:8000
