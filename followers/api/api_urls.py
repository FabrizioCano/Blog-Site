from django.urls import path
from .api_views import FollowersListAPIView, FollowingListAPIView, FollowUnfollowAPIView


urlpatterns = [
    path('follow-unfollow/', FollowUnfollowAPIView.as_view(), name='follow-unfollow'),  
    path('<str:username>/', FollowersListAPIView.as_view(), name='followers-list'),  
    path('following/<str:username>/', FollowingListAPIView.as_view(), name='following-list'),
]