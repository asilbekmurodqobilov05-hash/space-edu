"""Configuration-level regression tests for findings from the 2026-08-22 audit.

These check settings rather than endpoints. They are cheap and they catch the
class of bug that `manage.py check` stays silent about.
"""
import importlib
import os
import sys

from django.test import SimpleTestCase, TestCase
from django.test.utils import override_settings


class StorageConfigTests(SimpleTestCase):
    """Finding: base.py only defines STORAGES when Cloudflare R2 is configured, and
    production.py then rebuilt it as {**globals().get('STORAGES', {}), 'staticfiles': ...}.
    Without R2 that leaves no 'default' key, so every ImageField save raised
    InvalidStorageError. manage.py check passed, so it stayed silent until the
    first avatar upload."""

    def test_default_storage_alias_is_always_configured(self):
        from django.conf import settings

        self.assertIn('default', settings.STORAGES)

    def test_default_storage_resolves(self):
        from django.core.files.storage import default_storage

        self.assertIsNotNone(default_storage)

    def test_production_settings_define_a_default_storage_without_r2(self):
        prod = importlib.import_module('base.settings.production')
        self.assertIn('default', prod.STORAGES)


class CacheConfigTests(SimpleTestCase):
    """Finding: CACHES was never set, so Django fell back to per-process
    LocMemCache while railway.json runs `gunicorn --workers 2`. Sign-in codes
    stored by one worker were invisible to the other, throttle counters were
    per-worker, and cache.delete() on verify only cleared the local copy, leaving
    the code replayable for its full TTL."""

    def test_cache_backend_is_shared_across_processes(self):
        from django.conf import settings

        backend = settings.CACHES['default']['BACKEND']
        self.assertNotIn(
            'locmem', backend.lower(),
            'LocMemCache is per-process; sign-in codes and throttles break with >1 worker',
        )


class ThrottleConfigTests(SimpleTestCase):
    """Findings: NUM_PROXIES unset made throttling bypassable via a spoofed
    X-Forwarded-For; and anon 100/day applied to every public read endpoint, so a
    logged-out visitor hit 429 after a dozen page views."""

    def test_num_proxies_is_pinned(self):
        from rest_framework.settings import api_settings

        self.assertIsNotNone(
            api_settings.NUM_PROXIES,
            'unset NUM_PROXIES makes DRF key the throttle on client-supplied X-Forwarded-For',
        )

    def test_anonymous_read_budget_is_realistic(self):
        from django.conf import settings

        rate = settings.REST_FRAMEWORK['DEFAULT_THROTTLE_RATES']['anon']
        count, _, period = rate.partition('/')
        self.assertTrue(
            period != 'day' or int(count) >= 1000,
            f'anon rate {rate} is too tight for a public education site',
        )


class EnvironmentSelectionTests(SimpleTestCase):
    """Finding: settings/__init__.py loaded production only on an exact match of
    the string 'production'. Any typo, stray whitespace or unset variable silently
    booted development — DEBUG=True, CORS_ALLOW_ALL_ORIGINS=True, and the sign-in
    code echoed in the HTTP response."""

    def _resolved_env(self, value):
        original = os.environ.get('DJANGO_ENV')
        if value is None:
            os.environ.pop('DJANGO_ENV', None)
        else:
            os.environ['DJANGO_ENV'] = value
        try:
            for name in [m for m in sys.modules if m.startswith('base.settings')]:
                sys.modules.pop(name, None)
            mod = importlib.import_module('base.settings')
            return getattr(mod, 'DEBUG', None)
        finally:
            if original is None:
                os.environ.pop('DJANGO_ENV', None)
            else:
                os.environ['DJANGO_ENV'] = original

    def test_unset_environment_does_not_fall_open_to_debug(self):
        self.assertFalse(self._resolved_env(None), 'unset DJANGO_ENV must not enable DEBUG')

    def test_typo_does_not_fall_open_to_debug(self):
        self.assertFalse(self._resolved_env('prod'), "'prod' must not enable DEBUG")

    def test_whitespace_does_not_fall_open_to_debug(self):
        self.assertFalse(self._resolved_env(' production '), 'stray whitespace must not enable DEBUG')

    def test_explicit_development_still_works(self):
        self.assertTrue(self._resolved_env('development'))


class JwtConfigTests(SimpleTestCase):
    """The frontend interceptor must persist the rotated refresh token; if
    rotation is on and blacklisting is on, dropping it logs every user out."""

    def test_rotation_and_blacklisting_are_configured_together(self):
        from django.conf import settings

        jwt = settings.SIMPLE_JWT
        if jwt.get('ROTATE_REFRESH_TOKENS'):
            self.assertTrue(
                jwt.get('BLACKLIST_AFTER_ROTATION'),
                'rotation without blacklisting leaves old refresh tokens valid',
            )


class PublicSurfaceTests(TestCase):
    """Finding: cosmic-silk-road.html shipped in frontend/public/ as a second,
    unmaintained auth surface. It forged a local session on any failed login and
    took its API base from a ?api= query parameter, so a link on the real domain
    could post a child's password to an arbitrary host."""

    def test_the_duplicate_auth_page_is_gone(self):
        from pathlib import Path

        repo = Path(__file__).resolve().parent.parent.parent
        served = repo / 'frontend' / 'public' / 'cosmic-silk-road.html'
        self.assertFalse(
            served.exists(),
            'anything under frontend/public/ is served verbatim at the site root; '
            'this page forged a session on any failed login and took its API base '
            'from a ?api= query parameter',
        )


class OriginConfigTests(SimpleTestCase):
    """The prod outage of 2026-08-23: the Vercel front end could not reach the
    Railway API at all, because every cross-origin request was refused before it
    started. Three separate settings can produce that one browser message, and
    two of them look nothing like a CORS problem, so each gets a test."""

    def _reload_settings(self, **env):
        original = {name: os.environ.get(name) for name in env}
        os.environ.update({name: value for name, value in env.items()})
        try:
            for name in [m for m in sys.modules if m.startswith('base.settings')]:
                sys.modules.pop(name, None)
            return importlib.import_module('base.settings')
        finally:
            for name, value in original.items():
                if value is None:
                    os.environ.pop(name, None)
                else:
                    os.environ[name] = value
            for name in [m for m in sys.modules if m.startswith('base.settings')]:
                sys.modules.pop(name, None)
            importlib.import_module('base.settings')

    def test_a_space_after_the_comma_does_not_silently_void_an_origin(self):
        """These lists are typed into the Railway dashboard by hand. Plain
        .split(',') kept the space, so the second origin never matched and the
        symptom was indistinguishable from not having set it at all."""
        settings = self._reload_settings(
            CORS_ALLOWED_ORIGINS='https://a.example, https://b.example',
            ALLOWED_HOSTS='a.example, b.example',
        )
        self.assertIn('https://b.example', settings.CORS_ALLOWED_ORIGINS)
        self.assertIn('b.example', settings.ALLOWED_HOSTS)

    def test_an_empty_entry_from_a_trailing_comma_is_dropped(self):
        settings = self._reload_settings(CORS_ALLOWED_ORIGINS='https://a.example,')
        self.assertEqual(settings.CORS_ALLOWED_ORIGINS, ['https://a.example'])

    def test_the_railway_hostname_is_trusted_without_being_configured(self):
        """Django rejects a disallowed Host before CORS middleware ever runs, so
        a missing ALLOWED_HOSTS entry surfaces in the browser as a missing
        Access-Control-Allow-Origin header — pointing at the wrong setting."""
        settings = self._reload_settings(
            RAILWAY_PUBLIC_DOMAIN='space-edu-production.up.railway.app',
            ALLOWED_HOSTS='localhost',
        )
        self.assertIn('space-edu-production.up.railway.app', settings.ALLOWED_HOSTS)

    def test_csrf_trusts_the_railway_origin_so_the_admin_can_be_signed_into(self):
        settings = self._reload_settings(
            RAILWAY_PUBLIC_DOMAIN='space-edu-production.up.railway.app',
        )
        self.assertIn(
            'https://space-edu-production.up.railway.app',
            settings.CSRF_TRUSTED_ORIGINS,
        )

    def test_csrf_falls_back_to_the_cors_front_ends(self):
        settings = self._reload_settings(
            CORS_ALLOWED_ORIGINS='https://space-edu-two.vercel.app',
            CSRF_TRUSTED_ORIGINS='',
        )
        self.assertIn('https://space-edu-two.vercel.app', settings.CSRF_TRUSTED_ORIGINS)

    def test_preview_origins_are_not_opened_up_by_default(self):
        """A regex broad enough to match Vercel previews also matches every
        other page hosted on vercel.app. It stays opt-in."""
        settings = self._reload_settings(CORS_ALLOWED_ORIGINS='https://a.example')
        self.assertEqual(settings.CORS_ALLOWED_ORIGIN_REGEXES, [])
