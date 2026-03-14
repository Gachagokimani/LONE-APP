# Test Data Guide - Database Seeding

This guide provides scripts and instructions to seed your development database with test data for UI testing.

## Quick Start

```bash
# Option 1: Run seed script directly
cd backend
python manage.py shell < seed_data.py

# Option 2: Create and run the seed script
python manage.py shell
# Inside shell:
exec(open('seed_data.py').read())

# Option 3: Via npm script (if configured)
npm run db:seed
```

## Automated Seed Script

Create `backend/seed_data.py`:

```python
"""
Test data seed script for development/testing
Run with: python manage.py shell < seed_data.py
Or: python manage.py shell then: exec(open('seed_data.py').read())
"""

from src.models import User, CustomerProfile, LoanApplication, LoanEvent
from django.utils import timezone
from decimal import Decimal
from datetime import date, timedelta
import uuid

print("🌱 Starting database seed...")

# ========== USERS ==========
print("\n📱 Creating test users...")

# Admin user
admin_user, created = User.objects.get_or_create(
    username='admin',
    defaults={
        'email': 'admin@example.com',
        'first_name': 'Admin',
        'last_name': 'User',
        'is_staff': True,
        'is_superuser': True,
        'is_active': True,
    }
)
if created:
    admin_user.set_password('admin')
    admin_user.save()
    print(f"✓ Admin user created: admin / admin")
else:
    print(f"✓ Admin user already exists")

# Staff user
staff_user, created = User.objects.get_or_create(
    username='loan_officer',
    defaults={
        'email': 'officer@example.com',
        'first_name': 'John',
        'last_name': 'Officer',
        'is_staff': True,
        'is_active': True,
    }
)
if created:
    staff_user.set_password('officer123')
    staff_user.save()
    print(f"✓ Loan officer created: loan_officer / officer123")

# Regular user
regular_user, created = User.objects.get_or_create(
    username='customer',
    defaults={
        'email': 'customer@example.com',
        'first_name': 'Jane',
        'last_name': 'Customer',
        'is_active': True,
    }
)
if created:
    regular_user.set_password('customer123')
    regular_user.save()
    print(f"✓ Regular user created: customer / customer123")

# ========== CUSTOMERS ==========
print("\n👥 Creating test customers...")

customers_data = [
    {
        'full_name': 'Alice Johnson',
        'email': 'alice@example.com',
        'phone': '(555) 123-4567',
        'date_of_birth': date(1985, 3, 15),
        'address': '123 Main Street, Apartment 4B, Springfield, IL 62701',
        'employment_status': 'employed',
        'monthly_income': Decimal('5500.00'),
    },
    {
        'full_name': 'Bob Smith',
        'email': 'bob@example.com',
        'phone': '(555) 234-5678',
        'date_of_birth': date(1990, 7, 22),
        'address': '456 Oak Avenue, Chicago, IL 60601',
        'employment_status': 'employed',
        'monthly_income': Decimal('6200.00'),
    },
    {
        'full_name': 'Carol Davis',
        'email': 'carol@example.com',
        'phone': '(555) 345-6789',
        'date_of_birth': date(1988, 11, 5),
        'address': '789 Pine Road, Evanston, IL 60202',
        'employment_status': 'self-employed',
        'monthly_income': Decimal('4800.00'),
    },
    {
        'full_name': 'David Wilson',
        'email': 'david@example.com',
        'phone': '(555) 456-7890',
        'date_of_birth': date(1992, 1, 30),
        'address': '321 Elm Street, Oak Park, IL 60304',
        'employment_status': 'employed',
        'monthly_income': Decimal('7100.00'),
    },
    {
        'full_name': 'Emma Martinez',
        'email': 'emma@example.com',
        'phone': '(555) 567-8901',
        'date_of_birth': date(1987, 5, 18),
        'address': '654 Maple Drive, Des Plaines, IL 60016',
        'employment_status': 'retired',
        'monthly_income': Decimal('3200.00'),
    },
]

created_customers = []
for data in customers_data:
    customer, created = CustomerProfile.objects.get_or_create(
        email=data['email'],
        defaults=data
    )
    created_customers.append(customer)
    status = "✓ Created" if created else "✓ Already exists"
    print(f"{status}: {customer.full_name}")

# ========== LOANS ==========
print("\n💰 Creating test loans...")

loans_data = [
    {
        'customer': created_customers[0],
        'amount': Decimal('15000.00'),
        'interest_rate': Decimal('5.5'),
        'term_months': 24,
        'purpose': 'Home renovation',
    },
    {
        'customer': created_customers[1],
        'amount': Decimal('25000.00'),
        'interest_rate': Decimal('4.8'),
        'term_months': 36,
        'purpose': 'Vehicle purchase',
    },
    {
        'customer': created_customers[2],
        'amount': Decimal('10000.00'),
        'interest_rate': Decimal('6.2'),
        'term_months': 12,
        'purpose': 'Business expansion',
    },
    {
        'customer': created_customers[3],
        'amount': Decimal('50000.00'),
        'interest_rate': Decimal('4.5'),
        'term_months': 60,
        'purpose': 'Education',
    },
    {
        'customer': created_customers[4],
        'amount': Decimal('8000.00'),
        'interest_rate': Decimal('5.8'),
        'term_months': 12,
        'purpose': 'Medical expenses',
    },
]

created_loans = []
for i, data in enumerate(loans_data):
    loan, created = LoanApplication.objects.get_or_create(
        customer=data['customer'],
        amount=data['amount'],
        term_months=data['term_months'],
        defaults=data
    )
    created_loans.append(loan)
    status = "✓ Created" if created else "✓ Already exists"
    print(f"{status}: ${loan.amount} to {loan.customer.full_name} ({data['purpose']})")

# ========== LOAN EVENTS ==========
print("\n📝 Creating loan events...")

events_data = [
    {
        'loan': created_loans[0],
        'event_type': 'application_submitted',
        'description': 'Loan application submitted',
        'actor': staff_user,
    },
    {
        'loan': created_loans[0],
        'event_type': 'application_approved',
        'description': 'Application approved by underwriting',
        'actor': staff_user,
    },
    {
        'loan': created_loans[0],
        'event_type': 'funds_disbursed',
        'description': 'Funds disbursed to customer',
        'actor': admin_user,
    },
    {
        'loan': created_loans[1],
        'event_type': 'application_submitted',
        'description': 'Loan application submitted',
        'actor': staff_user,
    },
    {
        'loan': created_loans[1],
        'event_type': 'documents_required',
        'description': 'Additional documents required',
        'actor': staff_user,
    },
    {
        'loan': created_loans[2],
        'event_type': 'application_submitted',
        'description': 'Loan application submitted',
        'actor': staff_user,
    },
    {
        'loan': created_loans[3],
        'event_type': 'application_submitted',
        'description': 'Loan application submitted',
        'actor': staff_user,
    },
    {
        'loan': created_loans[4],
        'event_type': 'application_submitted',
        'description': 'Loan application submitted',
        'actor': staff_user,
    },
    {
        'loan': created_loans[4],
        'event_type': 'application_approved',
        'description': 'Application approved',
        'actor': staff_user,
    },
]

for data in events_data:
    event, created = LoanEvent.objects.get_or_create(
        loan=data['loan'],
        event_type=data['event_type'],
        actor=data['actor'],
        defaults={
            'description': data['description'],
        }
    )
    status = "✓ Created" if created else "✓ Already exists"
    print(f"{status}: {event.get_event_type_display()} for {event.loan.customer.full_name}")

print("\n" + "="*50)
print("✅ Database seeding complete!")
print("="*50)
print("\nTest Credentials:")
print("  Admin:     admin / admin")
print("  Officer:   loan_officer / officer123")
print("  Customer:  customer / customer123")
print("\nTest Customers: 5 (with loans and events)")
print("Test Loans: 5 (with various statuses)")
print("\nYou can now test the UI with sample data!")
```

## Manual Database Population

### Option 1: Django Admin Interface

1. Start the servers:
   ```bash
   python run-dev.py
   ```

2. Navigate to http://localhost:8000/admin

3. Login with admin credentials

4. Add customers and loans through the admin interface

### Option 2: Django Shell

```bash
cd backend
python manage.py shell
```

Inside the shell:

```python
from src.models import User, CustomerProfile, LoanApplication, LoanEvent
from decimal import Decimal
from datetime import date

# Create a customer
customer = CustomerProfile.objects.create(
    full_name="Test Customer",
    email="test@example.com",
    phone="555-1234",
    date_of_birth=date(1990, 1, 1),
    address="123 Main St",
    employment_status="employed",
    monthly_income=Decimal("5000.00")
)

# Create a loan
loan = LoanApplication.objects.create(
    customer=customer,
    amount=Decimal("15000.00"),
    interest_rate=Decimal("5.5"),
    term_months=24,
    purpose="Test loan"
)

# Create an event
event = LoanEvent.objects.create(
    loan=loan,
    event_type="application_submitted",
    description="Test event",
    actor=User.objects.first()
)

print(f"Created: {customer.full_name}")
print(f"Loan: ${loan.amount}")
```

### Option 3: API Requests

```bash
# Get authentication token
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' | jq -r '.access')

# Create customer via API
curl -X POST http://localhost:8000/api/customers/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "API Test Customer",
    "email": "api@example.com",
    "phone": "555-9999",
    "date_of_birth": "1990-05-15",
    "address": "456 Oak Ave",
    "employment_status": "employed",
    "monthly_income": 6000
  }' | jq

# Create loan via API
CUSTOMER_ID="<paste-customer-id-from-response>"
curl -X POST http://localhost:8000/api/loans/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"customer\": \"$CUSTOMER_ID\",
    \"amount\": 20000,
    \"interest_rate\": 5.5,
    \"term_months\": 36,
    \"purpose\": \"API test loan\"
  }" | jq
```

## Data Models Reference

### Customer Fields
```
- full_name: string (required)
- email: string (required, unique)
- phone: string (required)
- date_of_birth: date (required)
- address: string (required)
- employment_status: choice ('employed', 'self-employed', 'retired', 'unemployed')
- monthly_income: decimal (required)
- created_at: datetime (auto)
- updated_at: datetime (auto)
```

### Loan Application Fields
```
- customer: FK to CustomerProfile (required)
- amount: decimal (required)
- interest_rate: decimal (required)
- term_months: integer (required)
- purpose: string (required)
- status: choice ('pending', 'approved', 'rejected', 'disbursed') - default: 'pending'
- created_at: datetime (auto)
- updated_at: datetime (auto)
```

### Loan Event Fields
```
- loan: FK to LoanApplication (required)
- event_type: choice ('application_submitted', 'documents_required', 'application_approved', 'application_rejected', 'funds_disbursed', 'payment_received', 'payment_missed')
- description: string (optional)
- actor: FK to User (optional)
- created_at: datetime (auto)
```

## Testing Workflows

### Workflow 1: Complete Loan Application

1. **Create Customer**
   - Go to UI: /customers/new
   - Fill in all fields
   - Submit

2. **Create Loan Application**
   - Go to UI: /loans/new
   - Select created customer
   - Enter loan details
   - Submit

3. **Update Loan Status**
   - Go to loan detail
   - Change status to "approved"
   - Verify event is created

4. **View Events**
   - Check Events tab
   - Should see all status changes

### Workflow 2: Dashboard Verification

1. **Admin Dashboard**
   - Login as admin
   - Should see: Total customers, Total loans, Active loans
   - Charts should render

2. **Officer Dashboard**
   - Login as loan_officer
   - Should see: Pending loans, Rejected loans
   - Can approve/reject applications

### Workflow 3: API Testing

1. **Get Authentication Token**
   ```bash
   curl -X POST http://localhost:8000/api/auth/token/ \
     -d '{"username":"admin","password":"admin"}' | jq
   ```

2. **List Resources**
   ```bash
   curl -H "Authorization: Bearer <TOKEN>" \
     http://localhost:8000/api/loans/
   ```

3. **Create Resources**
   ```bash
   curl -X POST http://localhost:8000/api/loans/ \
     -H "Authorization: Bearer <TOKEN>" \
     -d '{...}' | jq
   ```

4. **Update Resources**
   ```bash
   curl -X PATCH http://localhost:8000/api/loans/<id>/ \
     -H "Authorization: Bearer <TOKEN>" \
     -d '{"status":"approved"}' | jq
   ```

## Troubleshooting

### "Table already exists" error

```bash
# Reset database (deletes all data)
cd backend
python manage.py migrate src zero
python manage.py migrate

# Then re-run seed script
python manage.py shell < seed_data.py
```

### "No such table" error

```bash
# Run migrations first
cd backend
python manage.py makemigrations
python manage.py migrate
```

### Can't login with test credentials

```bash
# Check if superuser exists
python manage.py shell
from src.models import User
User.objects.all()

# If not, create one
from django.contrib.auth import get_user_model
User = get_user_model()
User.objects.create_superuser('admin', 'admin@example.com', 'admin')
```

## Summary

You now have multiple ways to populate test data:

1. **Automated**: Run the seed_data.py script (fastest)
2. **Admin UI**: Use Django admin at /admin (most visual)
3. **Django Shell**: Manual Python commands (most flexible)
4. **API**: Use REST endpoints (real-world testing)

All methods support full CORS testing through the frontend UI!

---

**Data Seeding**: Complete ✓
