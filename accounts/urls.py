from django.urls import path
from . import views
from .views import PasswordChangeView,PasswordChangeDoneView,ResetPasswordView
from django.contrib.auth import views as auth_views
urlpatterns = [
    path("signup/", views.signup_form, name="signup"),
    
    path("change-password/", PasswordChangeView.as_view(), name="password-change-view"),
    path("change-password/done/", PasswordChangeDoneView.as_view(), name="password-change-done-view"),
    
    
    path('password-reset/', ResetPasswordView.as_view(), name='password_reset'),
    
    path('password-reset-confirm/<uidb64>/<token>/',
         auth_views.PasswordResetConfirmView.as_view(template_name='templates/registration/password_reset_confirm.html'),
         name='password_reset_confirm'),
    
    path('password-reset-complete/',
         auth_views.PasswordResetCompleteView.as_view(template_name='templates/registration/password_reset_complete.html'),
         name='password_reset_complete'),
    

]