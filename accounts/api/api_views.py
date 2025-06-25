
from rest_framework import generics

from feed import serializers
from profiles.models import Profile
from ..serializers import RegisterSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from ..serializers import CustomTokenObtainPairSerializer
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.password_validation import validate_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
import os
from dotenv import load_dotenv
load_dotenv()
User = get_user_model()

class GoogleLoginView(APIView):
    def post(self, request):
        token = request.data.get("token")
        if not token:
            return Response({"detail": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                os.getenv("GOOGLE_SSO_CLIENT_ID")
            )

            email = idinfo.get("email")
            name = idinfo.get("name") or email.split("@")[0]
            sub = idinfo.get("sub")  

            if not email:
                return Response({"detail": "Email not found in Google token"}, status=400)

            user, created = User.objects.get_or_create(email=email, defaults={
                "username": email.split("@")[0],
                "is_active": True,
            })

            # Actualizar username si no existe o está vacío (también usuarios ya existentes)
            if not user.username or user.username.strip() == "":
                base_username = name.replace(" ", "").lower()
                username = base_username
                counter = 1
                while User.objects.filter(username=username).exclude(pk=user.pk).exists():
                    username = f"{base_username}{counter}"
                    counter += 1
                user.username = username
                user.save()

            profile, profile_created = Profile.objects.get_or_create(user=user)

            refresh = RefreshToken.for_user(user)
            refresh["username"] = user.username
    

            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username,
                "user_id": user.id,
            })

        except ValueError as e:
            print(f"[GoogleLogin] Token verification failed: {e}")
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]



class PasswordChangeAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        new_password2 = request.data.get('new_password2')
        
        if not user.check_password(old_password):
            return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
        
        if new_password != new_password2:
            return Response({"new_password": ["Passwords do not match."]}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            validate_password(new_password, user)
        except serializers.ValidationError as e:
            return Response({"new_password": e.messages}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.save()
        
        return Response({"detail": "Password updated successfully."})


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
