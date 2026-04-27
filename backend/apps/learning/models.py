from django.conf import settings
from django.db import models
from core.models import BaseModel


class LessonProgress(BaseModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="lesson_progress",
    )
    lesson_id = models.CharField(max_length=128)
    unit_id = models.CharField(max_length=128)
    score = models.PositiveSmallIntegerField(default=0)
    completed = models.BooleanField(default=False)
    mastered = models.BooleanField(default=False)

    class Meta:
        db_table = "learning_lesson_progress"
        unique_together = ("user", "lesson_id")
        ordering = ("-updated_at",)

    def __str__(self) -> str:
        return f"{self.user.email} — {self.lesson_id} ({self.score}%)"


class UnitEnrollment(BaseModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="enrollments",
    )
    unit_id = models.CharField(max_length=128)

    class Meta:
        db_table = "learning_unit_enrollment"
        unique_together = ("user", "unit_id")

    def __str__(self) -> str:
        return f"{self.user.email} → {self.unit_id}"
