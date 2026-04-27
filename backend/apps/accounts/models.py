from django.contrib.auth.models import AbstractUser
from django.db import models
from core.models import TimeStampedModel


class User(AbstractUser, TimeStampedModel):
    email = models.EmailField(unique=True)
    astronaut_name = models.CharField(max_length=64, blank=True)
    language = models.CharField(
        max_length=3,
        choices=[("ENG", "English"), ("UZB", "O'zbekcha"), ("RUS", "Русский")],
        default="ENG",
    )
    avatar_url = models.URLField(blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        db_table = "accounts_user"
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self) -> str:
        return self.email
