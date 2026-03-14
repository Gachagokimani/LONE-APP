from django.contrib import admin
from .models import User, CustomerProfile, LoanApplication, LoanEvent

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'role', 'phone']
    list_filter = ['role']
    search_fields = ['username', 'email']

@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'phone', 'employment_status', 'monthly_income']
    list_filter = ['employment_status']
    search_fields = ['full_name', 'email', 'phone']

@admin.register(LoanApplication)
class LoanApplicationAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'officer', 'amount', 'status', 'applied_at']
    list_filter = ['status', 'applied_at']
    search_fields = ['customer__full_name', 'customer__email']

@admin.register(LoanEvent)
class LoanEventAdmin(admin.ModelAdmin):
    list_display = ['loan', 'event_type', 'created_at']
    list_filter = ['event_type', 'created_at']
    search_fields = ['loan__id']