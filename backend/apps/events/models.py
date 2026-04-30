from django.db import models


class SpaceEvent(models.Model):
    EVENT_TYPES = [
        ('launch',        'Launch'),
        ('mission',       'Mission'),
        ('discovery',     'Discovery'),
        ('milestone',     'Milestone'),
        ('anniversary',   'Anniversary'),
        ('observation',   'Observation'),
        ('meteor_shower', 'Meteor Shower'),
        ('solar_eclipse', 'Solar Eclipse'),
        ('lunar_eclipse', 'Lunar Eclipse'),
    ]

    title_en       = models.CharField(max_length=200)
    title_uz       = models.CharField(max_length=200)
    title_ru       = models.CharField(max_length=200)
    description_en = models.TextField()
    description_uz = models.TextField()
    description_ru = models.TextField()
    event_date     = models.DateField()
    event_type     = models.CharField(max_length=20, choices=EVENT_TYPES)
    image          = models.ImageField(upload_to='events/', blank=True)
    source_url     = models.URLField(blank=True)
    is_featured    = models.BooleanField(default=False)
    is_historical  = models.BooleanField(default=False, help_text='Show in History timeline')
    event_time     = models.CharField(max_length=50, blank=True)
    visibility     = models.TextField(blank=True)
    facts          = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ['event_date']
        verbose_name = 'Space Event'

    def __str__(self):
        return f'{self.event_date} — {self.title_en}'
