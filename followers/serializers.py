from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Follower

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class FollowerSerializer(serializers.ModelSerializer):
    followed_by = UserSerializer(read_only=True)
    following = UserSerializer(read_only=True)

    class Meta:
        model = Follower
        fields = ['id', 'followed_by', 'following']
