from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserViewSet, CustomerProfileViewSet, LoanApplicationViewSet, LoanEventViewSet, n8n_webhook, admin_dashboard, user_dashboard

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'customers', CustomerProfileViewSet)
router.register(r'loans', LoanApplicationViewSet)
router.register(r'events', LoanEventViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('dashboard/admin/', admin_dashboard, name='admin-dashboard'),
    path('dashboard/user/', user_dashboard, name='user-dashboard'),
    path('webhook/n8n/<str:action>/', n8n_webhook, name='n8n-webhook'),
]