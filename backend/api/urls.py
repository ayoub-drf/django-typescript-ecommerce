from django.urls import path, include
from .views import (
    rest_password_view,
    rest_password_done_view,
    RegisterUserCreateAPIView,
    verify_account_view,
    ProductListCreateAPIView,
    ProductRetrieveAPIView,
    get_category_name,
    IsAuthenticatedView,
    CheckTokenAPIView,
    CreateCheckoutSession,
    STRIPE_WEBHOOK,
    GoogleLoginAPIView,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)



urlpatterns = [
    path('stripe-webhooks/', STRIPE_WEBHOOK.as_view()),
    path('create-checkout-session/', CreateCheckoutSession.as_view()),

    path('auth/google/', GoogleLoginAPIView.as_view()),

    
    path('is-auth/', IsAuthenticatedView.as_view()),

    path('auth/', TokenObtainPairView.as_view(), name="Auth"),
    path('auth/refresh/', TokenRefreshView.as_view(), name="Auth_refresh"),
    path('reset-password/', rest_password_view, name="Reset_password"),
    path('check-token/', CheckTokenAPIView.as_view()),
    path('reset-password-done/<str:token>/', rest_password_done_view, name="Reset_password_done"),

    path('register/', RegisterUserCreateAPIView.as_view(), name="Register"),
    path('verify/', verify_account_view, name="Verify_account"),

    path("products/", ProductListCreateAPIView.as_view(), name="Products"),
    path("products/<str:slug>/", ProductRetrieveAPIView.as_view(), name="Products_detail"),
    
    path("category/<int:pk>/", get_category_name, name="Category"),
]
