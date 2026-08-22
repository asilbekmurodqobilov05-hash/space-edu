"""Lock out the accounts whose password hashes leaked in `backend/db.sqlite3`.

See docs/SECURITY-INCIDENT-2026-08-22.md. The database was committed and later
deleted, which removes it from the working tree but not from history, and the
repository is public. Every hash in it must be treated as known.

The runbook used to be a copy-paste `manage.py shell` session. That is the wrong
shape for an incident step: it is not idempotent, it has no dry run, it reports
nothing, and a typo in the middle of it leaves the rotation half-applied with no
record of where it stopped. This command is the same work, repeatable, with a
report at the end.

    python manage.py rotate_leaked_credentials --dry-run
    python manage.py rotate_leaked_credentials

Superuser passwords are deliberately NOT set here — a password this command
chose would have to be printed or logged somewhere to be usable. Run
`manage.py changepassword <name>` for each superuser it lists.
"""
from django.contrib.auth import get_user_model
from django.contrib.sessions.models import Session
from django.core.management.base import BaseCommand
from django.db import transaction

# The rows read out of the leaked file, from the incident report. Superusers are
# listed separately because they need a human to choose a new password.
LEAKED_USERNAMES = [
    'cosmonauttest',
    'yusuf',
    'alisher',
    'shokhanasserprojr',
    'john.doe',
    'qweqweqwe',
    'qqq',
]

LEAKED_SUPERUSERS = ['qweqwe', 'admin1']


class Command(BaseCommand):
    help = 'Invalidate every credential exposed by the committed SQLite database.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Report what would change and touch nothing.',
        )
        parser.add_argument(
            '--keep-sessions',
            action='store_true',
            help='Leave django_session and the JWT blacklist alone (not advised).',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        User = get_user_model()

        if dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN — nothing will be written.\n'))

        with transaction.atomic():
            locked_out = self._lock_out_accounts(User, dry_run)
            sessions, tokens = (0, 0)
            if not options['keep_sessions']:
                sessions, tokens = self._revoke_sessions(dry_run)
            if dry_run:
                transaction.set_rollback(True)

        self._report(User, locked_out, sessions, tokens, dry_run)

    # ──────────────────────────────────────────────────────────────────
    def _lock_out_accounts(self, User, dry_run):
        """set_unusable_password() on every non-superuser in the leak.

        The old hash stops verifying, so the leaked copy is worthless, and the
        account is not deleted — it comes back through the e-mail sign-in flow.
        Already-unusable passwords are skipped so a second run reports honestly
        instead of claiming work it did not do.
        """
        rotated = []
        for user in User.objects.filter(username__in=LEAKED_USERNAMES):
            if not user.has_usable_password():
                continue
            if not dry_run:
                user.set_unusable_password()
                user.save(update_fields=['password'])
            rotated.append(user.username)
        return rotated

    def _revoke_sessions(self, dry_run):
        """Nothing signed in before the rotation stays signed in."""
        session_count = Session.objects.count()
        if not dry_run:
            Session.objects.all().delete()

        try:
            from rest_framework_simplejwt.token_blacklist.models import (
                BlacklistedToken, OutstandingToken,
            )
        except ImportError:  # pragma: no cover — the app is in INSTALLED_APPS
            return session_count, 0

        outstanding = OutstandingToken.objects.exclude(
            id__in=BlacklistedToken.objects.values_list('token_id', flat=True)
        )
        token_count = outstanding.count()
        if not dry_run:
            BlacklistedToken.objects.bulk_create(
                [BlacklistedToken(token=token) for token in outstanding],
                ignore_conflicts=True,
            )
        return session_count, token_count

    # ──────────────────────────────────────────────────────────────────
    def _report(self, User, locked_out, sessions, tokens, dry_run):
        verb = 'would lock out' if dry_run else 'locked out'
        self.stdout.write(f'Accounts {verb}: {len(locked_out)}')
        for username in locked_out:
            self.stdout.write(f'  - {username}')

        missing = set(LEAKED_USERNAMES) - set(
            User.objects.filter(username__in=LEAKED_USERNAMES).values_list('username', flat=True)
        )
        if missing:
            self.stdout.write(
                f'Not present in this database (fine — already gone): {", ".join(sorted(missing))}'
            )

        verb = 'would clear' if dry_run else 'cleared'
        self.stdout.write(f'Sessions {verb}: {sessions}')
        verb = 'would blacklist' if dry_run else 'blacklisted'
        self.stdout.write(f'Refresh tokens {verb}: {tokens}')

        present_supers = list(
            User.objects.filter(username__in=LEAKED_SUPERUSERS).values_list('username', flat=True)
        )
        if present_supers:
            self.stdout.write(self.style.ERROR(
                '\nSTILL TO DO BY HAND — these superusers keep a working leaked password\n'
                'until you choose a new one:'
            ))
            for username in present_supers:
                self.stdout.write(self.style.ERROR(f'    python manage.py changepassword {username}'))

        self.stdout.write(self.style.WARNING(
            '\nAlso rotate, outside this command: SECRET_KEY, the Cloudflare R2 keys,\n'
            'GEMINI_API_KEY, and the same password anywhere it was reused.'
        ))

        if not dry_run:
            self.stdout.write(self.style.SUCCESS('\nRotation applied.'))
