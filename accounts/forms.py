from django.forms import ModelForm
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class CreateUserForm(UserCreationForm):
    
    def __init__ (self,*args,**kwargs):
        super().__init__(*args,**kwargs)
        self.fields["username"].widget.attrs.update({
            'id':"username",
            'name':"username",
            'placeholder':"john",
            'type':"text",
            'required':"",
            'class':"flex-1  border border-gray-300 form-input pl-3 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5" 
        })
        
        self.fields["email"].widget.attrs.update({
            'id':"email",
            'name':"email",
            'placeholder':"user@example.com",
            'type':"email",
            'required':"",
            'class':"appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" 
        })
        self.fields["password1"].widget.attrs.update({
            'id':"password",
            'name':"password",
            'placeholder':"*****",
            'type':"password",
            'required':"",
            'class':"appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" 
        })
        self.fields["password2"].widget.attrs.update({
            'id':"password_confirmation",
            'name':"password_confirmation",
            'placeholder':"",
            'type':"password",
            'required':"",
            'class':"appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" 
        })
        
        
    class Meta:
        model=User
        fields=['username','email','password1','password2']