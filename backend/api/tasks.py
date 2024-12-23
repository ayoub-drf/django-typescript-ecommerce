from celery import shared_task
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from datetime import datetime, timedelta
import pytz
from django.template.loader import render_to_string
from django.contrib.auth import get_user_model
from django.utils.crypto import get_random_string

User = get_user_model()



@shared_task
def send_reset_email(request, recipient):
    to = recipient
    user = User.objects.filter(email=to).first()
    token = get_random_string(60)
    user.reset_password_token = token
    user.reset_password_token_expires_at = datetime.now(pytz.UTC) + timedelta(minutes=20)
    user.save()
    subject = "Reset Your Password"
    from_email = settings.EMAIL_HOST_USER
    
    protocol = 'https' if request.is_secure() else 'http'
    host = request.get_host()
    rest_link = f"http://localhost:5173/reset-password-done/{token}/"

    context = {
        'username': user.username,
        'token': rest_link,
    }

    html_content = render_to_string("emails/reset-password.html", context=context)
    text_content = strip_tags(html_content)
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
    msg.attach_alternative(html_content, "text/html")
    msg.send()


@shared_task
def send_order_success(email, name):
    subject = "Order Completed"
    from_email = settings.EMAIL_HOST_USER

    html_content = render_to_string("emails/order-completed.html", {"name": name})
    text_content = strip_tags(html_content)
    msg = EmailMultiAlternatives(subject, text_content, from_email, [email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()

@shared_task
def send_account_verified_email(username, recipient):
    print('send_account_verified_email ...')
    subject = "Account Verified From Celery"
    from_email = settings.EMAIL_HOST_USER
    html_content = render_to_string("emails/verified_email.html", {"username": username})
    text_content = strip_tags(html_content)
    msg = EmailMultiAlternatives(subject, text_content, from_email, [recipient])
    msg.attach_alternative(html_content, "text/html")
    msg.send()

@shared_task
def send_verification_email(username, recipient, code):
    print('send_verification_email ...')
    to = recipient
    subject = "Verification Code"
    from_email = settings.EMAIL_HOST_USER
    context = {
        "username": username,
        "code": code
    }
    html_content = render_to_string("emails/verification-email.html", context=context)
    text_content = strip_tags(html_content)

    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
    msg.attach_alternative(html_content, "text/html")
    msg.send()