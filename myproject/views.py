
from django.contrib import messages
from django.contrib.auth.forms import UserCreationForm,AuthenticationForm
from django.shortcuts import render, redirect 
from django.contrib.auth import login, logout,authenticate
from .forms import LoginUser


def login_view(request): 
    if request.method == "POST": 
        form = LoginUser(request.POST)
        if form.is_valid(): 
            username=form.cleaned_data.get('username')
            password=form.cleaned_data.get('password')
            user_login=authenticate(username=username,password=password)
            if user_login is not None:
                login(request, username)
                messages.success(request,'WELCOME'+ username)
                return redirect("/")
    else: 
        form = LoginUser()
    return render(request, "registration/login.html", { "form": form })