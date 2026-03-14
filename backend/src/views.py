from rest_framework import viewsets, filters, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Sum, Q
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from .models import User, CustomerProfile, LoanApplication, LoanEvent
from .serializers import *
from .permissions import IsAdminOrOwner
from .webhook_utils import trigger_n8n_workflow


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
    queryset = CustomerProfile.objects.all()  # Add this

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
    queryset = LoanApplication.objects.all()  # Add this

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return LoanApplication.objects.all()
        # Users see loans they are officer of, or loans of customers linked to them
        return LoanApplication.objects.filter(
            Q(officer=self.request.user) |
            Q(customer__user=self.request.user)
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
    queryset = LoanEvent.objects.all()  # Add this

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return LoanEvent.objects.all()
        # Users see events for loans they can access
        return LoanEvent.objects.filter(loan__in=LoanApplication.objects.filter(
            Q(officer=self.request.user) | Q(customer__user=self.request.user)
        )).distinct()


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
        Q(officer=request.user) | Q(customer__user=request.user)
    )
    data = {
        'my_loans_count': loans.count(),
        'my_loans_by_status': loans.values('status').annotate(count=Count('id')),
        'total_borrowed': loans.filter(status='disbursed').aggregate(Sum('amount'))['amount__sum'] or 0,
        'recent_loans': loans.order_by('-applied_at')[:5].values('id', 'amount', 'status', 'applied_at')
    }
    return Response(data)


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