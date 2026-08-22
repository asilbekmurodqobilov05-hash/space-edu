"""Create the DatabaseCache table.

base.py falls back to DatabaseCache when REDIS_URL is absent, because the Django
default (LocMemCache) is per-process and gunicorn runs two workers — which broke
e-mail sign-in codes and made throttle counters meaningless.

Creating the table in a migration rather than leaving it to a manual
`manage.py createcachetable` means test databases and fresh deploys both get it.
"""
from django.core.management import call_command
from django.db import migrations

CACHE_TABLE = 'django_cache'


def create_cache_table(apps, schema_editor):
    call_command(
        'createcachetable', CACHE_TABLE,
        database=schema_editor.connection.alias,
        verbosity=0,
    )


def drop_cache_table(apps, schema_editor):
    with schema_editor.connection.cursor() as cursor:
        cursor.execute(f'DROP TABLE IF EXISTS {schema_editor.connection.ops.quote_name(CACHE_TABLE)}')


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_user_date_of_birth'),
    ]

    operations = [
        migrations.RunPython(create_cache_table, drop_cache_table),
    ]
