"""Regression tests for findings from the 2026-08-22 audit.

Each test names the finding it locks down. Do not delete a test without
deleting the finding it covers.
"""
from django.core.cache import cache
from django.test import TestCase, override_settings
from rest_framework import status
from rest_framework.test import APIClient

from .models import User

VALID_PW = 'Str0ngPassw0rd!x'


def _register_payload(**over):
    data = {
        'first_name': 'Aziz',
        'last_name': 'Karimov',
        'email': 'aziz@example.com',
        'date_of_birth': '2010-01-01',
        'password': VALID_PW,
        'password2': VALID_PW,
    }
    data.update(over)
    return data


class RegisterTests(TestCase):
    """Finding: POST /auth/register/ without email raised KeyError -> 500."""

    def setUp(self):
        self.client = APIClient()
        cache.clear()

    def test_register_without_email_returns_400_not_500(self):
        payload = _register_payload()
        payload.pop('email')
        r = self.client.post('/api/v1/auth/register/', payload, format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', r.data)

    def test_register_with_blank_email_returns_400(self):
        r = self.client.post('/api/v1/auth/register/', _register_payload(email=''), format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_happy_path(self):
        r = self.client.post('/api/v1/auth/register/', _register_payload(), format='json')
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', r.data)
        self.assertIn('refresh', r.data)

    def test_register_rejects_duplicate_email_case_insensitively(self):
        self.client.post('/api/v1/auth/register/', _register_payload(), format='json')
        r = self.client.post('/api/v1/auth/register/', _register_payload(email='AZIZ@example.com'), format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_generated_username_is_slugified_and_bounded(self):
        """Finding: username was taken raw from the email local part, bypassing
        UnicodeUsernameValidator and able to exceed 150 chars."""
        long_local = 'a' * 200
        r = self.client.post(
            '/api/v1/auth/register/',
            _register_payload(email=f'{long_local}@example.com'),
            format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        username = r.data['user']['username']
        self.assertLessEqual(len(username), 30)
        self.assertRegex(username, r'^[a-z0-9_.-]+$')


class LoginThrottleTests(TestCase):
    """Findings: the login throttle was bypassable two independent ways —
    (1) AnonRateThrottle.get_cache_key() returns None for an authenticated
        caller, so any logged-in attacker had no limit at all;
    (2) NUM_PROXIES was unset, so DRF keyed the limit on the client-supplied
        X-Forwarded-For header."""

    def setUp(self):
        self.client = APIClient()
        cache.clear()
        self.user = User.objects.create_user(
            username='victim', email='victim@example.com', password=VALID_PW
        )

    def tearDown(self):
        cache.clear()

    def _bad_login(self, **extra):
        return self.client.post(
            '/api/v1/auth/login/',
            {'email': 'victim@example.com', 'password': 'wrong'},
            format='json',
            **extra,
        )

    def test_throttle_engages_for_anonymous_caller(self):
        codes = [self._bad_login().status_code for _ in range(12)]
        self.assertIn(status.HTTP_429_TOO_MANY_REQUESTS, codes)

    def test_throttle_not_bypassable_by_rotating_x_forwarded_for(self):
        """Railway appends the real peer address to X-Forwarded-For, so with
        NUM_PROXIES=1 the trusted value is the last entry. Anything the caller
        prepends must be ignored."""
        codes = [
            self._bad_login(
                HTTP_X_FORWARDED_FOR=f'203.0.113.{i}, 198.51.100.7'
            ).status_code
            for i in range(14)
        ]
        self.assertIn(status.HTTP_429_TOO_MANY_REQUESTS, codes)

    def test_a_single_spoofed_header_cannot_impersonate_many_clients(self):
        """Same check from the other side: the trusted entry is pinned by
        NUM_PROXIES, so the number of hops the caller claims does not matter."""
        codes = [
            self._bad_login(
                HTTP_X_FORWARDED_FOR=', '.join(f'10.0.0.{j}' for j in range(i + 1))
                + ', 198.51.100.7'
            ).status_code
            for i in range(14)
        ]
        self.assertIn(status.HTTP_429_TOO_MANY_REQUESTS, codes)

    def test_throttle_applies_to_authenticated_caller(self):
        attacker = User.objects.create_user(
            username='attacker', email='attacker@example.com', password=VALID_PW
        )
        self.client.force_authenticate(attacker)
        codes = [self._bad_login().status_code for _ in range(14)]
        self.assertIn(status.HTTP_429_TOO_MANY_REQUESTS, codes)

    def test_login_does_not_reveal_whether_the_account_exists(self):
        missing = self.client.post(
            '/api/v1/auth/login/',
            {'email': 'nobody@example.com', 'password': 'wrong'},
            format='json',
        )
        existing = self._bad_login()
        self.assertEqual(missing.status_code, existing.status_code)
        self.assertEqual(missing.data['detail'], existing.data['detail'])


class EmailCodeTests(TestCase):
    """Findings: the sign-in code was generated with random.randint (predictable),
    echoed to the client whenever DEBUG was on, enumerated accounts by 404,
    and stayed replayable because the per-worker cache delete missed."""

    def setUp(self):
        self.client = APIClient()
        cache.clear()
        self.user = User.objects.create_user(
            username='pilot', email='pilot@example.com', password=VALID_PW
        )

    def tearDown(self):
        cache.clear()

    @override_settings(DEBUG=True)
    def test_response_never_contains_the_code_even_with_debug_on(self):
        r = self.client.post(
            '/api/v1/auth/email-code/request/', {'email': 'pilot@example.com'}, format='json'
        )
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertNotIn('dev_code', r.data)
        self.assertNotIn('code', r.data)

    def test_unknown_email_is_indistinguishable_from_a_known_one(self):
        known = self.client.post(
            '/api/v1/auth/email-code/request/', {'email': 'pilot@example.com'}, format='json'
        )
        cache.clear()
        unknown = self.client.post(
            '/api/v1/auth/email-code/request/', {'email': 'ghost@example.com'}, format='json'
        )
        self.assertEqual(known.status_code, unknown.status_code)
        self.assertEqual(known.data['detail'], unknown.data['detail'])

    def test_code_is_single_use(self):
        from .email_code import store_code

        code = store_code('pilot@example.com')
        first = self.client.post(
            '/api/v1/auth/email-code/verify/',
            {'email': 'pilot@example.com', 'code': code},
            format='json',
        )
        self.assertEqual(first.status_code, status.HTTP_200_OK)
        second = self.client.post(
            '/api/v1/auth/email-code/verify/',
            {'email': 'pilot@example.com', 'code': code},
            format='json',
        )
        self.assertEqual(second.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_code_generation_uses_a_cryptographic_source(self):
        """random.randint is a Mersenne Twister and its state is recoverable
        from a handful of observed outputs."""
        import ast
        import inspect

        from . import email_code

        tree = ast.parse(inspect.getsource(email_code))
        calls = {
            ast.unparse(node.func)
            for node in ast.walk(tree)
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute)
        }
        self.assertIn('secrets.randbelow', calls)
        self.assertNotIn('random.randint', calls)

    def test_inactive_user_cannot_sign_in_with_a_code(self):
        from .email_code import store_code

        self.user.is_active = False
        self.user.save(update_fields=['is_active'])
        code = store_code('pilot@example.com')
        r = self.client.post(
            '/api/v1/auth/email-code/verify/',
            {'email': 'pilot@example.com', 'code': code},
            format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_verify_rejects_a_code_that_was_never_issued(self):
        r = self.client.post(
            '/api/v1/auth/email-code/verify/',
            {'email': 'pilot@example.com', 'code': '000000'},
            format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)
