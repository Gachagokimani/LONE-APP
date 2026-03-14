#!/usr/bin/env python
"""
Set up test data for the Loan Application
Creates admin user and test customers/loans
"""
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from src.models import User, CustomerProfile, LoanApplication
from decimal import Decimal
from datetime import date

print("\n" + "="*60)
print("LOAN APPLICATION - TEST DATA SETUP")
print("="*60 + "\n")

# Create admin user
print("Creating admin user...")
admin_user, created = User.objects.get_or_create(
    username='admin',
    defaults={
        'email': 'admin@example.com',
        'first_name': 'Admin',
        'last_name': 'User',
        'role': 'admin',
        'is_staff': True,
        'is_superuser': True,
        'is_active': True,
    }
)

if created:
    admin_user.set_password('admin')
    admin_user.save()
    print("✓ Admin user created (admin/admin)")
else:
    # Update password in case it exists
    admin_user.set_password('admin')
    admin_user.save()
    print("✓ Admin user already exists (password reset to: admin)")

# Create test customer
print("\nCreating test customer...")
customer, created = CustomerProfile.objects.get_or_create(
    email='testcustomer@example.com',
    defaults={
        'full_name': 'Test Customer',
        'phone': '(555) 123-4567',
        'date_of_birth': date(1980, 1, 15),
        'employment_status': 'employed',
        'annual_income': Decimal('75000.00'),
        'credit_score': 720,
    }
)

if created:
    print(f"✓ Test customer created: {customer.full_name}")
else:
    print(f"✓ Test customer already exists: {customer.full_name}")

# Create test loan
print("\nCreating test loan...")
loan, created = LoanApplication.objects.get_or_create(
    customer=customer,
    defaults={
        'amount': Decimal('25000.00'),
        'interest_rate': Decimal('5.5'),
        'term_months': 60,
        'status': 'pending',
        'officer': admin_user,
    }
)

if created:
    print(f"✓ Test loan created: ${loan.amount} at {loan.interest_rate}%")
else:
    print(f"✓ Test loan already exists")

print("\n" + "="*60)
print("TEST DATA SETUP COMPLETE")
print("="*60)
print("\nTest Credentials:")
print("  Username: admin")
print("  Password: admin")
print("\nLogin at: http://localhost:8000/admin/")
print("API at: http://localhost:8000/api/")
print("="*60 + "\n")
