from rest_framework.throttling import (
    UserRateThrottle,
    AnonRateThrottle
)


class CustomAnonRateThrottle(AnonRateThrottle):
    rate = "1000/day"

class CustomUserRateThrottle(UserRateThrottle):
    rate = "5000/day"