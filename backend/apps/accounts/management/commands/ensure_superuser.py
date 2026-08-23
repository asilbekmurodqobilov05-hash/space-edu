"""Create the production superuser from the environment, idempotently.

Railway has no interactive console on a deployed service, so the usual
`manage.py createsuperuser` cannot be typed anywhere. The two workarounds both
have sharp edges:

  * `createsuperuser --noinput` raises once the account exists, so wiring it into
    a start command breaks the *second* deploy — the service stops booting for a
    reason that has nothing to do with the service.
  * It also skips AUTH_PASSWORD_VALIDATORS entirely. A four-character admin
    password is accepted in silence, which is precisely the account where that
    matters most.

This command is the same work, shaped for a start command: safe to run on every
boot, loud in the deploy log, and it never takes the web process down over a
configuration problem. Run it by hand with --strict when you want the opposite.

    DJANGO_SUPERUSER_USERNAME=admin \
    DJANGO_SUPERUSER_EMAIL=you@example.com \
    DJANGO_SUPERUSER_PASSWORD=... \
    python manage.py ensure_superuser

An existing account keeps its password. A deploy silently resetting a password
somebody rotated by hand is a worse failure than a stale one, so re-setting it
takes an explicit --update-password.
"""
import os

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction


class Command(BaseCommand):
    help = 'Ensure the superuser described by DJANGO_SUPERUSER_* exists.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--update-password',
            action='store_true',
            help='Also reset the password of an existing account to the env value.',
        )
        parser.add_argument(
            '--strict',
            action='store_true',
            help='Exit non-zero on a configuration problem instead of warning.',
        )

    def handle(self, *args, **options):
        username = (os.environ.get('DJANGO_SUPERUSER_USERNAME') or '').strip()
        email = (os.environ.get('DJANGO_SUPERUSER_EMAIL') or '').strip()
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD') or ''

        if not username or not password:
            return self._give_up(
                'DJANGO_SUPERUSER_USERNAME and DJANGO_SUPERUSER_PASSWORD are not both '
                'set - no superuser was created.',
                options['strict'],
            )

        User = get_user_model()
        existing = User.objects.filter(username=username).first()

        # Validated against the *target* user so UserAttributeSimilarityValidator
        # can see the username it is being compared to.
        try:
            validate_password(password, existing or User(username=username, email=email))
        except ValidationError as exc:
            return self._give_up(
                'DJANGO_SUPERUSER_PASSWORD rejected by AUTH_PASSWORD_VALIDATORS: '
                + ' '.join(exc.messages),
                options['strict'],
            )

        with transaction.atomic():
            if existing is None:
                User.objects.create_superuser(username=username, email=email, password=password)
                self.stdout.write(self.style.SUCCESS(f'Superuser "{username}" created.'))
                return
            self._promote(existing, email, password, options['update_password'])

    # ──────────────────────────────────────────────────────────────────
    def _promote(self, user, email, password, update_password):
        """Bring an existing row up to superuser, reporting only real changes.

        A deploy that prints "created" every time teaches everyone to ignore the
        line, so the common case — nothing to do — says exactly that.
        """
        changed = []
        for flag in ('is_staff', 'is_superuser', 'is_active'):
            if not getattr(user, flag):
                setattr(user, flag, True)
                changed.append(flag)
        if email and user.email != email:
            user.email = email
            changed.append('email')
        if update_password:
            user.set_password(password)
            changed.append('password')

        if not changed:
            self.stdout.write(f'Superuser "{user.username}" already in place - nothing to do.')
            return

        user.save(update_fields=changed)
        self.stdout.write(self.style.SUCCESS(
            f'Superuser "{user.username}" updated: {", ".join(changed)}.'
        ))

    def _give_up(self, message, strict):
        if strict:
            raise CommandError(message)
        # Deliberately not an exception: this runs inside the Railway start
        # command, and a missing admin must not stop the site from booting.
        self.stderr.write(self.style.WARNING(message))
