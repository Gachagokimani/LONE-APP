import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from decimal import Decimal


class User(AbstractUser):
    """Extended user model with role field."""
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('user', 'User'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    phone = models.CharField(max_length=20, blank=True)
    # Add any other custom fields
    groups = models.ManyToManyField('auth.Group', related_name='custom_user_set', blank=True)
    user_permissions = models.ManyToManyField('auth.Permission', related_name='custom_user_set', blank=True)


class CustomerProfile(models.Model):
    """Detailed customer information (linked to a User if the customer is also a user)."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, related_name='profile')
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    date_of_birth = models.DateField()
    address = models.TextField()
    employment_status = models.CharField(max_length=50, choices=[
        ('employed', 'Employed'),
        ('self_employed', 'Self Employed'),
        ('unemployed', 'Unemployed'),
        ('student', 'Student'),
        ('retired', 'Retired'),
    ])
    monthly_income = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class LoanApplication(models.Model):
    """Represents a loan application/lead."""
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('disbursed', 'Disbursed'),
        ('closed', 'Closed'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE, related_name='loans')
    officer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='handled_loans')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2)  # annual percentage
    term_months = models.PositiveIntegerField()
    purpose = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # For debt tracking
    disbursed_at = models.DateTimeField(null=True, blank=True)
    total_paid = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def current_balance(self):
        if not self.disbursed_at or self.status not in ['disbursed', 'approved']:
            return Decimal('0.00')
        # Simple interest calculation (for illustration)
        days_since_disbursement = (timezone.now() - self.disbursed_at).days
        daily_rate = self.interest_rate / Decimal('100') / Decimal('365')
        accrued_interest = self.amount * daily_rate * days_since_disbursement
        total_due = self.amount + accrued_interest
        return total_due - self.total_paid


class LoanEvent(models.Model):
    """Tracks all events in the lifecycle of a loan (customer journey)."""
    EVENT_TYPES = (
        ('application_created', 'Application Created'),
        ('status_changed', 'Status Changed'),
        ('payment_received', 'Payment Received'),
        ('disbursement', 'Disbursement'),
        ('workflow_triggered', 'Workflow Triggered'),
        ('ai_decision', 'AI Decision'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    loan = models.ForeignKey(LoanApplication, on_delete=models.CASCADE, related_name='events')
    event_type = models.CharField(max_length=30, choices=EVENT_TYPES)
    description = models.TextField(blank=True)
    metadata = models.JSONField(default=dict)  # store additional context
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']