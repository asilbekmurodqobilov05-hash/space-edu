from django.conf import settings
from django.db import models


class UserLessonProgress(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='lesson_progress',
    )
    lesson = models.ForeignKey('courses.Lesson', on_delete=models.CASCADE)
    score = models.PositiveSmallIntegerField(default=0)
    attempts = models.PositiveSmallIntegerField(default=0)
    is_mastered = models.BooleanField(default=False)
    completed_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'lesson')
        verbose_name = 'Lesson Progress'

    def __str__(self):
        return f'{self.user.username} — {self.lesson.slug}'


class UserUnitEnrollment(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='enrollments',
    )
    unit = models.ForeignKey('courses.Unit', on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'unit')
        verbose_name = 'Unit Enrollment'

    def __str__(self):
        return f'{self.user.username} — {self.unit.slug}'
