"""Regression tests for findings from the 2026-08-22 audit."""
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.accounts.models import User

from .models import Lesson, Level, Problem, QuizQuestion, Sphere, Unit


def _rows(response):
    data = response.data
    return data['results'] if isinstance(data, dict) and 'results' in data else data


class CoursesAnswerKeyTests(TestCase):
    """Finding: the courses app leaked answers in three places, all under
    AdminWriteOrReadOnly (anonymous read) — QuizQuestionSerializer.correct_answer,
    the same serializer nested in LessonDetailSerializer, and
    ProblemSerializer.answer for the whole Masalalar set. Fixing the identical
    leak in the challenges app did not touch any of these."""

    def setUp(self):
        self.sphere = Sphere.objects.create(slug='problems', title='Masalalar', title_en='Problems')
        Problem.objects.create(
            sphere=self.sphere, number=1, question='2+2?', answer='4', explanation='Trivial.'
        )
        self.level = Level.objects.create(
            slug='solar', order=1, title_en='Solar', title_uz='Quyosh', title_ru='Солнце',
            description_en='d', description_uz='d', description_ru='d', icon='Sun', color='#fff',
        )
        self.unit = Unit.objects.create(
            level=self.level, slug='u1', order=1,
            title_en='U', title_uz='U', title_ru='U',
        )
        self.lesson = Lesson.objects.create(
            unit=self.unit, slug='l1', order=1,
            title_en='L', title_uz='L', title_ru='L', lesson_type='quiz',
        )
        QuizQuestion.objects.create(
            lesson=self.lesson, order=1,
            text_en='q', text_uz='q', text_ru='q',
            options=[{'id': 'A'}, {'id': 'B'}], correct_answer='A',
            explanation_en='e', explanation_uz='e', explanation_ru='e',
        )
        self.anon = APIClient()
        self.staff = APIClient()
        self.staff.force_authenticate(
            User.objects.create_user(username='t', email='t@e.com', password='x', is_staff=True)
        )

    def test_anonymous_question_listing_hides_correct_answer(self):
        r = self.anon.get('/api/v1/courses/questions/')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        for row in _rows(r):
            self.assertNotIn('correct_answer', row)

    def test_anonymous_lesson_detail_hides_nested_correct_answer(self):
        r = self.anon.get(f'/api/v1/courses/lessons/{self.lesson.slug}/')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        for q in r.data.get('questions', []):
            self.assertNotIn('correct_answer', q)

    def test_anonymous_problem_listing_hides_the_answer(self):
        r = self.anon.get('/api/v1/courses/problems/')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        for row in _rows(r):
            self.assertNotIn('answer', row)

    def test_staff_still_sees_answers(self):
        q = self.staff.get('/api/v1/courses/questions/')
        self.assertIn('correct_answer', _rows(q)[0])
        p = self.staff.get('/api/v1/courses/problems/')
        self.assertIn('answer', _rows(p)[0])


class SlugLookupTests(TestCase):
    """Finding: UnitViewSet/LessonViewSet used lookup_field='slug' while the model
    only guarantees uniqueness per parent (unique_together), so two levels with a
    same-named unit turned a detail request into MultipleObjectsReturned -> 500."""

    def setUp(self):
        common = dict(
            description_en='d', description_uz='d', description_ru='d', icon='i', color='#fff'
        )
        self.l1 = Level.objects.create(
            slug='lvl-1', order=1, title_en='A', title_uz='A', title_ru='A', **common
        )
        self.l2 = Level.objects.create(
            slug='lvl-2', order=2, title_en='B', title_uz='B', title_ru='B', **common
        )
        for lvl in (self.l1, self.l2):
            Unit.objects.create(
                level=lvl, slug='intro', order=1, title_en='I', title_uz='I', title_ru='I'
            )
        self.anon = APIClient()

    def test_duplicate_unit_slug_across_levels_does_not_500(self):
        r = self.anon.get('/api/v1/courses/units/intro/')
        self.assertLess(r.status_code, 500)
