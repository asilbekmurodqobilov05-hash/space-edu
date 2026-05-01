from django.conf import settings
from django.db import models
from django.utils import timezone


# ──────────────────────────────────────────────────────────────────────────────
#  CHALLENGE QUESTION  —  quiz question pool for daily challenges AND quiz/tests
# ──────────────────────────────────────────────────────────────────────────────
class ChallengeQuestion(models.Model):
    CATEGORIES = [
        ('physics', 'Physics'),
        ('astronomy', 'Astronomy'),
        ('problems', 'Problems'),
        ('courses', 'Online Courses'),
        ('general', 'General Space'),
    ]
    DIFFICULTIES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]

    category = models.CharField(max_length=20, choices=CATEGORIES, default='general')
    difficulty = models.CharField(max_length=10, choices=DIFFICULTIES, default='medium')
    question = models.TextField(help_text='Question text (Uzbek)')
    question_en = models.TextField(blank=True, default='')
    question_ru = models.TextField(blank=True, default='')
    options = models.JSONField(help_text='List of 4 answer options')
    correct_answer = models.PositiveSmallIntegerField(help_text='0-based index of correct option')
    explanation = models.TextField(blank=True, default='', help_text='Why this answer is correct')
    time_seconds = models.PositiveIntegerField(default=60, help_text='Time limit per question in seconds')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['category', 'difficulty']
        verbose_name = 'Challenge Question'

    def __str__(self):
        return f'[{self.category}/{self.difficulty}] {self.question[:60]}'


# ──────────────────────────────────────────────────────────────────────────────
#  DAILY CHALLENGE  —  auto-generated set of questions for a specific date
# ──────────────────────────────────────────────────────────────────────────────
class DailyChallenge(models.Model):
    date = models.DateField(unique=True)
    questions = models.ManyToManyField(ChallengeQuestion, related_name='daily_challenges')
    question_count = models.PositiveSmallIntegerField(default=5)
    time_limit = models.PositiveSmallIntegerField(default=15, help_text='Seconds per question')
    xp_per_correct = models.PositiveIntegerField(default=50)
    xp_completion_bonus = models.PositiveIntegerField(default=100)
    fuel_reward = models.PositiveIntegerField(default=20, help_text='Fuel reward for completing')
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-date']
        verbose_name = 'Daily Challenge'

    def __str__(self):
        return f'Challenge {self.date}'

    @classmethod
    def get_or_create_today(cls):
        """Get today's challenge, or auto-generate one from the question pool."""
        today = timezone.now().date()
        challenge, created = cls.objects.get_or_create(date=today)

        if created:
            # Pick 5 random questions (1 easy, 2 medium, 2 hard)
            import random
            pool = list(ChallengeQuestion.objects.filter(is_active=True))
            if len(pool) >= 5:
                easy = [q for q in pool if q.difficulty == 'easy']
                medium = [q for q in pool if q.difficulty == 'medium']
                hard = [q for q in pool if q.difficulty == 'hard']

                selected = []
                selected += random.sample(easy, min(1, len(easy)))
                selected += random.sample(medium, min(2, len(medium)))
                selected += random.sample(hard, min(2, len(hard)))

                # Fill remaining from any category
                remaining = [q for q in pool if q not in selected]
                while len(selected) < 5 and remaining:
                    selected.append(remaining.pop(random.randrange(len(remaining))))

                challenge.questions.set(selected[:5])
            elif pool:
                challenge.questions.set(pool[:5])

        return challenge


# ──────────────────────────────────────────────────────────────────────────────
#  USER CHALLENGE RESULT  —  tracks each user's daily challenge attempts
# ──────────────────────────────────────────────────────────────────────────────
class UserChallengeResult(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='challenge_results',
    )
    challenge = models.ForeignKey(DailyChallenge, on_delete=models.CASCADE, related_name='results')
    score = models.PositiveSmallIntegerField(default=0, help_text='Number of correct answers')
    total = models.PositiveSmallIntegerField(default=5)
    xp_earned = models.PositiveIntegerField(default=0)
    fuel_earned = models.PositiveIntegerField(default=0)
    time_taken = models.PositiveIntegerField(default=0, help_text='Total seconds taken')
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'challenge')
        ordering = ['-completed_at']
        verbose_name = 'Challenge Result'

    def __str__(self):
        return f'{self.user.username} — {self.challenge.date} ({self.score}/{self.total})'


# ──────────────────────────────────────────────────────────────────────────────
#  STREAK  —  consecutive daily challenge completions
# ──────────────────────────────────────────────────────────────────────────────
class UserStreak(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='challenge_streak',
    )
    current_streak = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)
    last_completed = models.DateField(null=True, blank=True)

    class Meta:
        verbose_name = 'User Streak'

    def __str__(self):
        return f'{self.user.username}: {self.current_streak} days'

    def update_streak(self):
        """Call after completing today's challenge."""
        today = timezone.now().date()
        if self.last_completed == today:
            return  # Already counted

        from datetime import timedelta
        yesterday = today - timedelta(days=1)

        if self.last_completed == yesterday:
            self.current_streak += 1
        else:
            self.current_streak = 1

        self.longest_streak = max(self.longest_streak, self.current_streak)
        self.last_completed = today
        self.save()


# ══════════════════════════════════════════════════════════════════════════════
#  QUIZ / TEST SESSION — full quiz attempts (separate from daily challenge)
# ══════════════════════════════════════════════════════════════════════════════
class QuizSession(models.Model):
    """A full quiz/test attempt by a user in a specific category."""
    QUIZ_CATEGORIES = [
        ('physics', 'Physics'),
        ('astronomy', 'Astronomy'),
        ('problems', 'Problems'),
        ('courses', 'Online Courses'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='quiz_sessions',
        null=True, blank=True,  # allow anonymous
    )
    category = models.CharField(max_length=20, choices=QUIZ_CATEGORIES)
    questions = models.ManyToManyField(ChallengeQuestion, related_name='quiz_sessions')
    score = models.PositiveSmallIntegerField(default=0)
    total = models.PositiveSmallIntegerField(default=0)
    percentage = models.FloatField(default=0.0)
    time_taken = models.PositiveIntegerField(default=0, help_text='Total seconds')
    xp_earned = models.PositiveIntegerField(default=0)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)

    class Meta:
        ordering = ['-started_at']
        verbose_name = 'Quiz Session'

    def __str__(self):
        user_str = self.user.username if self.user else 'anon'
        return f'{user_str} — {self.category} ({self.score}/{self.total})'


class QuizAnswer(models.Model):
    """Individual answer within a quiz session."""
    session = models.ForeignKey(QuizSession, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(ChallengeQuestion, on_delete=models.CASCADE)
    selected_answer = models.IntegerField(help_text='0-based index selected by user')
    is_correct = models.BooleanField(default=False)
    time_spent = models.PositiveIntegerField(default=0, help_text='Seconds spent on this question')

    class Meta:
        ordering = ['id']
        verbose_name = 'Quiz Answer'

    def __str__(self):
        return f'Q{self.question_id}: {"correct" if self.is_correct else "wrong"}'

