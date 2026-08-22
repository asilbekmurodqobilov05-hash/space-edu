"""Seed commands must run, and must not lie about what they did.

Findings from the 2026-08-22 audit: `seed` raised ValueError on its first
question and rolled everything back, so the documented "seed demo content"
command had never worked; `seed_courses` targeted Level slugs that do not exist,
created nothing, printed "Seed complete" and exited 0.
"""
from io import StringIO

from django.core.management import CommandError, call_command
from django.test import TestCase

from .models import Lesson, Level, QuizQuestion, Unit


class SeedCommandTests(TestCase):
    def test_seed_creates_the_demo_content(self):
        out = StringIO()
        call_command('seed', stdout=out, stderr=StringIO())

        self.assertGreater(Level.objects.count(), 0, 'seed created no levels')
        self.assertGreater(Unit.objects.count(), 0, 'seed created no units')
        self.assertGreater(Lesson.objects.count(), 0, 'seed created no lessons')
        self.assertGreater(QuizQuestion.objects.count(), 0, 'seed created no questions')

    def test_seed_is_idempotent(self):
        call_command('seed', stdout=StringIO(), stderr=StringIO())
        counts = (Level.objects.count(), Unit.objects.count(), Lesson.objects.count())
        call_command('seed', stdout=StringIO(), stderr=StringIO())
        self.assertEqual(
            counts,
            (Level.objects.count(), Unit.objects.count(), Lesson.objects.count()),
            'running seed twice duplicated rows',
        )

    def test_every_seeded_question_has_a_valid_answer_index(self):
        call_command('seed', stdout=StringIO(), stderr=StringIO())
        for q in QuizQuestion.objects.all():
            option_ids = [o['id'] for o in q.options if isinstance(o, dict) and 'id' in o]
            self.assertIn(
                q.correct_answer, option_ids,
                f'{q.lesson.slug} Q{q.order}: correct_answer {q.correct_answer!r} '
                f'is not one of {option_ids}',
            )

    def test_seed_courses_refuses_rather_than_silently_doing_nothing(self):
        """It used to print success after creating zero rows."""
        with self.assertRaises(CommandError) as ctx:
            call_command('seed_courses', stdout=StringIO(), stderr=StringIO())
        self.assertIn('do not exist', str(ctx.exception))


class SeedScriptTests(TestCase):
    def test_seed_badges_points_at_a_real_settings_module(self):
        """It named `config.settings`, which this project has never had, so the
        script died on import — and badges have no management command."""
        from pathlib import Path

        source = (Path(__file__).resolve().parent.parent.parent / 'seed_badges.py').read_text(
            encoding='utf8'
        )
        self.assertIn('base.settings', source)
        self.assertNotIn('config.settings', source)
