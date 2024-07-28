from typing import Any
from django.contrib.auth.models import User
from django.views.generic import DetailView

from feed.models import Post
class ProfileDetailView(DetailView):
    http_method_names=["get"]
    template_name="profiles/detail.html"
    model=User
    context_object_name="user"
    """ como se buscara al usuario """
    slug_field="username"
    """ viene del path de urls en profiles """
    slug_url_kwarg="username"
    
    def get_context_data(self, **kwargs):
        user=self.get_object()
        context=super().get_context_data(**kwargs)
        context['total_posts']=Post.objects.filter(author=user).count()
        return context