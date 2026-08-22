"""Short-lived 6-digit codes for e-mail sign-in (cache-backed).

Two things matter here and both were wrong before:

* The code must come from a cryptographic source. `random.randint` is a Mersenne
  Twister whose internal state is recoverable from a handful of observed outputs,
  so an attacker who could see a few of their own codes could predict someone
  else's.
* The cache must be shared between worker processes. With the old per-process
  LocMemCache, `cache.delete` on verify only cleared the copy in the worker that
  handled the request, leaving the code replayable for its full TTL in the other.
  base.py now configures Redis (or the database) instead.
"""
import hmac
import secrets

from django.core.cache import cache

PREFIX = 'email_login_code:'
ATTEMPT_PREFIX = 'email_login_attempts:'
TTL = 600  # 10 minutes
MAX_ATTEMPTS = 5


def _key(email: str) -> str:
    return PREFIX + (email or '').strip().lower()


def _attempt_key(email: str) -> str:
    return ATTEMPT_PREFIX + (email or '').strip().lower()


def store_code(email: str) -> str:
    code = f'{secrets.randbelow(1_000_000):06d}'
    cache.set(_key(email), code, TTL)
    cache.set(_attempt_key(email), 0, TTL)
    return code


def verify_and_consume(email: str, submitted: str) -> bool:
    """Return True exactly once per issued code.

    Wrong guesses are counted; after MAX_ATTEMPTS the code is discarded so the
    caller has to request a new one. Comparison is constant-time.
    """
    key = _key(email)
    stored = cache.get(key)
    if not stored or not submitted:
        return False

    attempts = cache.get(_attempt_key(email)) or 0
    if attempts >= MAX_ATTEMPTS:
        cache.delete(key)
        cache.delete(_attempt_key(email))
        return False

    if not hmac.compare_digest(str(stored), str(submitted).strip()):
        cache.set(_attempt_key(email), attempts + 1, TTL)
        return False

    cache.delete(key)
    cache.delete(_attempt_key(email))
    return True
