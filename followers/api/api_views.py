from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from ..models import Follower
from ..serializers import FollowerSerializer
from profiles.models import Profile

class FollowersListAPIView(generics.ListAPIView):
    """
    List users who follow the given user (username).
    """
    serializer_class = FollowerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        username = self.kwargs['username']
        return Follower.objects.filter(following__username=username)

class FollowingListAPIView(generics.ListAPIView):
    """
    List users that the given user (username) is following.
    """
    serializer_class = FollowerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        username = self.kwargs['username']
        return Follower.objects.filter(followed_by__username=username)


class FollowUnfollowAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        action = request.data.get("action")
        username = request.data.get("username")

        if action not in ["follow", "unfollow"] or not username:
            return Response({"detail": "Invalid action or missing username."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            target_user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        current_user = request.user

        if target_user == current_user:
            return Response({"detail": "You cannot follow/unfollow yourself."}, status=status.HTTP_400_BAD_REQUEST)

        if action == "follow":
            # Crear la relación si no existe
            follower_relation, created = Follower.objects.get_or_create(followed_by=current_user, following=target_user)
            if created:
                return Response({"detail": f"Successfully followed {username}."}, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Already following."}, status=status.HTTP_200_OK)
        else:
            # Eliminar la relación si existe
            deleted, _ = Follower.objects.filter(followed_by=current_user, following=target_user).delete()
            if deleted:
                return Response({"detail": f"Successfully unfollowed {username}."}, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "You were not following this user."}, status=status.HTTP_200_OK)
