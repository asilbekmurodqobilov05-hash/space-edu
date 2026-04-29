import math

from django.conf import settings
from django.db import models


class UserGamificationProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='gamification',
    )
    xp = models.PositiveIntegerField(default=0)
    level = models.PositiveSmallIntegerField(default=1)
    fuel = models.PositiveIntegerField(default=100)
    streak = models.PositiveSmallIntegerField(default=0)
    last_play_date = models.DateField(null=True, blank=True)
    skills = models.JSONField(default=dict)

    class Meta:
        verbose_name = 'Gamification Profile'

    def __str__(self):
        return f'{self.user.username} — Level {self.level}'

    def add_xp(self, amount):
        self.xp += amount
        self.level = math.floor(math.sqrt(self.xp / 100)) + 1
        self.save(update_fields=['xp', 'level'])

    def add_fuel(self, amount):
        self.fuel = min(self.fuel + amount, 1000)
        self.save(update_fields=['fuel'])

    def spend_fuel(self, amount):
        if self.fuel < amount:
            return False
        self.fuel -= amount
        self.save(update_fields=['fuel'])
        return True


class Badge(models.Model):
    CONDITION_TYPES = [
        ('xp_threshold', 'XP Threshold'),
        ('streak', 'Streak Days'),
        ('lessons', 'Lessons Completed'),
    ]
    slug = models.SlugField(unique=True)
    title_en = models.CharField(max_length=100)
    title_uz = models.CharField(max_length=100)
    title_ru = models.CharField(max_length=100)
    description_en = models.TextField()
    description_uz = models.TextField()
    description_ru = models.TextField()
    icon = models.CharField(max_length=50)
    condition_type = models.CharField(max_length=30, choices=CONDITION_TYPES)
    condition_value = models.PositiveIntegerField()

    class Meta:
        verbose_name = 'Badge'

    def __str__(self):
        return self.slug


class UserBadge(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='badges',
    )
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'badge')
        verbose_name = 'User Badge'

    def __str__(self):
        return f'{self.user.username} — {self.badge.slug}'
