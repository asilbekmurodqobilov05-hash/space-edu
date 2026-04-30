"""Short-lived 6-digit codes for email-based sign-in (cache-backed)."""
import random

from django.core.cache import cache

PREFIX = 'email_login_code:'
TTL = 600  # 10 minutes


def _key(email: str) -> str:
    return PREFIX + (email or '').strip().lower()


def store_code(email: str) -> str:
    code = f'{random.randint(0, 999999):06d}'
    cache.set(_key(email), code, TTL)
    return code


def verify_and_consume(email: str, submitted: str) -> bool:
    key = _key(email)
    stored = cache.get(key)
    if not stored or not submitted:
        return False
    if stored != submitted.strip():
        return False
    cache.delete(key)
    return True
