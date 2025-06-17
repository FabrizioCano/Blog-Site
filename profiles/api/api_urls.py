from django.urls import path
from .api_views import ProfileDetailAPIView, ProfileUpdateAPIView,CurrentUserProfileAPIView

app_name = 'profiles-api'

urlpatterns = [
    path('<str:username>/', ProfileDetailAPIView.as_view(), name='profile-detail'),
    path('me/update/', ProfileUpdateAPIView.as_view(), name='profile-update'),
    path('me/', CurrentUserProfileAPIView.as_view(), name='profile-me'),  
]