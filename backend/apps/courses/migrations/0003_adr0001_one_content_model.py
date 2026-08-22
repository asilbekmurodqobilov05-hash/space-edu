"""ADR 0001 — keep the Sphere branch, delete the Level branch.

The project carried two complete content models. The one with an admin UI had
no readers; the one with readers had no editor; the content lived in neither.
This collapses them onto the Sphere branch and gives `TopicLesson` a nullable
self-reference in place of the fixed fourth level `SubLesson`, which could not
represent `interviewsTopicsData` (topic -> section -> lesson -> sub-lesson).

Destructive by design: Level, Unit, Lesson, LessonSection and courses'
QuizQuestion go, along with anything referencing them. Their rows came from a
demo seed, not from students.
"""
import django.db.models.deletion
from django.db import migrations, models
from django.utils.text import slugify


def fill_slugs(apps, schema_editor):
    """Existing rows predate the slug. Both tables are empty in production; this
    keeps a populated development database migratable instead of exploding on
    the unique constraint."""
    Topic = apps.get_model('courses', 'Topic')
    TopicLesson = apps.get_model('courses', 'TopicLesson')

    for topic in Topic.objects.all():
        base = slugify(topic.title_en or topic.title) or 'topic'
        topic.slug = f'{base}-{topic.pk}'[:140]
        topic.save(update_fields=['slug'])

    for lesson in TopicLesson.objects.all():
        base = slugify(lesson.name_en or lesson.name) or 'lesson'
        lesson.slug = f'{base}-{lesson.pk}'[:200]
        lesson.save(update_fields=['slug'])


def promote_sub_lessons(apps, schema_editor):
    """Carry any SubLesson rows over as children before the model is dropped."""
    SubLesson = apps.get_model('courses', 'SubLesson')
    TopicLesson = apps.get_model('courses', 'TopicLesson')

    for sub in SubLesson.objects.select_related('parent_lesson').all():
        base = slugify(sub.name_en or sub.name) or 'lesson'
        TopicLesson.objects.create(
            topic_id=sub.parent_lesson.topic_id,
            parent_id=sub.parent_lesson_id,
            slug=f'{base}-sub-{sub.pk}'[:200],
            order=sub.order,
            name=sub.name,
            name_en=sub.name_en,
            name_ru=sub.name_ru,
            video_url=sub.video_url,
            content=sub.content,
        )


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0002_sphere_topic_topiclesson_sublesson_problem'),
        ('progress', '0002_adr0001_point_at_the_surviving_tree'),
    ]

    operations = [
        # ── the surviving tree gains slugs, a parent and rewards ──
        migrations.AddField(
            model_name='topic',
            name='slug',
            field=models.SlugField(max_length=140, null=True),
        ),
        migrations.AddField(
            model_name='topic',
            name='fuel_reward',
            field=models.PositiveIntegerField(
                default=50,
                help_text='Paid once, when every lesson in the topic is complete.',
            ),
        ),
        migrations.AddField(
            model_name='topiclesson',
            name='slug',
            field=models.SlugField(max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='topiclesson',
            name='parent',
            field=models.ForeignKey(
                blank=True, null=True,
                help_text='Empty for a top-level lesson.',
                on_delete=django.db.models.deletion.CASCADE,
                related_name='children', to='courses.topiclesson',
            ),
        ),
        migrations.AddField(
            model_name='topiclesson',
            name='xp_reward',
            field=models.PositiveIntegerField(default=25),
        ),
        migrations.AddField(
            model_name='topiclesson',
            name='fuel_reward',
            field=models.PositiveIntegerField(default=25),
        ),
        migrations.RunPython(fill_slugs, migrations.RunPython.noop),
        migrations.RunPython(promote_sub_lessons, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='topic',
            name='slug',
            field=models.SlugField(
                max_length=140, unique=True,
                help_text='Stable identifier, e.g. "physics-kinematika". Seeds key on this.',
            ),
        ),
        migrations.AlterField(
            model_name='topiclesson',
            name='slug',
            field=models.SlugField(
                max_length=200, unique=True,
                help_text='Stable identifier. Progress and awards key on this, '
                          'not on (parent, order).',
            ),
        ),

        # ── the Level branch, and the fixed fourth level, go ──
        # Child first. Dropping the foreign keys separately does not work here:
        # `Lesson` and `Unit` name theirs in `unique_together`, and SQLite
        # remakes the table on a field removal, which then fails on a constraint
        # referring to a column that has just gone.
        migrations.AlterUniqueTogether(name='lesson', unique_together=set()),
        migrations.AlterUniqueTogether(name='unit', unique_together=set()),
        migrations.DeleteModel(name='SubLesson'),
        migrations.DeleteModel(name='QuizQuestion'),
        migrations.DeleteModel(name='LessonSection'),
        migrations.DeleteModel(name='Lesson'),
        migrations.DeleteModel(name='Unit'),
        migrations.DeleteModel(name='Level'),
    ]
