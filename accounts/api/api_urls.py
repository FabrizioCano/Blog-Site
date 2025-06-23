from django.urls import path
from .api_views import RegisterView, PasswordChangeAPIView
from .api_views import CustomTokenObtainPairView,GoogleLoginView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('password-change/', PasswordChangeAPIView.as_view(), name='password_change'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("google/", GoogleLoginView.as_view(), name="google-login"),
]
