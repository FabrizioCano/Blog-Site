from django.urls import path
from . import views
from .views import update_profile

app_name="profiles"

urlpatterns=[
    path("profile_update/", views.update_profile, name="profile_update"),
    path("<str:username>/",views.ProfileDetailView.as_view(),name="detail"),
    path("<str:username>/follow/",views.FollowView.as_view(),name="follow"),
   
]