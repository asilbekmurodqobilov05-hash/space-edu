from django.db import models
from django.utils.text import slugify


def unique_slug(model, source, pk=None):
    """Derive a slug from the title, and make it unique by suffixing.

    The admin panel posts a title and no slug — that contract predates the
    field and must keep working (see `apps/admin_api/tests.py`). Content is
    also written in Uzbek and Russian, which slugify empties, hence the
    fallback.
    """
    base = slugify(source)[:150] or model.__name__.lower()
    candidate, n = base, 1
    others = model.objects.exclude(pk=pk) if pk else model.objects.all()
    while others.filter(slug=candidate).exists():
        n += 1
        candidate = f'{base}-{n}'
    return candidate


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
    slug = models.SlugField(
        max_length=140, unique=True, blank=True,
        help_text='Stable identifier, e.g. "physics-kinematika". Seeds key on this. '
                  'Derived from the English title when left empty.',
    )
    order = models.PositiveSmallIntegerField(default=0)
    title = models.CharField(max_length=200)
    title_en = models.CharField(max_length=200, blank=True, default='')
    title_ru = models.CharField(max_length=200, blank=True, default='')
    color = models.CharField(max_length=24, blank=True, default='')
    description = models.TextField(blank=True, default='')

    fuel_reward = models.PositiveIntegerField(
        default=50, help_text='Paid once, when every lesson in the topic is complete.',
    )

    class Meta:
        ordering = ['order']
        verbose_name = 'Topic'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slug(Topic, self.title_en or self.title, self.pk)
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.sphere.slug} / {self.title}'


# ──────────────────────────────────────────────────────────────────────────────
#  TOPIC LESSON  —  individual lesson within a Topic
# ──────────────────────────────────────────────────────────────────────────────
class TopicLesson(models.Model):
    """A node in a topic's lesson tree.

    `parent` replaced the old fixed Sphere -> Topic -> TopicLesson -> SubLesson
    shape (ADR 0001, question left open there). Four levels was both too many and
    too few: `physicsTopicsData` has no sub-lessons at all, while
    `interviewsTopicsData` nests topic -> section -> lesson -> sub-lesson, which
    the fixed tree could not represent. A nullable self-reference holds every
    subject, and the admin panel edits children through the same lessons tab.

    `topic` stays set on every node, child included, so "all lessons in this
    topic" is one flat filter rather than a recursive walk.
    """

    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='lessons')
    parent = models.ForeignKey(
        'self', on_delete=models.CASCADE, related_name='children',
        null=True, blank=True,
        help_text='Empty for a top-level lesson.',
    )
    slug = models.SlugField(
        max_length=200, unique=True, blank=True,
        help_text='Stable identifier. Progress and awards key on this, not on '
                  '(parent, order). Derived from the English name when left empty.',
    )
    order = models.PositiveSmallIntegerField(default=0)
    name = models.CharField(max_length=300)
    name_en = models.CharField(max_length=300, blank=True, default='')
    name_ru = models.CharField(max_length=300, blank=True, default='')
    video_url = models.URLField(blank=True, default='')
    content = models.TextField(blank=True, default='', help_text='Lesson text/markdown content')

    xp_reward = models.PositiveIntegerField(default=25)
    fuel_reward = models.PositiveIntegerField(default=25)

    class Meta:
        ordering = ['order']
        verbose_name = 'Topic Lesson'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slug(TopicLesson, self.name_en or self.name, self.pk)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    @property
    def is_leaf(self):
        """Only leaves are completable — a group node is a heading, not a lesson."""
        return not self.children.exists()


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
