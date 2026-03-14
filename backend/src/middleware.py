"""
Development mode middleware for authentication bypass.
Auto-logs in an admin user in development mode for testing.
"""
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

DEV_USER_USERNAME = 'admin'  # Will auto-create if doesn't exist


class DevAuthMiddleware:
    """
    In development mode, automatically creates/retrieves an admin user
    for testing without authentication redirects.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if getattr(settings, 'DEVELOPMENT_MODE', False):
            # Auto-attach dev user to request for API endpoints
            if request.path.startswith('/api/'):
                try:
                    # Get or create dev user
                    user, created = User.objects.get_or_create(
                        username=DEV_USER_USERNAME,
                        defaults={
                            'email': f'{DEV_USER_USERNAME}@dev.local',
                            'role': 'admin',
                            'is_staff': True,
                            'is_superuser': True,
                        }
                    )
                    if created:
                        user.set_password('admin')
                        user.save()
                    
                    request.user = user
                except Exception as e:
                    # If user creation fails, log and continue
                    print(f"Dev auth middleware error: {e}")

        response = self.get_response(request)
        return response
