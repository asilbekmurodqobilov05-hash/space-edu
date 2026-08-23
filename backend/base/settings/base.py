from pathlib import Path
from datetime import timedelta
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = config('SECRET_KEY')
def _csv(name, default=''):
    """Comma-separated environment variable to a clean list.

    `.split(',')` alone leaves the space in "a.com, b.com" attached to the second
    entry, so it silently never matches. Every list below is typed into a
    dashboard by hand, which makes that a matter of when rather than if.
    """
    return [item.strip() for item in config(name, default=default).split(',') if item.strip()]


ALLOWED_HOSTS = _csv('ALLOWED_HOSTS', default='localhost,127.0.0.1')

# Railway injects the service's own hostname. Trusting it automatically means a
# deploy answers on its railway.app URL even when ALLOWED_HOSTS was never set.
# Worth doing because the failure is so badly signposted: Django rejects the
# request before CORS middleware runs, so the browser reports a missing
# Access-Control-Allow-Origin header and sends you to the wrong setting.
_railway_host = config('RAILWAY_PUBLIC_DOMAIN', default='').strip()
if _railway_host and _railway_host not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(_railway_host)

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'apps.accounts',
    'apps.gamification',
    'apps.courses',
    'apps.progress',
    'apps.market',
    'apps.chat',
    'apps.news',
    'apps.events',
    'apps.challenges',
    'apps.admin_api',
    'apps.ai',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'base.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'base.wsgi.application'

AUTH_USER_MODEL = 'accounts.User'

import dj_database_url

# DB_URL takes priority; DATABASE_URL is the name Railway injects automatically
_db_url = (
    config('DB_URL', default=None)
    or config('DATABASE_URL', default=None)
    or f'sqlite:///{BASE_DIR / "db.sqlite3"}'
)
DATABASES = {
    'default': dj_database_url.parse(_db_url, conn_max_age=600)
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = config('TIME_ZONE', default='Asia/Tashkent')
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# --- Cloudflare R2 Media Storage ---
_r2_key = config('CLOUDFLARE_R2_ACCESS_KEY_ID', default=None)

if _r2_key:
    STORAGES = {
        'default': {'BACKEND': 'base.storage_backends.R2MediaStorage'},
        'staticfiles': {'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage'},
    }
    AWS_ACCESS_KEY_ID = _r2_key
    AWS_SECRET_ACCESS_KEY = config('CLOUDFLARE_R2_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = config('CLOUDFLARE_R2_BUCKET_NAME')
    AWS_S3_ENDPOINT_URL = config('CLOUDFLARE_R2_ENDPOINT')
    AWS_S3_REGION_NAME = 'auto'
    AWS_DEFAULT_ACL = None
    AWS_S3_FILE_OVERWRITE = False
    AWS_QUERYSTRING_AUTH = False

    _r2_custom = config('CLOUDFLARE_R2_CUSTOM_DOMAIN', default='')
    if _r2_custom:
        AWS_S3_CUSTOM_DOMAIN = _r2_custom
        MEDIA_URL = f'https://{_r2_custom}/'
    else:
        MEDIA_URL = f"{config('CLOUDFLARE_R2_ENDPOINT')}/{config('CLOUDFLARE_R2_BUCKET_NAME')}/"
else:
    MEDIA_URL = '/media/'
    MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ── Cache ─────────────────────────────────────────────────────────────────────
# Must be shared across processes: gunicorn runs 2 workers, and both the e-mail
# sign-in codes and the DRF throttle counters live here. The Django default
# (LocMemCache) is per-process, which made codes vanish about half the time and
# left a verified code replayable in the worker that did not consume it.
_redis_url = config('REDIS_URL', default=None)
if _redis_url:
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.redis.RedisCache',
            'LOCATION': _redis_url,
        }
    }
else:
    # No Redis configured — fall back to the database table rather than local
    # memory, so behaviour stays correct with more than one worker.
    # Requires: python manage.py createcachetable
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
            'LOCATION': 'django_cache',
        }
    }

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    # How many reverse proxies sit in front of us. Railway terminates at one.
    # Leaving this unset makes DRF key throttles on the whole client-supplied
    # X-Forwarded-For header, which a caller can rotate to defeat every limit.
    'NUM_PROXIES': config('NUM_PROXIES', default=1, cast=int),
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        # Reads are cheap and the catalogue is public — a single page view costs
        # several requests, so the old 100/day locked visitors out after a dozen
        # screens. Writes and AI calls carry their own tighter scopes.
        'anon': '2000/day',
        'user': '10000/day',
        'login': '10/hour',
        'register': '20/day',
        'ai': '40/hour',
        'write': '300/day',
        # Chat had no limit at all. These are set for a classroom, not a
        # newsroom: a burst is fine, a flood is not.
        'chat': '20/min',
        'dm': '20/min',
        'report': '30/hour',
        # Grading is server-side now; this bounds walking the set
        # one submission at a time.
        'problem_check': '60/hour',
    },
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=8),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

CORS_ALLOWED_ORIGINS = _csv('CORS_ALLOWED_ORIGINS', default='http://localhost:3000')

# Vercel gives every preview deployment its own subdomain, so an exact list
# covers production and nothing else. Opt in deliberately: a regex as broad as
# ^https://.*\.vercel\.app$ lets any page hosted on Vercel call this API.
CORS_ALLOWED_ORIGIN_REGEXES = _csv('CORS_ALLOWED_ORIGIN_REGEXES')

# Django checks Origin on every unsafe request from an HTTPS page, whether or
# not CORS is involved. Without this, signing in to /admin/ behind Railway's
# proxy fails with "CSRF verification failed" and no other clue. Defaults to the
# CORS list because in practice they are the same set of front ends.
CSRF_TRUSTED_ORIGINS = _csv('CSRF_TRUSTED_ORIGINS') or [
    origin for origin in CORS_ALLOWED_ORIGINS if '://' in origin
]
if _railway_host and f'https://{_railway_host}' not in CSRF_TRUSTED_ORIGINS:
    CSRF_TRUSTED_ORIGINS.append(f'https://{_railway_host}')

# ── Direct messages ───────────────────────────────────────────────────────────
# Off by default, and deliberately so. The product is used by 10-to-18-year-olds
# and private messaging between minors is the single largest thing on this
# system that can go wrong. The moderation floor is now in place — screening,
# reporting, blocking, moderator deletion, rate limits and a consent step before
# a stranger's second message — but nobody has yet reviewed the feature as a
# whole against the duty of care it implies. Turn it on deliberately, with
# DM_ENABLED=true, when that review has happened. See ticket B1.
DM_ENABLED = config('DM_ENABLED', default=False, cast=bool)
