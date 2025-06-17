from django.urls import path
from .api_views import PostListAPIView, PostCreateAPIView, PostDetailAPIView

urlpatterns = [
    path('posts/', PostListAPIView.as_view(), name='api-post-list'),
    path('posts/create/', PostCreateAPIView.as_view(), name='api-post-create'),
    path('posts/<int:pk>/', PostDetailAPIView.as_view(), name='api-post-detail'),
]
