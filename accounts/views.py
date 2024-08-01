
from django.contrib.auth.forms import UserCreationForm
from django.http.response import HttpResponse as HttpResponse
from django.urls import reverse_lazy
from django.contrib import messages
from django.urls import reverse_lazy
from django.contrib.auth.views import PasswordResetView
from django.contrib.messages.views import SuccessMessageMixin
from django.shortcuts import render, redirect 
from .forms import CreateUserForm
from django.contrib.auth.views import PasswordChangeDoneView,PasswordChangeView,PasswordResetDoneView
def signup_form(request):
    form=CreateUserForm()
    if request.method == "POST": 
        form = CreateUserForm(request.POST) 
        if form.is_valid(): 
            form.save()
            user=form.cleaned_data.get('username')
            messages.success(request,"Account created for "+user)
            return redirect('login')
            
    return render(request, "registration/signup.html", { "form": form })


# Create your views here.
class ResetPasswordView(SuccessMessageMixin, PasswordResetView):
    template_name = 'registration/password_reset.html'
    email_template_name = 'registration/password_reset_email.html'
    subject_template_name = 'registration/password_reset_subject'
    success_message = "We've emailed you instructions for setting your password, " \
                      "if an account exists with the email you entered. You should receive them shortly." \
                      " If you don't receive an email, " \
                      "please make sure you've entered the address you registered with, and check your spam folder."
    success_url = reverse_lazy('/')
class PasswordChangeV(PasswordChangeView):
    template_name="registration/password_change_form.html"
    success_url=reverse_lazy('accounts:password-change-done-view')
class PasswordChangeDone(PasswordChangeDoneView):
    template_name="registration/password_change_done.html"
    


