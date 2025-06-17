from rest_framework import serializers
from .models import Profile
from django.contrib.auth.models import User
from feed.models import Post  
from followers.models import Follower  

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    image = serializers.ImageField(required=False)
    total_posts = serializers.SerializerMethodField()
    total_followers = serializers.SerializerMethodField()
    total_following = serializers.SerializerMethodField()  
    is_following = serializers.SerializerMethodField()    

    class Meta:
        model = Profile
        fields = [
            'id',
            'user',
            'image',
            'total_posts',
            'total_followers',
            'total_following',  
            'is_following'      
        ]

    def get_total_posts(self, obj):
        return Post.objects.filter(author=obj.user).count()

    def get_total_followers(self, obj):
        return Follower.objects.filter(following=obj.user).count()

    def get_total_following(self, obj):
        return Follower.objects.filter(followed_by=obj.user).count()

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            current_user = request.user
            
            return Follower.objects.filter(followed_by=current_user, following=obj.user).exists()
        return False
