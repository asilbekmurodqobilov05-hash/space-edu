from .base import *
from decouple import config

DEBUG = config('DEBUG', default=True, cast=bool)

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
DEFAULT_FROM_EMAIL = 'noreply@localhost'

CORS_ALLOW_ALL_ORIGINS = True
