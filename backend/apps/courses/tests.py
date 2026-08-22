"""Regression tests for findings from the 2026-08-22 audit, plus the tree
invariants ADR 0001 introduced."""
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.accounts.models import User

from .models import Problem, Sphere, Topic, TopicLesson


def _rows(response):
    data = response.data
    return data['results'] if isinstance(data, dict) and 'results' in data else data


class CoursesAnswerKeyTests(TestCase):
    """Finding: the courses app leaked answers in three places, all under
    AdminWriteOrReadOnly (anonymous read) — QuizQuestionSerializer.correct_answer,
    the same serializer nested in LessonDetailSerializer, and
    ProblemSerializer.answer for the whole Masalalar set.

    Two of the three are gone with the Level branch (ADR 0001); `Problem` is the
    one that survived, so it is the one still worth a test."""

    def setUp(self):
        self.sphere = Sphere.objects.create(slug='problems', title='Masalalar', title_en='Problems')
        Problem.objects.create(
            sphere=self.sphere, number=1, question='2+2?', answer='4', explanation='Trivial.'
        )
        self.anon = APIClient()
        self.staff = APIClient()
        self.staff.force_authenticate(
            User.objects.create_user(username='t', email='t@e.com', password='x', is_staff=True)
        )

    def test_anonymous_problem_listing_hides_the_answer(self):
        r = self.anon.get('/api/v1/courses/problems/')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        for row in _rows(r):
            self.assertNotIn('answer', row)
            self.assertNotIn('explanation', row)

    def test_staff_still_sees_answers(self):
        p = self.staff.get('/api/v1/courses/problems/')
        self.assertIn('answer', _rows(p)[0])

    def test_the_deleted_answer_key_endpoints_are_really_gone(self):
        """`/courses/questions/` and `/courses/lessons/` served the answer key
        under an anonymous-read permission. Both left with the Level branch."""
        for path in ('/api/v1/courses/questions/', '/api/v1/courses/lessons/',
                     '/api/v1/courses/levels/', '/api/v1/courses/units/',
                     '/api/v1/courses/sections/', '/api/v1/courses/sub-lessons/'):
            r = self.anon.get(path)
            self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND, path)


class SlugLookupTests(TestCase):
    """Finding: UnitViewSet/LessonViewSet used lookup_field='slug' while the model
    only guaranteed uniqueness per parent, so two levels with a same-named unit
    turned a detail request into MultipleObjectsReturned -> 500.

    The replacement models make slugs globally unique, which removes the failure
    mode rather than working around it."""

    def setUp(self):
        self.sphere = Sphere.objects.create(slug='physics', title='Fizika', title_en='Physics')
        self.a = Topic.objects.create(sphere=self.sphere, slug='physics-a', title='A', order=1)
        self.b = Topic.objects.create(sphere=self.sphere, slug='physics-b', title='B', order=2)
        self.anon = APIClient()

    def test_topic_slugs_are_globally_unique(self):
        from django.db import IntegrityError, transaction
        with self.assertRaises(IntegrityError), transaction.atomic():
            Topic.objects.create(sphere=self.sphere, slug='physics-a', title='Clash')

    def test_lesson_slugs_are_globally_unique(self):
        from django.db import IntegrityError, transaction
        TopicLesson.objects.create(topic=self.a, slug='shared', name='One')
        with self.assertRaises(IntegrityError), transaction.atomic():
            TopicLesson.objects.create(topic=self.b, slug='shared', name='Two')

    def test_topic_detail_by_slug_answers(self):
        r = self.anon.get(f'/api/v1/courses/topics/{self.a.slug}/')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['slug'], 'physics-a')


class LessonTreeTests(TestCase):
    """ADR 0001 replaced the fixed Sphere -> Topic -> TopicLesson -> SubLesson
    shape with `TopicLesson.parent`. These lock the invariants that depends on."""

    def setUp(self):
        self.sphere = Sphere.objects.create(slug='interviews', title='Intervyular',
                                            title_en='Interviews')
        self.topic = Topic.objects.create(
            sphere=self.sphere, slug='interviews-professors', title='Professorlar', order=1,
        )
        self.section = TopicLesson.objects.create(
            topic=self.topic, slug='iv-astronomy', name='Astronomy', order=0,
        )
        self.lesson = TopicLesson.objects.create(
            topic=self.topic, parent=self.section, slug='iv-tyson', name='Neil deGrasse Tyson',
        )
        self.part = TopicLesson.objects.create(
            topic=self.topic, parent=self.lesson, slug='iv-tyson-early', name='Early Career',
        )
        self.anon = APIClient()
        self.staff = APIClient()
        self.staff.force_authenticate(
            User.objects.create_user(username='s', email='s@e.com', password='x', is_staff=True)
        )

    def test_the_tree_can_be_three_deep_which_sub_lesson_could_not_represent(self):
        """`interviewsTopicsData` nests topic -> section -> lesson -> sub-lesson.
        The old fixed tree had room for two levels below a topic, so this shape
        was unrepresentable — the reason SubLesson went."""
        r = self.anon.get(f'/api/v1/courses/topics/{self.topic.slug}/')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        roots = r.data['lessons']
        self.assertEqual(len(roots), 1)
        self.assertEqual(roots[0]['slug'], 'iv-astronomy')
        self.assertEqual(roots[0]['children'][0]['slug'], 'iv-tyson')
        self.assertEqual(roots[0]['children'][0]['children'][0]['slug'], 'iv-tyson-early')

    def test_topic_detail_lists_roots_only_so_children_are_not_counted_twice(self):
        r = self.anon.get(f'/api/v1/courses/topics/{self.topic.slug}/')
        self.assertEqual([node['slug'] for node in r.data['lessons']], ['iv-astronomy'])

    def test_is_leaf_marks_only_the_bottom_of_the_tree(self):
        self.assertFalse(self.section.is_leaf)
        self.assertFalse(self.lesson.is_leaf)
        self.assertTrue(self.part.is_leaf)

    def test_a_lesson_cannot_be_reparented_into_another_topic(self):
        other = Topic.objects.create(sphere=self.sphere, slug='interviews-other', title='Other')
        r = self.staff.patch(
            f'/api/v1/courses/topic-lessons/{self.part.slug}/',
            {'topic': other.id, 'parent': self.lesson.id}, format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('parent', r.data)

    def test_a_lesson_cannot_be_its_own_parent(self):
        r = self.staff.patch(
            f'/api/v1/courses/topic-lessons/{self.part.slug}/',
            {'parent': self.part.id}, format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_anonymous_callers_cannot_write(self):
        r = self.anon.patch(
            f'/api/v1/courses/topic-lessons/{self.part.slug}/', {'name': 'x'}, format='json',
        )
        self.assertIn(r.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))


class SphereTreeTests(TestCase):
    """`/courses/spheres/<slug>/tree/` is what the learn screens read. It has to
    return the whole subject in a flat number of queries — the recursive
    serializer costs one query per node, which is ~170 for astronomy."""

    def setUp(self):
        from django.core.management import call_command
        from io import StringIO
        call_command('seed_learn_content', stdout=StringIO(), stderr=StringIO())
        self.anon = APIClient()

    def test_it_returns_the_whole_subject(self):
        r = self.anon.get('/api/v1/courses/spheres/astronomy/tree/')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(len(r.data['topics']), 4)
        first = r.data['topics'][0]
        self.assertTrue(first['lessons'])
        self.assertTrue(first['lessons'][0]['children'])

    def test_query_count_does_not_grow_with_the_content(self):
        from django.db import connection
        from django.test.utils import CaptureQueriesContext

        def count(slug):
            with CaptureQueriesContext(connection) as ctx:
                self.anon.get(f'/api/v1/courses/spheres/{slug}/tree/')
            return len(ctx.captured_queries)

        # creativity has 76 lesson nodes, astronomy 168. A per-node query would
        # more than double between them.
        self.assertEqual(count('creativity'), count('astronomy'))

    def test_a_child_appears_once_under_its_parent_and_not_at_the_root(self):
        r = self.anon.get('/api/v1/courses/spheres/interviews/tree/')
        topic = next(t for t in r.data['topics'] if t['slug'] == 'interviews-professors')
        root_slugs = {node['slug'] for node in topic['lessons']}
        self.assertNotIn('interviews-professors-neil-degrasse-tyson', root_slugs)
        section = topic['lessons'][0]
        self.assertIn(
            'interviews-professors-neil-degrasse-tyson',
            {child['slug'] for child in section['children']},
        )

    def test_an_unknown_sphere_is_404(self):
        r = self.anon.get('/api/v1/courses/spheres/nope/tree/')
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)
