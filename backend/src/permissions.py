from rest_framework import permissions
from django.conf import settings


class DevPermission(permissions.BasePermission):
    """
    In development mode, allows all requests without authentication.
    Should ONLY be used in development.
    """

    def has_permission(self, request, view):
        if getattr(settings, 'DEVELOPMENT_MODE', False):
            return True
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if getattr(settings, 'DEVELOPMENT_MODE', False):
            return True
        # Fallback to IsAdminOrOwner logic
        if request.user.role == 'admin':
            return True
        if hasattr(obj, 'officer'):
            return obj.officer == request.user
        if hasattr(obj, 'customer') and hasattr(obj.customer, 'user'):
            return obj.customer.user == request.user
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return False


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