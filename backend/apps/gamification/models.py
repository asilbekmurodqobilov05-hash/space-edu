from django.conf import settings
from django.db import models
from core.models import BaseModel
from core.utils import calculate_level


class PlayerProfile(BaseModel):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    xp = models.PositiveIntegerField(default=0)
    fuel = models.PositiveIntegerField(default=100)
    streak = models.PositiveSmallIntegerField(default=0)
    last_play_date = models.DateField(null=True, blank=True)
    career_track = models.CharField(max_length=64, blank=True)

    class Meta:
        db_table = "gamification_player_profile"

    def __str__(self) -> str:
        return f"{self.user.email} — Level {self.level} ({self.xp} XP)"

    @property
    def level(self) -> int:
        return calculate_level(self.xp)

    def add_xp(self, amount: int) -> None:
        self.xp += amount
        self.save(update_fields=["xp", "updated_at"])


class Badge(BaseModel):
    player = models.ForeignKey(
        PlayerProfile,
        on_delete=models.CASCADE,
        related_name="badges",
    )
    badge_id = models.CharField(max_length=64)
    name = models.CharField(max_length=128)
    description = models.CharField(max_length=256)
    icon = models.CharField(max_length=64)
    unlocked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "gamification_badge"
        unique_together = ("player", "badge_id")
        ordering = ("-unlocked_at",)

    def __str__(self) -> str:
        return f"{self.player.user.email} — {self.name}"
