"""
Development mode authentication classes.
Bypasses JWT authentication in development for easier testing.
"""
from django.conf import settings
from rest_framework import authentication, exceptions
from rest_framework_simplejwt.authentication import JWTAuthentication


class DevAuthentication(authentication.BaseAuthentication):
    """
    In development mode, accepts any request and either:
    1. Uses existing JWT token if provided
    2. Auto-authenticates as admin user if no token provided
    
    Should ONLY be used in development. Set DEVELOPMENT_MODE=False in production.
    """

    def authenticate(self, request):
        if not getattr(settings, 'DEVELOPMENT_MODE', False):
            return None

        # If there's already a token, use standard JWT auth
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if auth_header.startswith('Bearer '):
            jwt_auth = JWTAuthentication()
            try:
                return jwt_auth.authenticate(request)
            except exceptions.AuthenticationFailed:
                pass

        # In dev mode with no token, allow access (permission class will handle it)
        return None

    def authenticate_header(self, request):
        return 'Bearer'
