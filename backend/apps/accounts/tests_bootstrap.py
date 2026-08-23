"""Tests for `ensure_superuser`, the production admin bootstrap.

This command runs unattended on every Railway boot, which makes two of its
properties load-bearing and neither of them obvious from reading it: a repeat
run must not disturb an account that already exists, and a bad configuration
must not take the web process down with it.
"""
import os
from io import StringIO
from unittest.mock import patch

from django.core.management import call_command
from django.core.management.base import CommandError
from django.test import TestCase

from .models import User

STRONG = 'Sp4ceEdu!Orbit'
ENV = {
    'DJANGO_SUPERUSER_USERNAME': 'admin',
    'DJANGO_SUPERUSER_EMAIL': 'admin@example.com',
    'DJANGO_SUPERUSER_PASSWORD': STRONG,
}


def _run(*args, **env):
    out, err = StringIO(), StringIO()
    with patch.dict(os.environ, {**ENV, **env}, clear=False):
        call_command('ensure_superuser', *args, stdout=out, stderr=err)
    return out.getvalue() + err.getvalue()


class EnsureSuperuserTests(TestCase):
    def test_creates_the_account_when_absent(self):
        _run()
        user = User.objects.get(username='admin')
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)
        self.assertTrue(user.check_password(STRONG))

    def test_second_run_is_a_no_op_rather_than_an_error(self):
        _run()
        output = _run()
        self.assertIn('nothing to do', output)
        self.assertEqual(User.objects.filter(username='admin').count(), 1)

    def test_a_password_changed_by_hand_survives_the_next_deploy(self):
        _run()
        user = User.objects.get(username='admin')
        user.set_password('R0tated!ByHand')
        user.save()

        _run()

        user.refresh_from_db()
        self.assertTrue(user.check_password('R0tated!ByHand'))

    def test_update_password_resets_it_when_asked(self):
        _run()
        user = User.objects.get(username='admin')
        user.set_password('R0tated!ByHand')
        user.save()

        _run('--update-password')

        user.refresh_from_db()
        self.assertTrue(user.check_password(STRONG))

    def test_an_existing_plain_user_is_promoted_not_duplicated(self):
        User.objects.create_user(username='admin', email='admin@example.com', password=STRONG)

        _run()

        self.assertEqual(User.objects.filter(username='admin').count(), 1)
        user = User.objects.get(username='admin')
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)

    def test_a_deactivated_admin_is_reactivated(self):
        _run()
        User.objects.filter(username='admin').update(is_active=False)

        _run()

        self.assertTrue(User.objects.get(username='admin').is_active)

    # ── configuration problems must not stop the site from booting ──────
    def test_weak_password_is_refused_and_creates_nothing(self):
        output = _run(DJANGO_SUPERUSER_PASSWORD='admin')
        self.assertFalse(User.objects.filter(username='admin').exists())
        self.assertIn('AUTH_PASSWORD_VALIDATORS', output)

    def test_weak_password_does_not_raise_by_default(self):
        _run(DJANGO_SUPERUSER_PASSWORD='admin')  # would fail the test if it raised

    def test_weak_password_raises_under_strict(self):
        with self.assertRaises(CommandError):
            _run('--strict', DJANGO_SUPERUSER_PASSWORD='admin')

    def test_unset_environment_is_a_quiet_no_op(self):
        output = _run(DJANGO_SUPERUSER_USERNAME='', DJANGO_SUPERUSER_PASSWORD='')
        self.assertFalse(User.objects.exists())
        self.assertIn('no superuser was created', output)

    def test_the_password_is_never_written_to_the_log(self):
        self.assertNotIn(STRONG, _run())
        self.assertNotIn(STRONG, _run())
