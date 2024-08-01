
from django.contrib import messages
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect 
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm 
from django.contrib.auth import login, logout


def login_view(request): 
    if request.method == "POST": 
        form = AuthenticationForm(data=request.POST)
        if form.is_valid(): 
            user=form.get_user()
            login(request, user)
            messages.success(request,'WELCOME'+ user)
            return redirect("/")
    else: 
        form = AuthenticationForm()
    return render(request, "templates/registration/login.html", { "form": form })