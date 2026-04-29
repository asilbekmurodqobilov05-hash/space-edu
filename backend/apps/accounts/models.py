from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/', blank=True)
    astronaut_name = models.CharField(max_length=50, blank=True)
    bio = models.TextField(max_length=300, blank=True)
    selected_spaceship = models.CharField(max_length=50, default='rocket_basic')
    language = models.CharField(
        max_length=2,
        choices=[('en', 'ENG'), ('uz', 'UZB'), ('ru', 'RUS')],
        default='en',
    )

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.username
