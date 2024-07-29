from django.contrib import admin

from .models import Follower
# Register your models here.

class FollowerAdmin(admin.ModelAdmin):
    pass


admin.site.register(Follower,FollowerAdmin)