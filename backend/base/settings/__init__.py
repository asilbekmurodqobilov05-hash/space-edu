from decouple import config as _cfg

if _cfg('DJANGO_ENV', default='development') == 'production':
    from .production import *
else:
    from .development import *
