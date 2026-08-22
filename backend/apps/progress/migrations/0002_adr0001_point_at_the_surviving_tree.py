"""ADR 0001 — repoint progress at the tree the site actually reads.

`UserLessonProgress.lesson` pointed at `courses.Lesson` and
`UserUnitEnrollment.unit` at `courses.Unit`: the two foreign keys into the Level
branch from outside the courses app, and the only reason it could not simply be
deleted.

The rows are dropped rather than remapped. They can only have come from the two
routes that reached the Level branch — `/unit/:unitId` and
`/lesson/:unitId/:lessonId` — which the navigation never linked to, and there is
no correspondence between a `Lesson` and a `TopicLesson` to remap them onto.
"""
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


def drop_orphaned_progress(apps, schema_editor):
    apps.get_model('progress', 'UserLessonProgress').objects.all().delete()
    apps.get_model('progress', 'UserUnitEnrollment').objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('progress', '0001_initial'),
        ('courses', '0002_sphere_topic_topiclesson_sublesson_problem'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RunPython(drop_orphaned_progress, migrations.RunPython.noop),

        migrations.AlterField(
            model_name='userlessonprogress',
            name='lesson',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to='courses.topiclesson',
            ),
        ),

        migrations.RenameModel(old_name='UserUnitEnrollment', new_name='UserTopicEnrollment'),
        migrations.RenameField(model_name='usertopicenrollment', old_name='unit', new_name='topic'),
        migrations.AlterField(
            model_name='usertopicenrollment',
            name='topic',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to='courses.topic',
            ),
        ),
        migrations.AlterUniqueTogether(
            name='usertopicenrollment', unique_together={('user', 'topic')},
        ),
        migrations.AlterModelOptions(
            name='usertopicenrollment', options={'verbose_name': 'Topic Enrollment'},
        ),
    ]
