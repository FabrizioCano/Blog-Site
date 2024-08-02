from typing import Any
from django.contrib.auth.models import User
from django.http.response import HttpResponse as HttpResponse
from django.views.generic import DetailView,View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpRequest, JsonResponse,HttpResponseBadRequest
from feed.models import Post
from followers.models import Follower
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required

from .forms import UpdateUserForm, UpdateProfileForm
class ProfileDetailView(DetailView):
    http_method_names=["get"]
    template_name="profiles/detail.html"
    model=User
    context_object_name="user"
    """ como se buscara al usuario """
    slug_field="username"
    """ viene del path de urls en profiles """
    slug_url_kwarg="username"
    
    def dispatch(self, request,*args,**kwargs):
        self.request=request
        return super().dispatch(request, *args, **kwargs)
    
    def get_context_data(self, **kwargs):
        user=self.get_object()
        following=Follower.objects.filter(followed_by=self.request.user).count()
        context=super().get_context_data(**kwargs)
        context['total_posts']=Post.objects.filter(author=user).count()
        context['total_followers']=following
        
        if self.request.user.is_authenticated:
            context['you_follow']=Follower.objects.filter(following=user,followed_by=self.request.user).exists()
        
        return context
class FollowView(LoginRequiredMixin,View):
    http_method_names=["post"]
    def post(self,request,*args,**kwargs):
        data=request.POST.dict()
        
        if 'action' not in data or "username" not in data:
            return HttpResponseBadRequest("Missing Data")
        
        try:
            other_user=User.objects.get(username=data['username'])
        except User.DoesNotExist:
            return HttpResponseBadRequest("Missing User") 
        
        if data['action']=='follow':
            follower,created=Follower.objects.get_or_create(followed_by=request.user,following=other_user)
        else:
            try:
                follower=Follower.objects.get(followed_by=request.user,following=other_user)
            except Follower.DoesNotExist:
                follower=None
            
            if follower:
                follower.delete()
        return JsonResponse ({
            'sucess':True,
            'wording':"Unfollow" if data['action']=="follow" else "Follow"
        })



#importar los forms y crear instancias ya sea get o post. Si se solicita el formulario (post) , se debe pasar la informacion del request post a los formularios. Para el perfil existe una foto (en request.FORMS)

def update_profile(request):
    if request.method == 'POST':
        user_form = UpdateUserForm(request.POST, instance=request.user)
        profile_form = UpdateProfileForm(request.POST, request.FILES, instance=request.user.profile)

        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            messages.success(request, 'Your profile is updated successfully')
            return redirect(to='/')
    else:
        user_form = UpdateUserForm(instance=request.user)
        profile_form = UpdateProfileForm(instance=request.user.profile)

    return render(request, 'registration/profile.html', {'user_form': user_form, 'profile_form': profile_form})
        
