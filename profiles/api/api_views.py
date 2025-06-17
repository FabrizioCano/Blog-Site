from rest_framework import generics, permissions
from ..models import Profile
from ..serializers import ProfileSerializer
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from profiles.models import Profile

class ProfileDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        username = self.kwargs.get('username')
        return Profile.objects.get(user__username=username)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context


class ProfileUpdateAPIView(generics.UpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

class FollowUnfollowAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        action = request.data.get("action")
        username = request.data.get("username")

        if action not in ["follow", "unfollow"] or not username:
            return Response(
                {"detail": "Invalid action or missing username."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            target_profile = Profile.objects.get(user__username=username)
        except Profile.DoesNotExist:
            return Response(
                {"detail": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        current_profile = request.user.profile

        if target_profile == current_profile:
            return Response(
                {"detail": "You cannot follow/unfollow yourself."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if action == "follow":
            current_profile.follows.add(target_profile)
        else:
            current_profile.follows.remove(target_profile)

        return Response(
            {"detail": f"Successfully {action}ed {username}."},
            status=status.HTTP_200_OK
        )
        
class CurrentUserProfileAPIView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context