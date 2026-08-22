"""Environment selection.

Fails *closed*: anything other than an explicit `development` loads the hardened
production settings. The previous form was `if DJANGO_ENV == 'production'`, which
meant a typo, a stray space or an unset variable silently booted development —
DEBUG on, CORS wide open, and the e-mail sign-in code echoed in the response.
"""
from decouple import config as _cfg

_env = (_cfg('DJANGO_ENV', default='production') or '').strip().lower()

if _env == 'development':
    from .development import *  # noqa: F401,F403
else:
    from .production import *  # noqa: F401,F403
