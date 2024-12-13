from django.contrib.auth import get_user_model
from django.utils.crypto import get_random_string

from rest_framework import serializers
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_400_BAD_REQUEST
)
from rest_framework.serializers import ValidationError

from .models import (
    Product
)

import pytz
from datetime import datetime, timedelta

User = get_user_model()

class VerifyAccountSerializer(serializers.Serializer):
    code = serializers.CharField()

    def validate_code(self, value):
        user = User.objects.filter(verification_code=value).first()

        if not user:
            raise ValidationError("Invalid code", HTTP_400_BAD_REQUEST) 
        
        current_time = datetime.now(pytz.UTC)

        if user and current_time > user.verification_code_expires_at:
            raise ValidationError("Code expired", HTTP_400_BAD_REQUEST)  

        return value
    
    def create(self, validated_data):
        return validated_data

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {
            'password': {"write_only": True}
        }

    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        user.set_password(validated_data['password'])
        user.is_active = False
        user.verification_code = get_random_string(6)
        user.verification_code_expires_at = datetime.now(pytz.UTC) + timedelta(minutes=20) 
        user.save()
        return user

class RestPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email not found", HTTP_400_BAD_REQUEST) 
        return value
    
class TokenSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=400, required=False)
    password = serializers.CharField(min_length=8)

    def validate_token(self, value):
        user = User.objects.filter(reset_password_token=value).first()
        if not user:
            raise ValidationError("Invalid token")
        
        if user.reset_password_token_expires_at < datetime.now(pytz.UTC):
            raise ValidationError("Token Expired")

        return value
    
    def create(self, validated_data):
        token = validated_data["token"]
        user = User.objects.get(reset_password_token=token)
        user.set_password(validated_data["password"])
        user.reset_password_token = None
        user.reset_password_token_expires_at = None
        user.save()
        return validated_data


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"



