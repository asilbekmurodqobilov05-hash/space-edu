from django.db import models


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
