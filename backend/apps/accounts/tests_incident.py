"""Tests for the credential-rotation step of the 2026-08-22 incident.

The runbook step this covers is the one that actually ends the exposure. It gets
tests because an incident command that half-works is worse than none: it reports
success and leaves a live credential behind.
"""
from io import StringIO

from django.contrib.sessions.models import Session
from django.core.management import call_command
from django.test import TestCase
from django.utils import timezone
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

from apps.accounts.management.commands.rotate_leaked_credentials import (
    LEAKED_SUPERUSERS, LEAKED_USERNAMES,
)

from .models import User


def _run(*args):
    out = StringIO()
    call_command('rotate_leaked_credentials', *args, stdout=out, stderr=out)
    return out.getvalue()


class RotateLeakedCredentialsTests(TestCase):
    def setUp(self):
        self.leaked = User.objects.create_user(
            username=LEAKED_USERNAMES[0], email='leaked@example.com', password='LeakedPw123!',
        )
        self.bystander = User.objects.create_user(
            username='not-in-the-leak', email='fine@example.com', password='OtherPw123!',
        )

    def test_leaked_account_password_stops_working(self):
        _run()
        self.leaked.refresh_from_db()
        self.assertFalse(self.leaked.has_usable_password())
        self.assertFalse(self.leaked.check_password('LeakedPw123!'))

    def test_account_is_not_deleted_so_it_can_return_by_email_code(self):
        _run()
        self.leaked.refresh_from_db()
        self.assertTrue(self.leaked.is_active)

    def test_accounts_outside_the_leak_are_untouched(self):
        _run()
        self.bystander.refresh_from_db()
        self.assertTrue(self.bystander.check_password('OtherPw123!'))

    def test_dry_run_changes_nothing(self):
        output = _run('--dry-run')
        self.leaked.refresh_from_db()
        self.assertTrue(self.leaked.check_password('LeakedPw123!'))
        self.assertIn('DRY RUN', output)
        self.assertIn(LEAKED_USERNAMES[0], output)

    def test_running_twice_is_safe_and_the_second_run_claims_nothing(self):
        first = _run()
        second = _run()
        self.assertIn(f'- {LEAKED_USERNAMES[0]}', first)
        self.assertIn('Accounts locked out: 0', second)

    def test_sessions_are_cleared(self):
        Session.objects.create(
            session_key='deadbeef', session_data='x',
            expire_date=timezone.now() + timezone.timedelta(days=1),
        )
        _run()
        self.assertEqual(Session.objects.count(), 0)

    def test_outstanding_refresh_tokens_are_blacklisted(self):
        token = OutstandingToken.objects.create(
            user=self.bystander, jti='jti-1', token='t',
            created_at=timezone.now(), expires_at=timezone.now() + timezone.timedelta(days=1),
        )
        _run()
        self.assertTrue(BlacklistedToken.objects.filter(token=token).exists())

    def test_blacklisting_twice_does_not_raise_on_the_unique_constraint(self):
        OutstandingToken.objects.create(
            user=self.bystander, jti='jti-2', token='t2',
            created_at=timezone.now(), expires_at=timezone.now() + timezone.timedelta(days=1),
        )
        _run()
        _run()  # would raise IntegrityError without ignore_conflicts

    def test_superusers_are_reported_as_still_needing_a_human(self):
        """A superuser password cannot be rotated unattended.

        Anything this command generated would have to be printed to be usable,
        which puts a live credential in a terminal scrollback and a CI log.
        """
        User.objects.create_superuser(
            username=LEAKED_SUPERUSERS[0], email='admin@admin.admin', password='Whatever123!',
        )
        output = _run()
        self.assertIn('STILL TO DO BY HAND', output)
        self.assertIn(f'changepassword {LEAKED_SUPERUSERS[0]}', output)

    def test_report_names_the_credentials_that_live_outside_the_database(self):
        output = _run()
        for secret in ('SECRET_KEY', 'R2', 'GEMINI_API_KEY'):
            self.assertIn(secret, output)
