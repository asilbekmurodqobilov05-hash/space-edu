"""Throttles for credential endpoints.

`AnonRateThrottle` is the wrong base class here. Its `get_cache_key` returns
`None` as soon as `request.user.is_authenticated`, and a `None` key means
"no limit". Because `throttle_classes` *replaces* the default list, an attacker
who registered one throwaway account and sent their own bearer token got
unlimited password and sign-in-code guesses.

These throttles always key on the client identity, logged in or not. DRF derives
that identity through `NUM_PROXIES`, which base.py now pins.
"""
from rest_framework.throttling import SimpleRateThrottle


class _AlwaysOnRateThrottle(SimpleRateThrottle):
    """Rate-limits every caller, authenticated or anonymous."""

    def get_cache_key(self, request, view):
        return self.cache_format % {
            'scope': self.scope,
            'ident': self.get_ident(request),
        }


class LoginRateThrottle(_AlwaysOnRateThrottle):
    scope = 'login'


class RegisterRateThrottle(_AlwaysOnRateThrottle):
    scope = 'register'


class CredentialRateThrottle(_AlwaysOnRateThrottle):
    """Sign-in-code request and verify.

    Keyed on the client *and* the target address, so hammering one account from
    many addresses and one address against many accounts are both bounded.
    """

    scope = 'login'

    def get_cache_key(self, request, view):
        email = ''
        if hasattr(request, 'data') and isinstance(request.data, dict):
            email = str(request.data.get('email') or '').strip().lower()
        return self.cache_format % {
            'scope': self.scope,
            'ident': f'{self.get_ident(request)}|{email}',
        }
