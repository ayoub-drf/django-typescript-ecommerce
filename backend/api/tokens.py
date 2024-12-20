from rest_framework_simplejwt.tokens import RefreshToken

def generate_access_refresh_tokens(user):
    refresh = RefreshToken.for_user(user)
    access = refresh.access_token

    return {
        'access': str(access),
        'refresh': str(refresh),
    }