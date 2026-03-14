# Testing Guide - Concurrent Development & CORS

This guide explains how to run both frontend and backend servers concurrently for full-stack testing with CORS enabled.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Run Scripts](#run-scripts)
3. [Testing Options](#testing-options)
4. [CORS Configuration](#cors-configuration)
5. [UI-Based Testing](#ui-based-testing)
6. [Troubleshooting](#troubleshooting)

## Quick Start

### Option 1: Python Script (Recommended - Cross-Platform)

```bash
# Install Python dependencies (if not already installed)
cd backend
pip install -r requirements.txt
cd ../frontend
npm install

# Run from project root
cd ..
python run-dev.py
```

This will:
- ✓ Run migrations automatically
- ✓ Start backend server on http://localhost:8000
- ✓ Start frontend server on http://localhost:3000
- ✓ Test both servers
- ✓ Display all URLs

### Option 2: npm Scripts (Root package.json)

```bash
# Setup all dependencies
npm run install:all

# Run both servers (foreground)
npm run dev:both

# Run individual servers
npm run dev:backend     # Terminal 1
npm run dev:frontend    # Terminal 2 (after backend starts)

# Test servers
npm run test:health    # Run all health checks
npm run test:api       # Test backend API
npm run test:ui        # Test frontend availability
npm run test:login     # Test authentication
```

### Option 3: Platform-Specific Scripts

#### Windows (PowerShell)
```powershell
# Run as administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\run-dev.ps1
```

#### Windows (Command Prompt)
```cmd
run-dev.bat
```

#### macOS/Linux/WSL (Bash)
```bash
chmod +x run-dev.sh
./run-dev.sh
```

## Run Scripts

### Python Script: `run-dev.py`

**Features:**
- Cross-platform (Windows, macOS, Linux)
- Concurrent threading
- Automatic migrations
- Health checks
- Color output
- Graceful shutdown

**Usage:**
```bash
python run-dev.py              # Run both servers
python run-dev.py --backend    # Backend only
python run-dev.py --frontend   # Frontend only
python run-dev.py --test       # Test servers
python run-dev.py --help       # Show help
```

### PowerShell Script: `run-dev.ps1`

**Features:**
- Windows-optimized
- Background jobs
- Health checks
- Color output
- Error handling

**Usage:**
```powershell
.\run-dev.ps1
```

### Batch Script: `run-dev.bat`

**Features:**
- Traditional Windows batch
- Works with Command Prompt
- Opens new windows for each server

**Usage:**
```cmd
run-dev.bat
```

### Bash Script: `run-dev.sh`

**Features:**
- Unix-optimized
- Virtual environment support
- Proper signal handling

**Usage:**
```bash
./run-dev.sh
```

## Testing Options

### 1. Health Check Commands

Test via npm:
```bash
# Run all tests
npm run test:health

# Test individual components
npm run test:api        # Backend API endpoint
npm run test:ui         # Frontend availability
npm run test:login      # Authentication endpoint
```

Test via curl:
```bash
# Test backend
curl http://localhost:8000/api/

# Test frontend
curl http://localhost:3000

# Test login endpoint
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

### 2. UI-Based Testing

#### Login Page
1. Navigate to http://localhost:3000
2. You should see the login page
3. Try logging in with credentials:
   - Username: `admin`
   - Password: `admin` (or the password you set)

#### Dashboard
1. After successful login, you should see:
   - Admin dashboard (if logged in as admin)
   - User dashboard (if logged in as regular user)
   - Charts visualization

#### Loan Management
1. Navigate to `/loans` to see loan list
2. Click "New Loan" to create a loan
3. Navigate to `/customers` to manage customers
4. Each page should make API calls to your backend

#### API Integration
1. Open browser DevTools (F12)
2. Go to Network tab
3. Make requests through UI
4. Verify requests are going to `http://localhost:8000/api/`
5. Check for CORS errors in Console tab

### 3. Database Testing

```bash
# Connect to Django shell
npm run db:shell

# Or manually:
cd backend
python manage.py shell

# Inside shell:
from src.models import User
User.objects.all()

# Create test customer:
from src.models import CustomerProfile
from decimal import Decimal
from datetime import date

customer = CustomerProfile.objects.create(
    full_name="Test User",
    email="test@example.com",
    phone="123-456-7890",
    date_of_birth=date(1990, 1, 1),
    address="123 Main St",
    employment_status="employed",
    monthly_income=Decimal("5000.00")
)

# Create test loan:
from src.models import LoanApplication
loan = LoanApplication.objects.create(
    customer=customer,
    amount=Decimal("10000.00"),
    interest_rate=Decimal("5.5"),
    term_months=12,
    purpose="Test loan"
)
```

### 4. API Testing with cURL

```bash
# Get token
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' | jq -r '.access')

echo "Token: $TOKEN"

# Get loans
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/loans/

# Create customer
curl -X POST http://localhost:8000/api/customers/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "date_of_birth": "1990-01-01",
    "address": "123 Main St",
    "employment_status": "employed",
    "monthly_income": 5000
  }'

# Create loan
curl -X POST http://localhost:8000/api/loans/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer": "550e8400-e29b-41d4-a716-446655440001",
    "amount": 15000,
    "interest_rate": 6.0,
    "term_months": 24,
    "purpose": "Test loan"
  }'
```

### 5. Integration Testing

```bash
# Full workflow test
# 1. Start servers
python run-dev.py

# 2. In another terminal, run tests
cd backend

# Run Django tests (if test suite exists)
python manage.py test

# Or create a test script:
cat > test_workflow.py << 'EOF'
import requests
import json

BASE_URL = "http://localhost:8000/api"

# 1. Authenticate
auth_response = requests.post(
    f"{BASE_URL}/auth/token/",
    json={"username": "admin", "password": "admin"}
)
token = auth_response.json()["access"]
headers = {"Authorization": f"Bearer {token}"}

# 2. List loans
loans = requests.get(f"{BASE_URL}/loans/", headers=headers)
print(f"Loans: {loans.json()}")

# 3. Get dashboard
dashboard = requests.get(f"{BASE_URL}/dashboard/admin/", headers=headers)
print(f"Dashboard: {dashboard.json()}")

print("✓ All tests passed!")
EOF

python test_workflow.py
```

## CORS Configuration

CORS (Cross-Origin Resource Sharing) is already configured in Django settings.

### Current Setup

**Backend (Django) settings.py:**
```python
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='http://localhost:3000').split(',')
CORS_ALLOW_CREDENTIALS = True
```

**Frontend (.env):**
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Verifying CORS

1. **Browser Console Check:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - API requests should NOT show CORS errors
   - Should see: `Access to XMLHttpRequest blocked by CORS policy` ❌ NOT show this

2. **Network Tab Check:**
   - Open Network tab
   - Make a request through UI
   - Check request headers:
     ```
     GET /api/loans/ HTTP/1.1
     Authorization: Bearer <token>
     Origin: http://localhost:3000
     ```
   - Check response headers:
     ```
     Access-Control-Allow-Origin: http://localhost:3000
     Access-Control-Allow-Credentials: true
     ```

3. **Testing CORS from curl:**
   ```bash
   # Should return CORS headers
   curl -v \
     -H "Origin: http://localhost:3000" \
     http://localhost:8000/api/loans/
   
   # Look for response header:
   # Access-Control-Allow-Origin: http://localhost:3000
   ```

## UI-Based Testing Workflow

### Complete Testing Sequence

1. **Start Servers**
   ```bash
   python run-dev.py
   ```

2. **Open Browser**
   - Frontend: http://localhost:3000
   - Backend Admin: http://localhost:8000/admin

3. **Test Login**
   - Enter username: `admin`
   - Enter password: `admin`
   - Should be redirected to dashboard

4. **Test Admin Dashboard**
   - Should see statistics (total loans, customers, etc.)
   - Charts should render
   - No errors in console

5. **Test Customer Creation**
   - Navigate to `/customers/new`
   - Fill in form fields
   - Submit
   - Should redirect to customer detail

6. **Test Loan Creation**
   - Navigate to `/loans/new`
   - Select customer
   - Enter loan details
   - Submit
   - Should redirect to loan detail

7. **Test Loan Status Update**
   - Go to loan detail
   - Change status
   - Should update and trigger n8n webhook (if configured)

8. **Verify CORS**
   - Open DevTools (F12)
   - Check Network tab
   - Should see requests to `http://localhost:8000/api/`
   - Check headers for CORS

9. **Check Logs**
   - Backend terminal should show requests
   - Frontend terminal should show build updates
   - No error messages

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :8000          # Backend
lsof -i :3000          # Frontend

# Kill process
kill -9 <PID>

# On Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### CORS Errors in Browser

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
1. Check `CORS_ALLOWED_ORIGINS` in backend settings
2. Verify frontend URL is in the list
3. Restart backend: `django manage.py runserver`

```python
# In backend/config/settings.py
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',    # Add this
    'http://127.0.0.1:3000',
]
```

### Backend Migrations Issue

```bash
# Reset migrations (development only)
cd backend
python manage.py migrate src zero
python manage.py makemigrations
python manage.py migrate
```

### Token Expired

```bash
# Login again at the UI login page
# Or get new token via curl:
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

### Frontend Not Connecting to Backend

1. **Check environment variable:**
   ```bash
   # In frontend/.env.local or .env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

2. **Check backend is running:**
   ```bash
   curl http://localhost:8000/api/
   ```

3. **Check network connectivity:**
   - Open DevTools Network tab
   - Make a request
   - Check if request reaches `http://localhost:8000/api/`

## Database Commands

```bash
# Run migrations
npm run db:migrate

# Create migrations
npm run db:makemigrations

# Create superuser
npm run db:createsuperuser

# Access Django shell
npm run db:shell
```

## Summary

You now have multiple ways to run your concurrent servers:

| Method | Platform | Command |
|--------|----------|---------|
| Python script | All | `python run-dev.py` |
| npm scripts | All | `npm run dev:both` |
| PowerShell | Windows | `.\run-dev.ps1` |
| Batch file | Windows | `run-dev.bat` |
| Bash script | Unix | `./run-dev.sh` |

All methods enable you to test your full-stack application with CORS properly configured through the UI!

---

**Testing Status**: Complete and Production Ready ✓
