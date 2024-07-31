from django.shortcuts import render,redirect
from django.contrib.auth import login,authenticate,logout
from django.contrib import messages
from django.contrib.auth.forms import UserCreationForm
from .forms import CreateUserForm

# Create your views here.

def login_page(request): 
    context={}
    return render(request,'account/login.html',context)
def register_page(request):
    form=CreateUserForm()
    if request.method=="POST":
        form=CreateUserForm(request.POST)
        if form.is_valid():
            form.save()
    
    
    context={'form':form}
    return render(request,'account/register.html',context)