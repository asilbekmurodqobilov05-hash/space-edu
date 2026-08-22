"""Seed commands must run, and must not lie about what they did.

Findings from the 2026-08-22 audit: `seed` raised ValueError on its first
question and rolled everything back, so the documented "seed demo content"
command had never worked; `seed_courses` targeted Level slugs that do not exist,
created nothing, printed "Seed complete" and exited 0.

`seed_courses` and `seed_learn_data` are gone with the Level branch (ADR 0001).
`seed_learn_content` replaces them and is what these tests now cover.
"""
import json
from io import StringIO
from pathlib import Path

from django.core.management import CommandError, call_command
from django.test import TestCase

from apps.gamification.models import Badge

from .models import Sphere, Topic, TopicLesson

FIXTURE = Path(__file__).resolve().parent / 'fixtures' / 'learn_content.json'


def _seed(*args, **kwargs):
    call_command(*args, stdout=StringIO(), stderr=StringIO(), **kwargs)


class SeedCommandTests(TestCase):
    def test_seed_creates_the_demo_content(self):
        _seed('seed')
        self.assertGreater(Badge.objects.count(), 0, 'seed created no badges')

    def test_seed_is_idempotent(self):
        _seed('seed')
        before = Badge.objects.count()
        _seed('seed')
        self.assertEqual(before, Badge.objects.count(), 'running seed twice duplicated rows')

    def test_the_deleted_seed_commands_are_gone(self):
        for name in ('seed_courses', 'seed_learn_data'):
            with self.assertRaises(CommandError, msg=f'{name} still exists'):
                call_command(name, stdout=StringIO(), stderr=StringIO())


class SeedLearnContentTests(TestCase):
    def test_it_loads_every_subject(self):
        _seed('seed_learn_content')
        self.assertEqual(
            sorted(Sphere.objects.values_list('slug', flat=True)),
            ['astronomy', 'creativity', 'interviews', 'physics', 'problems'],
        )
        # 23 topics is the count the ADR was written against.
        self.assertEqual(Topic.objects.count(), 23)
        self.assertGreater(TopicLesson.objects.count(), 400)

    def test_it_is_idempotent(self):
        _seed('seed_learn_content')
        counts = (Sphere.objects.count(), Topic.objects.count(), TopicLesson.objects.count())
        _seed('seed_learn_content')
        self.assertEqual(
            counts,
            (Sphere.objects.count(), Topic.objects.count(), TopicLesson.objects.count()),
            'running it twice duplicated rows',
        )

    def test_reordering_a_topic_does_not_orphan_its_lessons(self):
        """The audit found seeds keyed on (parent, order). Re-ordering content
        then created a second copy of everything beneath it."""
        _seed('seed_learn_content')
        topic = Topic.objects.get(slug='physics-kinematics')
        lesson_ids = set(topic.lessons.values_list('id', flat=True))
        topic.order = 99
        topic.save(update_fields=['order'])

        _seed('seed_learn_content')
        topic.refresh_from_db()
        self.assertEqual(set(topic.lessons.values_list('id', flat=True)), lesson_ids)

    def test_it_rebuilds_the_nesting_the_fixed_tree_could_not_hold(self):
        _seed('seed_learn_content')
        section = TopicLesson.objects.get(slug='interviews-professors-astronomy')
        self.assertIsNone(section.parent)
        lesson = section.children.first()
        self.assertIsNotNone(lesson)
        self.assertGreater(lesson.children.count(), 0, 'third level lost')
        # Every node keeps its topic, child included, so progress counting stays flat.
        self.assertEqual(lesson.children.first().topic_id, section.topic_id)

    def test_lessons_count_on_the_sphere_card_is_computed_not_typed(self):
        """The old seed hard-coded these and every one of them was wrong."""
        _seed('seed_learn_content')
        # The Masalalar card counts problems rather than lessons; it has its
        # own assertion in SeedProblemsTests.
        for sphere in Sphere.objects.exclude(slug='problems'):
            leaves = TopicLesson.objects.filter(
                topic__sphere=sphere, children__isnull=True,
            ).count()
            self.assertEqual(sphere.lessons_count, leaves, sphere.slug)

    def test_prune_removes_what_left_the_fixture(self):
        _seed('seed_learn_content')
        sphere = Sphere.objects.get(slug='physics')
        Topic.objects.create(sphere=sphere, slug='physics-retired', title='Retired')

        _seed('seed_learn_content', prune=True)
        self.assertFalse(Topic.objects.filter(slug='physics-retired').exists())

    def test_without_prune_extra_rows_survive(self):
        """An admin-authored topic must not vanish because the seed ran."""
        _seed('seed_learn_content')
        sphere = Sphere.objects.get(slug='physics')
        Topic.objects.create(sphere=sphere, slug='physics-hand-written', title='By hand')

        _seed('seed_learn_content')
        self.assertTrue(Topic.objects.filter(slug='physics-hand-written').exists())

    def test_a_missing_fixture_fails_loudly(self):
        with self.assertRaises(CommandError) as ctx:
            _seed('seed_learn_content', fixture='does-not-exist.json')
        self.assertIn('export-learn-content', str(ctx.exception))


class FixtureShapeTests(TestCase):
    """The fixture is generated, so the thing worth testing is that what is
    committed is loadable and internally consistent."""

    def setUp(self):
        self.data = json.loads(FIXTURE.read_text(encoding='utf-8'))

    def test_every_slug_is_unique(self):
        slugs = []

        def walk(nodes):
            for node in nodes:
                slugs.append(node['slug'])
                walk(node['children'])

        for sphere in self.data['spheres']:
            slugs.append(sphere['slug'])
            for topic in sphere['topics']:
                slugs.append(topic['slug'])
                walk(topic['lessons'])

        duplicates = {s for s in slugs if slugs.count(s) > 1}
        self.assertEqual(duplicates, set())

    def test_every_topic_carries_all_three_languages(self):
        for sphere in self.data['spheres']:
            for topic in sphere['topics']:
                for field in ('title', 'title_en', 'title_ru'):
                    self.assertTrue(topic[field], f"{topic['slug']} is missing {field}")


class SeedProblemsTests(TestCase):
    """The Masalalar set had never been seeded — it lived only in
    `problemsData.js`, which is also how its answers reached the browser."""

    def test_it_loads_the_written_problems(self):
        from .models import Problem

        _seed('seed_learn_content')
        self.assertEqual(Problem.objects.count(), 30)
        self.assertTrue(Problem.objects.filter(answer='Harakat').exists())

    def test_it_leaves_out_the_115_placeholders(self):
        """`problemsData` holds 145 entries, 115 of them generated filler —
        "Masala #47: Bu yerda fizika masalasi matni bo'ladi" with an answer
        taken off a cycling list. Seeding those would put nonsense in front of
        a student and make the site's "145 problems" claim true in the worst
        possible way."""
        from .models import Problem

        _seed('seed_learn_content')
        self.assertFalse(
            Problem.objects.filter(question__startswith='Masala #').exists(),
        )

    def test_it_is_idempotent(self):
        from .models import Problem

        _seed('seed_learn_content')
        _seed('seed_learn_content')
        self.assertEqual(Problem.objects.count(), 30)

    def test_the_sphere_card_counts_the_problems(self):
        _seed('seed_learn_content')
        self.assertEqual(Sphere.objects.get(slug='problems').lessons_count, 30)
