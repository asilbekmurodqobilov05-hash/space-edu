from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import UserGamificationProfile


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_gamification_profile(sender, instance, created, **kwargs):
    if created:
        UserGamificationProfile.objects.create(user=instance)
