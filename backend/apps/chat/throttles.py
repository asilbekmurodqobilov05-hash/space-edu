"""Rate limits for chat.

There were none. A single account could post to the public room in a loop, and
DM anyone it liked as fast as the network allowed — which is how a chat for
children becomes a flooding tool.

`ScopedRateThrottle` would key an authenticated caller by user id and an
anonymous one by IP, but every write here needs authentication anyway, so
keying on the client identity throughout keeps one account behind one proxy
from being counted as several.
"""
from rest_framework.throttling import SimpleRateThrottle


class _WriteThrottle(SimpleRateThrottle):
    def get_cache_key(self, request, view):
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return None  # reads are not what floods a room
        ident = (
            f'user-{request.user.pk}' if request.user.is_authenticated
            else self.get_ident(request)
        )
        return self.cache_format % {'scope': self.scope, 'ident': ident}


class RoomMessageThrottle(_WriteThrottle):
    scope = 'chat'


class DirectMessageThrottle(_WriteThrottle):
    scope = 'dm'


class ReportThrottle(_WriteThrottle):
    scope = 'report'
