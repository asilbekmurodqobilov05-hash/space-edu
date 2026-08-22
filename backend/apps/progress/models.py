from django.conf import settings
from django.db import models


class UserLessonProgress(models.Model):
    """One row per (student, completed lesson).

    Pointed at `courses.Lesson` until ADR 0001 — the branch of the content model
    that no navigation reached. It now points at `courses.TopicLesson`, the tree
    the admin panel edits and the site reads.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='lesson_progress',
    )
    lesson = models.ForeignKey('courses.TopicLesson', on_delete=models.CASCADE)
    score = models.PositiveSmallIntegerField(default=0)
    attempts = models.PositiveSmallIntegerField(default=0)
    is_mastered = models.BooleanField(default=False)
    completed_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'lesson')
        verbose_name = 'Lesson Progress'

    def __str__(self):
        return f'{self.user.username} — {self.lesson.slug}'


class UserTopicEnrollment(models.Model):
    """Was UserUnitEnrollment, against the deleted `courses.Unit`.

    `Topic` is the unit of completion in the surviving tree — it is what a
    student picks from a sphere, and what pays a bonus when its lessons are done.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='enrollments',
    )
    topic = models.ForeignKey('courses.Topic', on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'topic')
        verbose_name = 'Topic Enrollment'

    def __str__(self):
        return f'{self.user.username} — {self.topic.slug}'
