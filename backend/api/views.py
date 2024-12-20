from django.conf import settings
import stripe
import stripe.error
stripe.api_key = settings.STRIPE_SECRET_KEY
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
client_id = settings.GOOGLE_CLIENT_ID

from django.utils.crypto import get_random_string


from .tokens import (
    generate_access_refresh_tokens
)


from django.http import HttpResponse
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
    ValidationError,
    ParseError,
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
    Order,
    OrderItems
)
from .utils import (
    send_reset_email,
    send_verification_email,
    send_account_verified_email,
    send_order_success,
    download_image_from_web,
)
import json

from django.http import HttpResponse
from datetime import timedelta, datetime
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

endpoint_secret = settings.STRIPE_WEBHOOK_SECRET


class STRIPE_WEBHOOK(APIView):
    def post(self, request):
        payload = request.body
        sig_header = request.META['HTTP_STRIPE_SIGNATURE']
        event = None

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except ValueError as e:
            return Response({}, HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError as e:
            return Response({}, HTTP_400_BAD_REQUEST)
        

    
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            customer_email = session['customer_email']
            order_id = session['metadata']['order_id']
            customer_name = session['customer_details']['name']
            try:
                order = Order.objects.get(id=order_id)
                order.completed = True
                order.save()
                send_order_success(customer_email, customer_name)
            except:
                pass

        return Response({}, HTTP_200_OK)
    

class CreateCheckoutSession(APIView):
    def post(self, request, *args, **kwargs):
        cart = request.data['cart']
        if not isinstance(cart, dict):
            cart = json.loads(cart)

        order, _ = Order.objects.get_or_create(
            email=request.data['email'],
            address=request.data['address'],
            postalCode=request.data['postalCode'],
        )
            
        for i, v in cart.items():
            try:
                product = Product.objects.get(id=i)
                order_items, _ = OrderItems.objects.get_or_create(
                    product=product,
                    order=order,
                    quantity=v["quantity"],
                )
            except:
                pass
        total_price = int(order.total_price() * 100)
        # print(total_price)
        session = stripe.checkout.Session.create(
            line_items=[{
            'price_data': {
                'currency': 'usd',
                'product_data': {
                'name': 'T-shirt',
                },
                'unit_amount': total_price,
            },
            'quantity': 1,
            }],
            mode='payment',
            success_url='http://localhost:5173/success/',
            cancel_url='http://localhost:5173/cancel/',
            customer_email=f"{order.email}",
            metadata={
                'order_id': f"{order.id}"
            }
        )
        return Response({'id': session.id}, HTTP_200_OK)

class GoogleLoginAPIView(APIView):
    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({'error': 'Token is required.'}, HTTP_400_BAD_REQUEST)
        
        try:
            id_info = id_token.verify_oauth2_token(token, google_requests.Request(), client_id)
            email = id_info['email']
            name = id_info['name']
            picture = id_info['picture']
            google_id = id_info['sub']

            if User.objects.filter(google_id=google_id, email=email).exists():
                user = User.objects.get(google_id=google_id)
                tokens = generate_access_refresh_tokens(user)
                return Response(tokens, HTTP_200_OK)
            
            count = 1
            while User.objects.filter(username=name).exists():
                name = f"{name}{count}"
        
            if picture:
                image = download_image_from_web(picture)

            user = User.objects.create(
                email=email,
                username=name,
                avatar=image,
                google_id=google_id,
            )
            user.set_password(get_random_string(15))
            user.save()
            tokens = generate_access_refresh_tokens(user)
            return Response(tokens, HTTP_201_CREATED)

        except:
            raise Response({"error": "Bad request"}, HTTP_400_BAD_REQUEST)

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


