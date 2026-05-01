from django.db import models


# ──────────────────────────────────────────────────────────────────────────────
#  SPHERE  —  top-level educational area (Physics, Astronomy, Problems, etc.)
# ──────────────────────────────────────────────────────────────────────────────
class Sphere(models.Model):
    slug = models.SlugField(unique=True, help_text='URL-safe identifier, e.g. "physics"')
    order = models.PositiveSmallIntegerField(default=0)
    title = models.CharField(max_length=120, help_text='Display title (Uzbek)')
    title_en = models.CharField(max_length=120)
    title_ru = models.CharField(max_length=120, blank=True, default='')
    description = models.TextField(blank=True, default='')
    description_en = models.TextField(blank=True, default='')
    color = models.CharField(max_length=24, default='#a78bfa', help_text='Hex color for UI')
    icon = models.CharField(max_length=50, default='BookOpen', help_text='Lucide icon name')
    link = models.CharField(max_length=120, blank=True, default='', help_text='Frontend route, e.g. /learn/physics')
    lessons_count = models.PositiveIntegerField(default=0, help_text='Cached count for card display')
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Sphere'
        verbose_name_plural = 'Spheres'

    def __str__(self):
        return f'{self.title} ({self.slug})'


# ──────────────────────────────────────────────────────────────────────────────
#  TOPIC  —  a subject area within a Sphere (e.g. "Kinematika" in Physics)
# ──────────────────────────────────────────────────────────────────────────────
class Topic(models.Model):
    sphere = models.ForeignKey(Sphere, on_delete=models.CASCADE, related_name='topics')
    order = models.PositiveSmallIntegerField(default=0)
    title = models.CharField(max_length=200)
    title_en = models.CharField(max_length=200, blank=True, default='')
    title_ru = models.CharField(max_length=200, blank=True, default='')
    color = models.CharField(max_length=24, blank=True, default='')
    description = models.TextField(blank=True, default='')

    class Meta:
        ordering = ['order']
        verbose_name = 'Topic'

    def __str__(self):
        return f'{self.sphere.slug} / {self.title}'


# ──────────────────────────────────────────────────────────────────────────────
#  TOPIC LESSON  —  individual lesson within a Topic
# ──────────────────────────────────────────────────────────────────────────────
class TopicLesson(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='lessons')
    order = models.PositiveSmallIntegerField(default=0)
    name = models.CharField(max_length=300)
    name_en = models.CharField(max_length=300, blank=True, default='')
    name_ru = models.CharField(max_length=300, blank=True, default='')
    video_url = models.URLField(blank=True, default='')
    content = models.TextField(blank=True, default='', help_text='Lesson text/markdown content')

    class Meta:
        ordering = ['order']
        verbose_name = 'Topic Lesson'

    def __str__(self):
        return self.name


# ──────────────────────────────────────────────────────────────────────────────
#  SUB-LESSON  —  nested lesson (for Astronomy, Interviews, Creativity)
# ──────────────────────────────────────────────────────────────────────────────
class SubLesson(models.Model):
    parent_lesson = models.ForeignKey(TopicLesson, on_delete=models.CASCADE, related_name='sub_lessons')
    order = models.PositiveSmallIntegerField(default=0)
    name = models.CharField(max_length=300)
    name_en = models.CharField(max_length=300, blank=True, default='')
    name_ru = models.CharField(max_length=300, blank=True, default='')
    video_url = models.URLField(blank=True, default='')
    content = models.TextField(blank=True, default='')

    class Meta:
        ordering = ['order']
        verbose_name = 'Sub-Lesson'

    def __str__(self):
        return self.name


# ──────────────────────────────────────────────────────────────────────────────
#  PROBLEM  —  standalone question with answer (Masalalar sphere)
# ──────────────────────────────────────────────────────────────────────────────
class Problem(models.Model):
    sphere = models.ForeignKey(Sphere, on_delete=models.CASCADE, related_name='problems')
    number = models.PositiveIntegerField(help_text='Problem number for display')
    question = models.TextField()
    question_en = models.TextField(blank=True, default='')
    question_ru = models.TextField(blank=True, default='')
    answer = models.CharField(max_length=500)
    explanation = models.TextField(blank=True, default='')
    explanation_en = models.TextField(blank=True, default='')
    difficulty = models.CharField(
        max_length=12,
        choices=[('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')],
        default='medium',
    )

    class Meta:
        ordering = ['number']
        unique_together = ('sphere', 'number')
        verbose_name = 'Problem'

    def __str__(self):
        return f'Problem #{self.number}'


# ──────────────────────────────────────────────────────────────────────────────
#  LEGACY MODELS  (kept for backwards compat — existing Levels/Units/Lessons)
# ──────────────────────────────────────────────────────────────────────────────
class Level(models.Model):
    slug = models.SlugField(unique=True)
    order = models.PositiveSmallIntegerField()
    title_en = models.CharField(max_length=100)
    title_uz = models.CharField(max_length=100)
    title_ru = models.CharField(max_length=100)
    description_en = models.TextField()
    description_uz = models.TextField()
    description_ru = models.TextField()
    icon = models.CharField(max_length=50)
    color = models.CharField(max_length=20)

    class Meta:
        ordering = ['order']
        verbose_name = 'Level'

    def __str__(self):
        return self.slug


class Unit(models.Model):
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name='units')
    slug = models.SlugField()
    order = models.PositiveSmallIntegerField()
    title_en = models.CharField(max_length=100)
    title_uz = models.CharField(max_length=100)
    title_ru = models.CharField(max_length=100)
    xp_reward = models.PositiveIntegerField(default=100)
    fuel_reward = models.PositiveIntegerField(default=50)

    class Meta:
        ordering = ['order']
        unique_together = ('level', 'slug')
        verbose_name = 'Unit'

    def __str__(self):
        return self.slug


class Lesson(models.Model):
    LESSON_TYPES = [
        ('explanation', 'Explanation'),
        ('quiz', 'Quiz'),
        ('video', 'Video'),
        ('simulation', 'Simulation'),
    ]
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name='lessons')
    slug = models.SlugField()
    order = models.PositiveSmallIntegerField()
    title_en = models.CharField(max_length=100)
    title_uz = models.CharField(max_length=100)
    title_ru = models.CharField(max_length=100)
    lesson_type = models.CharField(max_length=20, choices=LESSON_TYPES)
    xp_reward = models.PositiveIntegerField(default=50)
    estimated_minutes = models.PositiveSmallIntegerField(default=10)

    class Meta:
        ordering = ['order']
        unique_together = ('unit', 'slug')
        verbose_name = 'Lesson'

    def __str__(self):
        return self.slug


class LessonSection(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='sections')
    order = models.PositiveSmallIntegerField()
    section_type = models.CharField(max_length=20)
    content_en = models.JSONField(default=dict)
    content_uz = models.JSONField(default=dict)
    content_ru = models.JSONField(default=dict)

    class Meta:
        ordering = ['order']
        verbose_name = 'Lesson Section'

    def __str__(self):
        return f'{self.lesson.slug} — section {self.order}'


class QuizQuestion(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='questions')
    order = models.PositiveSmallIntegerField()
    text_en = models.TextField()
    text_uz = models.TextField()
    text_ru = models.TextField()
    options = models.JSONField()
    correct_answer = models.CharField(max_length=1)
    explanation_en = models.TextField()
    explanation_uz = models.TextField()
    explanation_ru = models.TextField()

    class Meta:
        ordering = ['order']
        verbose_name = 'Quiz Question'

    def __str__(self):
        return f'{self.lesson.slug} — Q{self.order}'
