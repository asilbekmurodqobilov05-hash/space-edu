import logging

from django.conf import settings
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .email_code import store_code, verify_and_consume
from .models import User
from .serializers import ProfileSerializer, RegisterSerializer, UserSerializer
from .throttles import CredentialRateThrottle, LoginRateThrottle, RegisterRateThrottle


logger = logging.getLogger(__name__)


def _get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {'access': str(refresh.access_token), 'refresh': str(refresh)}


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    # Own scope: sharing the login bucket meant a burst of signups locked
    # legitimate users out of signing in.
    throttle_classes = [RegisterRateThrottle]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                'user': UserSerializer(user, context={'request': request}).data,
                **_get_tokens(user),
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle]

    def post(self, request):
        raw_id = request.data.get('email') or request.data.get('username') or ''
        identifier = str(raw_id).strip() if raw_id is not None else ''
        raw_pw = request.data.get('password', '')
        password = str(raw_pw) if raw_pw is not None else ''

        if not identifier or not password:
            return Response(
                {'detail': 'Email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Try direct authenticate (works if identifier is username)
        user = authenticate(request, username=identifier, password=password)

        # Fallback: look up by email, then authenticate with username
        if user is None:
            found = User.objects.filter(email__iexact=identifier).order_by('id').first()
            if found is not None:
                user = authenticate(request, username=found.username, password=password)

        if user is None:
            return Response(
                {'detail': 'Invalid credentials.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return Response({
            'user': UserSerializer(user, context={'request': request}).data,
            **_get_tokens(user),
        })


class LogoutView(APIView):
    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {'detail': 'Refresh token is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            RefreshToken(refresh_token).blacklist()
        except Exception as e:
            return Response(
                {'detail': 'Token is invalid, expired, or already blacklisted.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(generics.RetrieveUpdateAPIView):
    http_method_names = ['get', 'patch']

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            return ProfileSerializer
        return UserSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(instance, context={'request': request}).data)


class DeleteAccountView(APIView):
    def delete(self, request):
        request.user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class EmailLoginCodeRequestView(APIView):
    """POST { email } — mails a 6-digit sign-in code.

    Always answers 200 with the same body. The old version replied 404
    'No account for this email', which turned this into an account-enumeration
    oracle, and echoed the code as `dev_code` whenever DEBUG was on — which, with
    the settings module failing open to development, meant a two-request takeover
    of any account.
    """
    permission_classes = [AllowAny]
    throttle_classes = [CredentialRateThrottle]

    GENERIC_DETAIL = 'If an account exists for that address, a sign-in code has been sent.'

    def post(self, request):
        email = (request.data.get('email') or '').strip()
        if not email or '@' not in email:
            return Response({'detail': 'Valid email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email__iexact=email, is_active=True).first()
        if user is not None:
            code = store_code(email)
            try:
                send_mail(
                    subject='UZ COSMOS — sign-in code',
                    message=f'Your sign-in code: {code}\n\nValid for 10 minutes.',
                    from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', None) or 'noreply@localhost',
                    recipient_list=[email],
                    fail_silently=True,
                )
            except Exception:
                logger.exception('Failed to send sign-in code')
            if settings.DEBUG:
                # Developer convenience without a response-body leak.
                logger.warning('DEV sign-in code for %s: %s', email, code)

        return Response({'detail': self.GENERIC_DETAIL}, status=status.HTTP_200_OK)


class EmailLoginCodeVerifyView(APIView):
    """POST { email, code } — validates the 6-digit code and returns JWT + user."""
    permission_classes = [AllowAny]
    throttle_classes = [CredentialRateThrottle]

    INVALID = 'Invalid or expired code.'

    def post(self, request):
        email = (request.data.get('email') or '').strip()
        code = (request.data.get('code') or '').strip()
        if not email or not code:
            return Response(
                {'detail': 'Email and code are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if len(code) != 6 or not code.isdigit():
            return Response({'detail': 'Code must be 6 digits.'}, status=status.HTTP_400_BAD_REQUEST)

        if not verify_and_consume(email, code):
            return Response({'detail': self.INVALID}, status=status.HTTP_401_UNAUTHORIZED)

        # The password path goes through authenticate(), which checks is_active.
        # This path did not, so a banned account still got a "successful login".
        user = User.objects.filter(email__iexact=email, is_active=True).order_by('id').first()
        if user is None:
            return Response({'detail': self.INVALID}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({
            'user': UserSerializer(user, context={'request': request}).data,
            **_get_tokens(user),
        })
