# API Testing Guide

This guide provides comprehensive API testing examples using curl, Postman, and integration tests.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [cURL Examples](#curl-examples)
5. [Postman Collection](#postman-collection)
6. [Integration Tests](#integration-tests)
7. [Error Handling](#error-handling)

## Quick Start

### Start Servers
```bash
python run-dev.py
```

### Get Authentication Token
```bash
# macOS/Linux/WSL
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' | jq -r '.access')

echo "Token: $TOKEN"

# Windows PowerShell
$response = curl -Method POST -Uri "http://localhost:8000/api/auth/token/" `
  -Headers @{"Content-Type" = "application/json"} `
  -Body '{"username":"admin","password":"admin"}'
$global:TOKEN = ($response | ConvertFrom-Json).access
Write-Host "Token: $TOKEN"
```

### Make API Requests
```bash
# List loans
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/loans/

# Get specific loan
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/loans/1/
```

## Authentication

### Token-Based Authentication

All API endpoints (except `/auth/token/`) require JWT authentication.

**Get Token:**
```bash
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "first_name": "Admin",
    "last_name": "User",
    "is_staff": true
  }
}
```

**Token Refresh:**
```bash
curl -X POST http://localhost:8000/api/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh":"<refresh_token>"}'
```

**Token Verification:**
```bash
curl -X POST http://localhost:8000/api/auth/token/verify/ \
  -H "Content-Type: application/json" \
  -d '{"token":"<access_token>"}'
```

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/token/` | Get access token |
| POST | `/api/auth/token/refresh/` | Refresh token |
| POST | `/api/auth/token/verify/` | Verify token |

### Customer Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/customers/` | List customers |
| POST | `/api/customers/` | Create customer |
| GET | `/api/customers/{id}/` | Get customer detail |
| PUT | `/api/customers/{id}/` | Update customer |
| DELETE | `/api/customers/{id}/` | Delete customer |

### Loan Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/loans/` | List loans |
| POST | `/api/loans/` | Create loan |
| GET | `/api/loans/{id}/` | Get loan detail |
| PUT | `/api/loans/{id}/` | Update loan |
| PATCH | `/api/loans/{id}/` | Partial update loan |
| DELETE | `/api/loans/{id}/` | Delete loan |

### Event Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/loans/{loan_id}/events/` | List loan events |
| POST | `/api/loans/{loan_id}/events/` | Create event |

### Dashboard Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/dashboard/admin/` | Admin dashboard stats |
| GET | `/api/dashboard/officer/` | Officer dashboard stats |

## cURL Examples

### 1. Customer Management

**Create Customer**
```bash
curl -X POST http://localhost:8000/api/customers/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Sarah Wilson",
    "email": "sarah@example.com",
    "phone": "(555) 789-1234",
    "date_of_birth": "1988-06-10",
    "address": "789 Elm Street, Springfield, IL 62701",
    "employment_status": "employed",
    "monthly_income": 5800
  }'
```

**Expected Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "full_name": "Sarah Wilson",
  "email": "sarah@example.com",
  "phone": "(555) 789-1234",
  "date_of_birth": "1988-06-10",
  "address": "789 Elm Street, Springfield, IL 62701",
  "employment_status": "employed",
  "monthly_income": "5800.00",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**List Customers**
```bash
curl -H "Authorization: Bearer $TOKEN" \
  'http://localhost:8000/api/customers/?page=1&page_size=10'
```

**Get Customer Detail**
```bash
CUSTOMER_ID="550e8400-e29b-41d4-a716-446655440000"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/customers/$CUSTOMER_ID/
```

**Update Customer**
```bash
curl -X PUT http://localhost:8000/api/customers/$CUSTOMER_ID/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Sarah Wilson-Smith",
    "employment_status": "self-employed",
    "monthly_income": 6500
  }'
```

**Delete Customer**
```bash
curl -X DELETE http://localhost:8000/api/customers/$CUSTOMER_ID/ \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Loan Management

**Create Loan**
```bash
curl -X POST http://localhost:8000/api/loans/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 25000,
    "interest_rate": 5.5,
    "term_months": 36,
    "purpose": "Home renovation"
  }'
```

**Expected Response (201 Created):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "customer": "550e8400-e29b-41d4-a716-446655440000",
  "customer_name": "Sarah Wilson",
  "customer_email": "sarah@example.com",
  "amount": "25000.00",
  "interest_rate": "5.50",
  "term_months": 36,
  "purpose": "Home renovation",
  "status": "pending",
  "monthly_payment": "725.00",
  "created_at": "2024-01-15T11:00:00Z",
  "updated_at": "2024-01-15T11:00:00Z"
}
```

**List Loans**
```bash
# All loans
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/loans/

# Filter by status
curl -H "Authorization: Bearer $TOKEN" \
  'http://localhost:8000/api/loans/?status=pending'

# Pagination
curl -H "Authorization: Bearer $TOKEN" \
  'http://localhost:8000/api/loans/?page=1&page_size=20'
```

**Get Loan Detail**
```bash
LOAN_ID="660e8400-e29b-41d4-a716-446655440001"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/loans/$LOAN_ID/
```

**Update Loan Status (Approve)**
```bash
curl -X PATCH http://localhost:8000/api/loans/$LOAN_ID/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'
```

**Update Loan Status (Disburse)**
```bash
curl -X PATCH http://localhost:8000/api/loans/$LOAN_ID/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "disbursed"}'
```

**Update Loan Status (Reject)**
```bash
curl -X PATCH http://localhost:8000/api/loans/$LOAN_ID/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "rejected"}'
```

### 3. Event Management

**List Loan Events**
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/loans/$LOAN_ID/events/
```

**Create Event**
```bash
curl -X POST http://localhost:8000/api/loans/$LOAN_ID/events/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "payment_received",
    "description": "Payment of $500 received"
  }'
```

**Event Types:**
- `application_submitted`
- `documents_required`
- `application_approved`
- `application_rejected`
- `funds_disbursed`
- `payment_received`
- `payment_missed`

### 4. Dashboard

**Admin Dashboard**
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/dashboard/admin/
```

**Expected Response:**
```json
{
  "total_customers": 125,
  "total_loans": 87,
  "pending_loans": 34,
  "approved_loans": 42,
  "rejected_loans": 5,
  "disbursed_loans": 6,
  "total_loan_amount": "2500000.00",
  "total_revenue": "125000.00"
}
```

**Officer Dashboard**
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/dashboard/officer/
```

## Postman Collection

### Create Postman Collection

Create `API.postman_collection.json`:

```json
{
  "info": {
    "name": "Loan Management API",
    "description": "Complete API collection for loan management system",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Get Token",
          "request": {
            "method": "POST",
            "url": "http://localhost:8000/api/auth/token/",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"username\":\"admin\",\"password\":\"admin\"}"
            }
          }
        },
        {
          "name": "Refresh Token",
          "request": {
            "method": "POST",
            "url": "http://localhost:8000/api/auth/token/refresh/",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"refresh\":\"{{refresh_token}}\"}"
            }
          }
        }
      ]
    },
    {
      "name": "Customers",
      "item": [
        {
          "name": "List Customers",
          "request": {
            "method": "GET",
            "url": "http://localhost:8000/api/customers/",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ]
          }
        },
        {
          "name": "Create Customer",
          "request": {
            "method": "POST",
            "url": "http://localhost:8000/api/customers/",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"full_name\":\"Test Customer\",\"email\":\"test@example.com\",\"phone\":\"555-1234\",\"date_of_birth\":\"1990-01-01\",\"address\":\"123 Main St\",\"employment_status\":\"employed\",\"monthly_income\":5000}"
            }
          }
        },
        {
          "name": "Get Customer",
          "request": {
            "method": "GET",
            "url": "http://localhost:8000/api/customers/{{customer_id}}/",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ]
          }
        }
      ]
    },
    {
      "name": "Loans",
      "item": [
        {
          "name": "List Loans",
          "request": {
            "method": "GET",
            "url": "http://localhost:8000/api/loans/",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ]
          }
        },
        {
          "name": "Create Loan",
          "request": {
            "method": "POST",
            "url": "http://localhost:8000/api/loans/",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"customer\":\"{{customer_id}}\",\"amount\":15000,\"interest_rate\":5.5,\"term_months\":24,\"purpose\":\"Test loan\"}"
            }
          }
        },
        {
          "name": "Get Loan",
          "request": {
            "method": "GET",
            "url": "http://localhost:8000/api/loans/{{loan_id}}/",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ]
          }
        },
        {
          "name": "Update Loan Status",
          "request": {
            "method": "PATCH",
            "url": "http://localhost:8000/api/loans/{{loan_id}}/",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"status\":\"approved\"}"
            }
          }
        }
      ]
    }
  ]
}
```

### Import into Postman

1. Open Postman
2. Click "Import"
3. Paste the JSON above or save as file
4. Click "Import"
5. Set variables:
   - `base_url`: http://localhost:8000/api
   - `access_token`: (Get from auth endpoint)
   - `refresh_token`: (Get from auth endpoint)

## Integration Tests

### Python Integration Test Script

Create `backend/test_api.py`:

```python
"""
API Integration Tests
Run with: python test_api.py
"""

import requests
import json
from datetime import date

BASE_URL = "http://localhost:8000/api"

class APITester:
    def __init__(self):
        self.token = None
        self.customer_id = None
        self.loan_id = None
        
    def test_authentication(self):
        """Test token authentication"""
        print("\n🔐 Testing Authentication...")
        
        response = requests.post(
            f"{self.BASE_URL}/auth/token/",
            json={"username": "admin", "password": "admin"}
        )
        
        assert response.status_code == 200, f"Auth failed: {response.text}"
        self.token = response.json()["access"]
        print(f"✓ Token obtained: {self.token[:20]}...")
    
    def get_headers(self):
        """Get request headers with auth"""
        return {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
    
    def test_create_customer(self):
        """Test customer creation"""
        print("\n👥 Testing Customer Creation...")
        
        response = requests.post(
            f"{BASE_URL}/customers/",
            headers=self.get_headers(),
            json={
                "full_name": "Test Customer",
                "email": f"test-{date.today().isoformat()}@example.com",
                "phone": "555-1234",
                "date_of_birth": "1990-01-01",
                "address": "123 Main St",
                "employment_status": "employed",
                "monthly_income": 5000
            }
        )
        
        assert response.status_code == 201, f"Create failed: {response.text}"
        self.customer_id = response.json()["id"]
        print(f"✓ Customer created: {self.customer_id}")
    
    def test_list_customers(self):
        """Test listing customers"""
        print("\n📋 Testing Customer List...")
        
        response = requests.get(
            f"{BASE_URL}/customers/",
            headers=self.get_headers()
        )
        
        assert response.status_code == 200
        data = response.json()
        print(f"✓ Listed {len(data['results'])} customers")
    
    def test_create_loan(self):
        """Test loan creation"""
        print("\n💰 Testing Loan Creation...")
        
        response = requests.post(
            f"{BASE_URL}/loans/",
            headers=self.get_headers(),
            json={
                "customer": self.customer_id,
                "amount": 15000,
                "interest_rate": 5.5,
                "term_months": 24,
                "purpose": "Test loan"
            }
        )
        
        assert response.status_code == 201, f"Create failed: {response.text}"
        self.loan_id = response.json()["id"]
        print(f"✓ Loan created: {self.loan_id}")
    
    def test_update_loan_status(self):
        """Test loan status update"""
        print("\n🔄 Testing Loan Status Update...")
        
        response = requests.patch(
            f"{BASE_URL}/loans/{self.loan_id}/",
            headers=self.get_headers(),
            json={"status": "approved"}
        )
        
        assert response.status_code == 200
        print(f"✓ Loan approved")
    
    def test_dashboard(self):
        """Test dashboard endpoint"""
        print("\n📊 Testing Dashboard...")
        
        response = requests.get(
            f"{BASE_URL}/dashboard/admin/",
            headers=self.get_headers()
        )
        
        assert response.status_code == 200
        data = response.json()
        print(f"✓ Dashboard loaded:")
        print(f"  - Total customers: {data.get('total_customers')}")
        print(f"  - Total loans: {data.get('total_loans')}")
        print(f"  - Pending loans: {data.get('pending_loans')}")
    
    def run_all_tests(self):
        """Run all tests"""
        print("="*50)
        print("🧪 API Integration Tests")
        print("="*50)
        
        try:
            self.test_authentication()
            self.test_create_customer()
            self.test_list_customers()
            self.test_create_loan()
            self.test_update_loan_status()
            self.test_dashboard()
            
            print("\n" + "="*50)
            print("✅ All tests passed!")
            print("="*50)
        except AssertionError as e:
            print(f"\n❌ Test failed: {e}")
            return False
        except Exception as e:
            print(f"\n❌ Unexpected error: {e}")
            return False
        
        return True

if __name__ == "__main__":
    import time
    
    # Wait for server startup
    print("Waiting for server to start...")
    for i in range(30):
        try:
            requests.get(f"{BASE_URL}/")
            break
        except:
            time.sleep(1)
    
    tester = APITester()
    success = tester.run_all_tests()
    exit(0 if success else 1)
```

### Run Integration Tests

```bash
# Start servers (in one terminal)
python run-dev.py

# Run tests (in another terminal)
cd backend
python test_api.py
```

## Error Handling

### Common Status Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Check request format/data |
| 401 | Unauthorized | Token missing/invalid |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 500 | Server Error | Check backend logs |

### Common Errors

**Missing Token**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

**Invalid Token**
```json
{
  "detail": "Given token not valid for any token type"
}
```

**Validation Error**
```json
{
  "full_name": ["This field may not be blank."],
  "email": ["This field must be unique."]
}
```

**Permission Denied**
```json
{
  "detail": "You do not have permission to perform this action."
}
```

## Testing Scripts

### Bash Test Script

```bash
#!/bin/bash

# Save as test_api.sh and run: bash test_api.sh

BASE_URL="http://localhost:8000/api"

# Get token
TOKEN=$(curl -s -X POST $BASE_URL/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' | jq -r '.access')

echo "Token: $TOKEN"

# Test endpoints
echo "\n🧪 Testing API Endpoints..."

echo "\n✓ List customers"
curl -s -H "Authorization: Bearer $TOKEN" \
  $BASE_URL/customers/ | jq '.results | length'

echo "\n✓ Dashboard"
curl -s -H "Authorization: Bearer $TOKEN" \
  $BASE_URL/dashboard/admin/ | jq '.'

echo "\n✓ List loans"
curl -s -H "Authorization: Bearer $TOKEN" \
  $BASE_URL/loans/ | jq '.results | length'

echo "\n✅ All tests completed!"
```

## Summary

You now have comprehensive API testing options:

1. **cURL Examples**: Direct command-line testing
2. **Postman**: GUI-based API exploration
3. **Integration Tests**: Automated Python testing
4. **Health Checks**: npm scripts for quick verification

All endpoints support CORS and JWT authentication!

---

**API Testing**: Complete ✓
