import sys
import importlib.metadata as metadata

# Create a mock pkg_resources module if it doesn't exist
class MockPkgResources:
    @staticmethod
    def get_distribution(name):
        try:
            return metadata.distribution(name)
        except metadata.PackageNotFoundError:
            raise ImportError(f"Package {name} not found")
    
    DistributionNotFound = metadata.PackageNotFoundError

# Inject mock pkg_resources before importing Django
sys.modules['pkg_resources'] = MockPkgResources()

# Now do the Django setup
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django
django.setup()

from src.models import User, CustomerProfile, LoanApplication
from decimal import Decimal
from datetime import date

print("\n" + "="*60)
print("LOAN APPLICATION - TEST DATA SETUP")
print("="*60 + "\n")

try:
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
        admin_user.set_password('admin')
        admin_user.save()
        print("✓ Admin user exists (password reset to: admin)")
    
    # Create test customer
    print("\nCreating test customer...")
    customer, created = CustomerProfile.objects.get_or_create(
        email='testcustomer@example.com',
        defaults={
            'full_name': 'Test Customer',
            'phone': '(555) 123-4567',
            'date_of_birth': date(1980, 1, 15),
            'address': '123 Main Street, Springfield, IL 62701',
            'employment_status': 'employed',
            'monthly_income': Decimal('6250.00'),
        }
    )
    
    if created:
        print(f"✓ Test customer created: {customer.full_name}")
    else:
        print(f"✓ Test customer exists: {customer.full_name}")
    
    # Create test loan
    print("\nCreating test loan...")
    loan, created = LoanApplication.objects.get_or_create(
        customer=customer,
        amount=Decimal('25000.00'),
        defaults={
            'interest_rate': Decimal('5.5'),
            'term_months': 60,
            'purpose': 'Home improvement project',
            'status': 'pending',
            'officer': admin_user,
        }
    )
    
    if created:
        print(f"✓ Test loan created: ${loan.amount} at {loan.interest_rate}%")
    else:
        print(f"✓ Test loan exists")
    
    print("\n" + "="*60)
    print("✓ TEST DATA SETUP COMPLETE")
    print("="*60)
    print("\nTest Credentials:")
    print("  Username: admin")
    print("  Password: admin")
    print("\nLogin at: http://localhost:8000/admin/")
    print("API at: http://localhost:8000/api/")
    print("="*60 + "\n")
    
except Exception as e:
    print(f"\n✗ Error during setup: {e}")
    import traceback
    traceback.print_exc()
