
1. High‑Level Architecture
text
[Next.js (TypeScript)]  <--->  [DRF API]  <--->  [PostgreSQL]
         ^                          ^
         |                          | (webhooks)
         +--------------------------+---------> [n8n Workflows]
                                    |
                              [AI Services] (optional)
Next.js consumes REST APIs from DRF, handling UI and user interactions.

DRF provides authentication, business logic, and data persistence. It emits events to n8n via webhooks when key actions occur (e.g., new loan application, status change).

n8n orchestrates workflows: onboarding, credit checks, debt tracking, AI model triggers, notifications. It can call external AI services and then update DRF via its own webhooks.

PostgreSQL stores all relational data.

2. Database Schema (Core Models)
We'll define the essential models in models.py. All models inherit from Django's base and use UUIDs for public identifiers.

python
# models.py
import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

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
    employment_status = models.CharField(max_length=50, choices=...)
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
3. Authentication & Role‑Based Permissions
We'll use JWT (via djangorestframework-simplejwt) for stateless authentication. Custom permissions restrict access:

python
# permissions.py
from rest_framework import permissions

class IsAdminOrOwner(permissions.BasePermission):
    """
    Custom permission:
    - Admin users have full access.
    - Regular users can only access their own data (e.g., loans where they are the officer or customer's linked user).
    """

    def has_permission(self, request, view):
        # Allow authenticated users
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Admins can do anything
        if request.user.role == 'admin':
            return True

        # For LoanApplication, check if the user is the assigned officer or the customer's linked user
        if hasattr(obj, 'officer'):
            return obj.officer == request.user
        if hasattr(obj, 'customer') and hasattr(obj.customer, 'user'):
            return obj.customer.user == request.user
        if hasattr(obj, 'user'):  # e.g., CustomerProfile
            return obj.user == request.user
        return False
For viewsets, we'll apply this permission and filter querysets accordingly.

4. API Endpoints (Core Views)
We'll build a set of RESTful endpoints using DRF viewsets. Below are the essential ones.

Serializers
python
# serializers.py
from rest_framework import serializers
from .models import User, CustomerProfile, LoanApplication, LoanEvent

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'phone']
        read_only_fields = ['id']

class CustomerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class LoanApplicationSerializer(serializers.ModelSerializer):
    customer_details = CustomerProfileSerializer(source='customer', read_only=True)

    class Meta:
        model = LoanApplication
        fields = '__all__'
        read_only_fields = ['id', 'applied_at', 'updated_at']

class LoanEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanEvent
        fields = '__all__'
        read_only_fields = ['id', 'created_at']
Viewsets with Permission and Filtering
python
# views.py
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import User, CustomerProfile, LoanApplication, LoanEvent
from .serializers import *
from .permissions import IsAdminOrOwner
from .webhook_utils import trigger_n8n_workflow  # we'll define this later

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrOwner]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['role']
    search_fields = ['username', 'email']

    def get_queryset(self):
        # Admin sees all; users see only themselves
        if self.request.user.role == 'admin':
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

class CustomerProfileViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerProfileSerializer
    permission_classes = [IsAdminOrOwner]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['employment_status']
    search_fields = ['full_name', 'email', 'phone']

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return CustomerProfile.objects.all()
        # Regular users see only customers linked to their loans
        return CustomerProfile.objects.filter(loans__officer=self.request.user).distinct()

class LoanApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = LoanApplicationSerializer
    permission_classes = [IsAdminOrOwner]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'customer']
    search_fields = ['customer__full_name', 'customer__email']
    ordering_fields = ['applied_at', 'amount']

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return LoanApplication.objects.all()
        # Users see loans they are officer of, or loans of customers linked to them
        return LoanApplication.objects.filter(
            models.Q(officer=self.request.user) |
            models.Q(customer__user=self.request.user)
        ).distinct()

    def perform_create(self, serializer):
        # Automatically set the officer if not provided
        loan = serializer.save()
        # Trigger n8n workflow for new loan application
        trigger_n8n_workflow('loan_created', {'loan_id': str(loan.id)})

    @action(detail=True, methods=['post'])
    def change_status(self, request, pk=None):
        loan = self.get_object()
        new_status = request.data.get('status')
        if new_status not in dict(LoanApplication.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        old_status = loan.status
        loan.status = new_status
        loan.save()
        # Log event
        LoanEvent.objects.create(
            loan=loan,
            event_type='status_changed',
            description=f'Status changed from {old_status} to {new_status}',
            metadata={'old': old_status, 'new': new_status}
        )
        # Trigger n8n workflow
        trigger_n8n_workflow('loan_status_changed', {
            'loan_id': str(loan.id),
            'old_status': old_status,
            'new_status': new_status
        })
        return Response({'status': 'status updated'})

class LoanEventViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LoanEventSerializer
    permission_classes = [IsAdminOrOwner]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return LoanEvent.objects.all()
        # Users see events for loans they can access
        return LoanEvent.objects.filter(loan__in=LoanApplication.objects.filter(
            models.Q(officer=self.request.user) | models.Q(customer__user=self.request.user)
        )).distinct()
Dashboard Endpoints
For dashboards, we can add custom actions or separate views that aggregate data.

python
# views.py (add inside appropriate viewset or as a separate view)
from django.db.models import Count, Sum
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard(request):
    if request.user.role != 'admin':
        return Response({'error': 'Admin only'}, status=403)
    data = {
        'total_loans': LoanApplication.objects.count(),
        'total_customers': CustomerProfile.objects.count(),
        'total_disbursed': LoanApplication.objects.filter(status='disbursed').aggregate(Sum('amount'))['amount__sum'] or 0,
        'loans_by_status': LoanApplication.objects.values('status').annotate(count=Count('id')),
        'recent_events': LoanEvent.objects.order_by('-created_at')[:10].values('event_type', 'created_at', 'loan_id')
    }
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_dashboard(request):
    # For a regular user (officer or customer)
    if request.user.role == 'admin':
        # Admin could also see this but we might redirect
        pass
    loans = LoanApplication.objects.filter(
        models.Q(officer=request.user) | models.Q(customer__user=request.user)
    )
    data = {
        'my_loans_count': loans.count(),
        'my_loans_by_status': loans.values('status').annotate(count=Count('id')),
        'total_borrowed': loans.filter(status='disbursed').aggregate(Sum('amount'))['amount__sum'] or 0,
        'recent_loans': loans.order_by('-applied_at')[:5].values('id', 'amount', 'status', 'applied_at')
    }
    return Response(data)
5. Integration with n8n via Webhooks
We'll create a utility module to trigger n8n workflows whenever a significant event occurs. Also, n8n can send data back to DRF via its own webhook endpoints.

5.1 Outgoing Webhooks (DRF → n8n)
python
# webhook_utils.py
import requests
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def trigger_n8n_workflow(event_name, payload):
    """
    Send an event to n8n webhook.
    Configure N8N_WEBHOOK_BASE_URL in settings, e.g. https://n8n.example.com/webhook/
    """
    webhook_url = f"{settings.N8N_WEBHOOK_BASE_URL}{event_name}"
    try:
        response = requests.post(webhook_url, json=payload, timeout=5)
        response.raise_for_status()
    except Exception as e:
        logger.error(f"Failed to trigger n8n workflow {event_name}: {e}")
Call this function inside model signals or viewset perform_create (as shown earlier). For example, you could also hook into Django signals:

python
# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import LoanApplication, LoanEvent
from .webhook_utils import trigger_n8n_workflow

@receiver(post_save, sender=LoanApplication)
def loan_saved_handler(sender, instance, created, **kwargs):
    if created:
        trigger_n8n_workflow('loan_created', {'loan_id': str(instance.id)})
    else:
        # You might want to detect status changes separately
        pass
5.2 Incoming Webhooks (n8n → DRF)
n8n can call back to DRF to update data, e.g., after credit check or AI decision. Create dedicated endpoints for these callbacks.

python
# views.py (add to a separate viewset or function-based views)
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

@csrf_exempt
def n8n_webhook(request, action):
    """
    Generic endpoint for n8n callbacks.
    Actions: 'update_loan', 'add_event', etc.
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    if action == 'update_loan':
        loan_id = data.get('loan_id')
        try:
            loan = LoanApplication.objects.get(id=loan_id)
        except LoanApplication.DoesNotExist:
            return JsonResponse({'error': 'Loan not found'}, status=404)
        # Update fields as sent by n8n
        for field, value in data.items():
            if field in ['status', 'interest_rate', 'amount'] and hasattr(loan, field):
                setattr(loan, field, value)
        loan.save()
        # Log event
        LoanEvent.objects.create(
            loan=loan,
            event_type='workflow_triggered',
            description='Updated via n8n callback',
            metadata=data
        )
        return JsonResponse({'status': 'ok'})

    elif action == 'add_event':
        loan_id = data.get('loan_id')
        try:
            loan = LoanApplication.objects.get(id=loan_id)
        except LoanApplication.DoesNotExist:
            return JsonResponse({'error': 'Loan not found'}, status=404)
        event = LoanEvent.objects.create(
            loan=loan,
            event_type=data.get('event_type', 'workflow_triggered'),
            description=data.get('description', ''),
            metadata=data.get('metadata', {})
        )
        return JsonResponse({'event_id': str(event.id)})

    else:
        return JsonResponse({'error': 'Unknown action'}, status=400)
Then wire these in urls.py:

python
# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, CustomerProfileViewSet, LoanApplicationViewSet, LoanEventViewSet, n8n_webhook, admin_dashboard, user_dashboard

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'customers', CustomerProfileViewSet)
router.register(r'loans', LoanApplicationViewSet)
router.register(r'events', LoanEventViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/dashboard/admin/', admin_dashboard, name='admin-dashboard'),
    path('api/dashboard/user/', user_dashboard, name='user-dashboard'),
    path('api/webhook/n8n/<str:action>/', n8n_webhook, name='n8n-webhook'),
]
6. Tracking Customer Journey & Debt Growth
The LoanEvent model already captures every notable event. To track debt growth, we can:

Store each payment as an event with amount in metadata.

Compute current outstanding balance by subtracting total payments from disbursed amount.

Create a periodic task (Celery beat or n8n scheduled workflow) that calculates accrued interest and updates a current_balance field, or simply compute on the fly in a view.

Example method on LoanApplication:

python
# models.py
from django.db import models
from decimal import Decimal

class LoanApplication(models.Model):
    # ... fields ...
    def current_balance(self):
        if not self.disbursed_at or self.status not in ['disbursed', 'approved']:
            return Decimal('0.00')
        # Simple interest calculation (for illustration)
        days_since_disbursement = (timezone.now() - self.disbursed_at).days
        daily_rate = self.interest_rate / Decimal('100') / Decimal('365')
        accrued_interest = self.amount * daily_rate * days_since_disbursement
        total_due = self.amount + accrued_interest
        return total_due - self.total_paid
You can expose this via a serializer field.

7. AI Integration
AI engines can be triggered by n8n workflows. For example:

A new loan application triggers an n8n workflow.

n8n calls an external AI service (e.g., credit scoring model) with customer data.

AI service returns a score or decision.

n8n calls back to DRF (/api/webhook/n8n/update_loan/) to update the loan status or add an event with the AI decision.

DRF logs the AI event and possibly triggers further workflows.

The webhook payload should include a well-defined structure agreed upon between DRF and n8n.

8. Environment & Deployment Considerations
Use environment variables for sensitive data: database URL, secret key, n8n webhook base URL, etc.

Consider using Docker to containerize DRF, Next.js, PostgreSQL, and n8n for easy deployment.

For production, use Gunicorn + Nginx for DRF, and ensure HTTPS.

Set up CORS in DRF to allow Next.js origin.

Use Django's built‑in logging to monitor webhook failures.

Example .env for DRF:

text
SECRET_KEY=your-secret-key
DEBUG=False
DATABASE_URL=postgres://user:pass@db:5432/loanapp
N8N_WEBHOOK_BASE_URL=https://n8n.example.com/webhook/
9. Summary
This architecture gives you:

A clean separation between the frontend (Next.js), backend (DRF), and workflow automation (n8n).

Role‑based access control with admin and user roles, enforced at both view and object levels.

Comprehensive tracking of customer/loan lifecycle via LoanEvent.

Easy integration with AI services through n8n and webhooks.

Scalable database schema and RESTful APIs.

The backend logic is implemented with Django best practices, ensuring maintainability and extensibility. The next step would be to set up the n8n workflows that listen to the events emitted by DRF and orchestrate the necessary business processes (onboarding, credit checks, notifications, etc.).