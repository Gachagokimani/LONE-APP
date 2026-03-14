# API Reference

Complete API documentation for the Loan Application Platform.

## Base URL

```
http://localhost:8000/api     (Development)
https://your-domain.com/api   (Production)
```

## Authentication

All endpoints (except auth) require JWT authentication.

### Get Access Token

**POST** `/auth/token/`

Request:
```json
{
  "username": "admin",
  "password": "changeme"
}
```

Response:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

Usage:
```bash
curl -H "Authorization: Bearer <access_token>" http://localhost:8000/api/users/
```

### Refresh Token

**POST** `/auth/token/refresh/`

Request:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

Response:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

## Users

### List Users

**GET** `/users/`

Query Parameters:
- `role` - Filter by role (admin, user)
- `search` - Search username or email

Response:
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "phone": "555-1234"
    }
  ]
}
```

### Get User

**GET** `/users/{id}/`

Response:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "admin",
  "email": "admin@example.com",
  "role": "admin",
  "phone": "555-1234"
}
```

### Update User

**PATCH** `/users/{id}/`

Request:
```json
{
  "phone": "555-5678"
}
```

Response: User object

## Customers

### List Customers

**GET** `/customers/`

Query Parameters:
- `employment_status` - Filter by status
- `search` - Search name, email, or phone

Response:
```json
{
  "count": 5,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "full_name": "John Doe",
      "email": "john@example.com",
      "phone": "555-1234",
      "date_of_birth": "1990-01-01",
      "address": "123 Main St",
      "employment_status": "employed",
      "monthly_income": 5000,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Create Customer

**POST** `/customers/`

Request:
```json
{
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "555-5678",
  "date_of_birth": "1992-05-20",
  "address": "456 Oak Ave",
  "employment_status": "employed",
  "monthly_income": 6000
}
```

Response: Customer object

### Get Customer

**GET** `/customers/{id}/`

Response: Customer object

### Update Customer

**PATCH** `/customers/{id}/`

Request (partial update):
```json
{
  "phone": "555-9999",
  "monthly_income": 6500
}
```

Response: Customer object

### Delete Customer

**DELETE** `/customers/{id}/`

Response: 204 No Content

## Loans

### List Loans

**GET** `/loans/`

Query Parameters:
- `status` - Filter by status (pending, under_review, approved, rejected, disbursed, closed)
- `customer` - Filter by customer ID
- `search` - Search customer name or email
- `ordering` - Sort by field (applied_at, amount, -applied_at, -amount)

Response:
```json
{
  "count": 15,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "customer_details": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "full_name": "John Doe",
        "email": "john@example.com"
      },
      "amount": 10000,
      "interest_rate": 5.5,
      "term_months": 12,
      "purpose": "Home improvement",
      "status": "approved",
      "applied_at": "2024-01-10T14:20:00Z",
      "updated_at": "2024-01-15T09:15:00Z",
      "disbursed_at": null,
      "total_paid": 0,
      "current_balance": 10000
    }
  ]
}
```

### Create Loan

**POST** `/loans/`

Request:
```json
{
  "customer": "550e8400-e29b-41d4-a716-446655440001",
  "amount": 15000,
  "interest_rate": 6.0,
  "term_months": 24,
  "purpose": "Business expansion"
}
```

Response: Loan object

### Get Loan

**GET** `/loans/{id}/`

Response: Loan object with current_balance

### Update Loan

**PATCH** `/loans/{id}/`

Request:
```json
{
  "status": "approved",
  "interest_rate": 5.75
}
```

Response: Loan object

### Change Loan Status

**POST** `/loans/{id}/change_status/`

Request:
```json
{
  "status": "approved"
}
```

Response:
```json
{
  "status": "status updated"
}
```

Valid status transitions:
- pending → under_review
- under_review → approved
- under_review → rejected
- approved → disbursed
- disbursed → closed
- any → any (admin can force)

## Events

### List Events

**GET** `/events/`

Query Parameters:
- `loan__id` - Filter by loan ID

Response:
```json
{
  "count": 25,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "loan": "550e8400-e29b-41d4-a716-446655440002",
      "event_type": "status_changed",
      "description": "Status changed from pending to under_review",
      "metadata": {
        "old": "pending",
        "new": "under_review"
      },
      "created_at": "2024-01-15T09:15:00Z"
    }
  ]
}
```

Event Types:
- `application_created` - Loan application created
- `status_changed` - Loan status changed
- `payment_received` - Payment received
- `disbursement` - Loan disbursed
- `workflow_triggered` - n8n workflow executed
- `ai_decision` - AI decision recorded

## Dashboards

### Admin Dashboard

**GET** `/dashboard/admin/`

Response:
```json
{
  "total_loans": 50,
  "total_customers": 25,
  "total_disbursed": 250000,
  "loans_by_status": [
    {
      "status": "pending",
      "count": 10
    },
    {
      "status": "approved",
      "count": 15
    }
  ],
  "recent_events": [
    {
      "event_type": "status_changed",
      "created_at": "2024-01-15T14:30:00Z",
      "loan_id": "550e8400-e29b-41d4-a716-446655440002"
    }
  ]
}
```

### User Dashboard

**GET** `/dashboard/user/`

Response:
```json
{
  "my_loans_count": 3,
  "my_loans_by_status": [
    {
      "status": "approved",
      "count": 2
    },
    {
      "status": "disbursed",
      "count": 1
    }
  ],
  "total_borrowed": 35000,
  "recent_loans": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "amount": 15000,
      "status": "disbursed",
      "applied_at": "2024-01-10T14:20:00Z"
    }
  ]
}
```

## Webhooks (n8n Integration)

### Update Loan

**POST** `/webhook/n8n/update_loan/`

Request:
```json
{
  "loan_id": "550e8400-e29b-41d4-a716-446655440002",
  "status": "approved",
  "interest_rate": 5.25
}
```

Response:
```json
{
  "status": "ok"
}
```

### Add Event

**POST** `/webhook/n8n/add_event/`

Request:
```json
{
  "loan_id": "550e8400-e29b-41d4-a716-446655440002",
  "event_type": "ai_decision",
  "description": "Credit decision: Approved",
  "metadata": {
    "credit_score": 750,
    "risk_level": "low"
  }
}
```

Response:
```json
{
  "event_id": "550e8400-e29b-41d4-a716-446655440003"
}
```

## Error Responses

### Bad Request (400)

```json
{
  "field_name": ["Error message"]
}
```

### Unauthorized (401)

```json
{
  "detail": "Invalid token"
}
```

### Forbidden (403)

```json
{
  "detail": "You do not have permission to perform this action."
}
```

### Not Found (404)

```json
{
  "detail": "Not found."
}
```

### Server Error (500)

```json
{
  "detail": "Internal server error"
}
```

## Pagination

List endpoints support pagination with these parameters:

- `page` - Page number (default: 1)
- `page_size` - Items per page (default: 50, max: 100)

Response includes:
- `count` - Total number of items
- `next` - URL to next page
- `previous` - URL to previous page
- `results` - Array of items

Example:
```bash
GET /loans/?page=2&page_size=25
```

## Rate Limiting

Currently no rate limiting is enforced. Implement using:
- `djangorestframework`'s built-in throttling
- External service (API Gateway)

## Filtering & Search

### Filter Examples

```bash
# Get pending loans
GET /loans/?status=pending

# Get approved loans for specific customer
GET /loans/?status=approved&customer=<customer_id>

# Search with status
GET /loans/?status=approved&search=john

# Multiple filters with ordering
GET /loans/?status=disbursed&ordering=-applied_at&page_size=50
```

## Code Examples

### Python (requests)

```python
import requests
import json

BASE_URL = "http://localhost:8000/api"

# Authenticate
auth_url = f"{BASE_URL}/auth/token/"
auth_request = {
    "username": "admin",
    "password": "changeme"
}
response = requests.post(auth_url, json=auth_request)
token = response.json()['access']

headers = {"Authorization": f"Bearer {token}"}

# Get loans
loans_url = f"{BASE_URL}/loans/?status=approved"
response = requests.get(loans_url, headers=headers)
loans = response.json()

# Create loan
create_url = f"{BASE_URL}/loans/"
loan_data = {
    "customer": "550e8400-e29b-41d4-a716-446655440001",
    "amount": 10000,
    "interest_rate": 5.5,
    "term_months": 12,
    "purpose": "Home improvement"
}
response = requests.post(create_url, json=loan_data, headers=headers)
new_loan = response.json()
```

### JavaScript (fetch)

```javascript
const BASE_URL = "http://localhost:8000/api";

// Authenticate
async function authenticate() {
  const response = await fetch(`${BASE_URL}/auth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "admin",
      password: "changeme"
    })
  });
  return response.json();
}

// Get loans
async function getLoans(token, status) {
  const response = await fetch(`${BASE_URL}/loans/?status=${status}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return response.json();
}

// Usage
const auth = await authenticate();
const loans = await getLoans(auth.access, "approved");
```

### cURL

```bash
# Authenticate
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "changeme"
  }'

# Use token
TOKEN="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."

# Get loans
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/loans/?status=approved

# Create loan
curl -X POST http://localhost:8000/api/loans/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer": "550e8400-e29b-41d4-a716-446655440001",
    "amount": 10000,
    "interest_rate": 5.5,
    "term_months": 12,
    "purpose": "Home improvement"
  }'
```

## Changelog

### Version 1.0.0

- Initial release
- Core loan management APIs
- User and customer management
- Event tracking and webhooks
- Admin and user dashboards
