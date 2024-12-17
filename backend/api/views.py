from django.http import HttpResponse
from django.conf import settings
from django.core.cache import cache
from django.contrib.auth import get_user_model
User = get_user_model()

from rest_framework.decorators import api_view
from rest_framework.permissions import (
    IsAuthenticatedOrReadOnly,
    IsAuthenticated,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_400_BAD_REQUEST,
    HTTP_201_CREATED,
    HTTP_500_INTERNAL_SERVER_ERROR
)
from rest_framework.exceptions import (
    NotFound,
    ValidationError
)
from rest_framework.generics import (
    ListCreateAPIView,
    CreateAPIView,
    ListAPIView,
    RetrieveAPIView,
)

from .serializers import (
    RestPasswordSerializer,
    TokenSerializer,
    RegisterSerializer,
    VerifyAccountSerializer,
    ProductSerializer,
    TokenSerializerTwo,
)
from .models import (
    Product,
    Category,
)
from .utils import (
    send_reset_email,
    send_verification_email,
    send_account_verified_email
)

from django.http import HttpResponse
from datetime import timedelta, datetime
from rest_framework_simplejwt.tokens import RefreshToken

class IsAuthenticatedView(APIView):
    permission_classes = (IsAuthenticated, )
    def get(self, request, *args, **kwargs):
        return Response({}, HTTP_200_OK)

class ProductListCreateAPIView(ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (IsAuthenticatedOrReadOnly, )

class ProductRetrieveAPIView(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = "slug"

@api_view(["get", ])
def get_category_name(request, pk=None):
    try:
        category = Category.objects.get(pk=pk)

        return Response({"name": category.name}, HTTP_200_OK)
    except:
        raise NotFound(f"Category with this id ({pk}) does not exists")

class RegisterUserCreateAPIView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.filter(email=response.data['email']).first()
        try:
            send_verification_email(user.username, user.email, user.verification_code)
        except:
            raise ValidationError({'detail': "SMTP error"}, HTTP_500_INTERNAL_SERVER_ERROR)
        
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        
        del response.data['email']
        response.data['access'] = str(access)
        response.data['refresh'] = str(refresh)

        return response
    
@api_view(['post'])
def verify_account_view(request):
    data = request.data 
    serializer = VerifyAccountSerializer(data=data)
    if serializer.is_valid(raise_exception=True):
        validated_data = serializer.save()
        user = User.objects.filter(verification_code=validated_data["code"]).first()
        user.is_active = True
        user.verification_code = None
        user.verification_code_expires_at = None
        user.save()

        try:
            send_account_verified_email(user.username, user.email)
            return Response({"detail": "Account verified"}, HTTP_200_OK)
        except:
            raise ValidationError({'detail': "SMTP error"}, HTTP_500_INTERNAL_SERVER_ERROR)

    
    return Response(serializer.errors, HTTP_400_BAD_REQUEST)

class CheckTokenAPIView(APIView):
    def post(self, request):
        data = request.data
        serializer = TokenSerializerTwo(data=data) 
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)

@api_view(['POST', ])
def rest_password_done_view(request, token=None):
    if token:
        data = request.data
        data["token"] = token
        serializer = TokenSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({"detail": "password updated successfully"}, HTTP_200_OK)
        
        return Response(serializer.errors, HTTP_400_BAD_REQUEST)
    
    return Response({}, HTTP_400_BAD_REQUEST)

@api_view(['post', ])
def rest_password_view(request):
    data = request.data
    serializer = RestPasswordSerializer(data=data)
    if serializer.is_valid(raise_exception=True):
        recipient_email = serializer.validated_data['email']
        try:
            send_reset_email(request=request, recipient=recipient_email)
            return Response({'detail': "an email has been sent to your email"}, HTTP_200_OK)
        except:
            raise ValidationError({'detail': "SMTP error"}, HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(serializer.errors, HTTP_400_BAD_REQUEST)


