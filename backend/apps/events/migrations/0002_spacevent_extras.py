from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='spaceevent',
            name='event_time',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='spaceevent',
            name='visibility',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='spaceevent',
            name='facts',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AlterField(
            model_name='spaceevent',
            name='event_type',
            field=models.CharField(
                choices=[
                    ('launch', 'Launch'), ('mission', 'Mission'),
                    ('discovery', 'Discovery'), ('milestone', 'Milestone'),
                    ('anniversary', 'Anniversary'), ('observation', 'Observation'),
                    ('meteor_shower', 'Meteor Shower'), ('solar_eclipse', 'Solar Eclipse'),
                    ('lunar_eclipse', 'Lunar Eclipse'),
                ],
                max_length=20,
            ),
        ),
    ]
