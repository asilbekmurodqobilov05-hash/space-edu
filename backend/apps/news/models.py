from django.db import models
from django.utils import timezone


class NewsArticle(models.Model):
    CATEGORIES = [
        ('discovery',   'Discovery'),
        ('technology',  'Technology'),
        ('exploration', 'Exploration'),
        ('local',       'Local'),
        ('science',     'Science'),
        ('mission',     'Mission'),
    ]

    title_en   = models.CharField(max_length=200)
    title_uz   = models.CharField(max_length=200)
    title_ru   = models.CharField(max_length=200)
    summary_en = models.TextField()
    summary_uz = models.TextField()
    summary_ru = models.TextField()
    content_en = models.TextField(blank=True)
    content_uz = models.TextField(blank=True)
    content_ru = models.TextField(blank=True)
    image      = models.ImageField(upload_to='news/', blank=True)
    category   = models.CharField(max_length=30, choices=CATEGORIES, default='science')
    source     = models.CharField(max_length=100, blank=True)
    source_url = models.URLField(blank=True)
    published_at = models.DateTimeField(default=timezone.now)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ['-published_at']
        verbose_name = 'News Article'

    def __str__(self):
        return self.title_en
