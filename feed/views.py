from typing import Any
from django.db.models.query import QuerySet
from django.views.generic import ListView,DetailView,TemplateView
from django.views.generic.edit import CreateView
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Post
from followers.models import Follower
from django.shortcuts import render
from django.contrib.auth.forms import UserCreationForm



# Create your views here.
class HomePage(TemplateView):
    http_method_names=["get"]
    template_name="feed/homepage.html"
    
    def dispatch(self, request, *args, **kwargs):
        self.request=request
        return super().dispatch(request, *args, **kwargs)
    
    
    def get_context_data(self,*args,**kwargs):
        context=super().get_context_data(*args,**kwargs)
        
        if self.request.user.is_authenticated:
            #obtener una lista de los usuarios a los que seguimos
            following=list(Follower.objects.filter(followed_by=self.request.user).values_list('following',flat=True))
            if not following:
                posts=Post.objects.all().order_by('-id')[0:30]
            else:
                posts=Post.objects.filter(author__in=following).order_by('-id')[0:60]
        else:
            posts=Post.objects.all().order_by('-id')[0:30]
        context['posts']=posts
        return context
    
    #override queryset
    """ def get_queryset(self) -> QuerySet[Any]:
        return super().get_queryset()  """
class PostDetailView(DetailView):
    http_method_names=["get"]
    template_name="feed/detail.html"
    model=Post
    context_object_name="post"

class CreateNewPost(LoginRequiredMixin, CreateView):
    model = Post
    template_name = "feed/create.html"
    fields = ['text']
    success_url = "/"

    def dispatch(self, request, *args, **kwargs):
        self.request = request
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        obj = form.save(commit=False)
        obj.author = self.request.user
        obj.save()
        return super().form_valid(form)
    def post(self, request, *args, **kwargs):
        # TODO: There is a bug here when you go to /new/ to create a post.
        # You must figure out how to determine if this is an Ajax request (or not an ajax request).
        post = Post.objects.create(
            text=request.POST.get("text"),
            author=request.user,
        )

        return render(
            request,
            "includes/post.html",
            {
                "post": post,
                "show_detail_link": True,
            },
            content_type="application/html"
        )