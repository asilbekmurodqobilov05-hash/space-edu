"""The progress app had no tests, and after ADR 0001 it is the only server-side
award path that existed before `gamification/award/`.

What matters here is that the server decides the reward and pays it once. The
removed `gamification/grant/` let the client name the amount, and one request
produced level 101.
"""
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.courses.models import Sphere, Topic, TopicLesson

from .models import UserLessonProgress, UserTopicEnrollment


class ProgressTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='u', email='u@e.com', password='x')
        self.client = APIClient()
        self.client.force_authenticate(self.user)

        self.sphere = Sphere.objects.create(slug='physics', title='Fizika', title_en='Physics')
        self.topic = Topic.objects.create(
            sphere=self.sphere, slug='physics-kinematics', title='Kinematika',
            order=1, fuel_reward=50,
        )
        self.one = TopicLesson.objects.create(
            topic=self.topic, slug='kin-one', name='One', order=0, xp_reward=25, fuel_reward=25,
        )
        self.two = TopicLesson.objects.create(
            topic=self.topic, slug='kin-two', name='Two', order=1, xp_reward=25, fuel_reward=25,
        )

    def _complete(self, slug, score=100):
        return self.client.post(
            f'/api/v1/progress/lessons/{slug}/complete/', {'score': score}, format='json',
        )

    # ── the reward ────────────────────────────────────────────────────
    def test_completing_a_lesson_pays_the_amount_the_lesson_names(self):
        r = self._complete('kin-one')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['xp_earned'], 25)
        self.assertEqual(r.data['fuel_earned'], 25)

    def test_the_client_cannot_name_its_own_reward(self):
        """`score` is the only thing the caller controls; XP comes from the row."""
        r = self.client.post(
            '/api/v1/progress/lessons/kin-one/complete/',
            {'score': 100, 'xp_earned': 99999, 'fuel_earned': 99999}, format='json',
        )
        self.assertEqual(r.data['xp_earned'], 25)
        self.user.gamification.refresh_from_db()
        self.assertEqual(self.user.gamification.xp, 25)

    def test_completing_the_same_lesson_again_pays_nothing(self):
        self._complete('kin-one')
        again = self._complete('kin-one')
        self.assertEqual(again.data['xp_earned'], 0)
        self.assertEqual(again.data['fuel_earned'], 0)
        self.user.gamification.refresh_from_db()
        self.assertEqual(self.user.gamification.xp, 25)

    def test_a_repeat_still_records_the_attempt_and_keeps_the_best_score(self):
        self._complete('kin-one', score=40)
        self._complete('kin-one', score=90)
        self._complete('kin-one', score=60)
        progress = UserLessonProgress.objects.get(user=self.user, lesson=self.one)
        self.assertEqual(progress.attempts, 3)
        self.assertEqual(progress.score, 90)
        self.assertTrue(progress.is_mastered)

    def test_an_out_of_range_score_is_rejected_rather_than_stored(self):
        r = self._complete('kin-one', score=1000)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(UserLessonProgress.objects.exists())

    def test_an_unknown_lesson_is_404_not_500(self):
        r = self._complete('no-such-lesson')
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)

    def test_anonymous_callers_are_refused(self):
        anon = APIClient()
        r = anon.post('/api/v1/progress/lessons/kin-one/complete/', {'score': 100}, format='json')
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    # ── the tree ──────────────────────────────────────────────────────
    def test_a_group_heading_cannot_be_completed(self):
        """A node with children is a heading. Letting it be completed would pay
        for the parent and every child, and would make the topic total wrong."""
        child = TopicLesson.objects.create(
            topic=self.topic, parent=self.one, slug='kin-one-a', name='Part A',
        )
        r = self._complete(self.one.slug)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self._complete(child.slug).status_code, status.HTTP_200_OK)

    def test_the_topic_bonus_is_paid_once_when_every_leaf_is_done(self):
        self._complete('kin-one')
        second = self._complete('kin-two')
        # 25 for the lesson itself, then the 50 the topic carries.
        self.assertEqual(second.data['fuel_earned'], 75)

        enrollment = UserTopicEnrollment.objects.get(user=self.user, topic=self.topic)
        self.assertIsNotNone(enrollment.completed_at)

        again = self._complete('kin-two')
        self.assertEqual(again.data['fuel_earned'], 0)

    def test_group_headings_do_not_block_a_topic_from_completing(self):
        """Counting every node rather than the leaves left topics with
        sub-lessons permanently one short of complete."""
        group = TopicLesson.objects.create(topic=self.topic, slug='kin-three', name='Three')
        leaf = TopicLesson.objects.create(
            topic=self.topic, parent=group, slug='kin-three-a', name='Part A',
        )
        self._complete('kin-one')
        self._complete('kin-two')
        last = self._complete(leaf.slug)
        self.assertGreater(last.data['fuel_earned'], leaf.fuel_reward)

    # ── reads ─────────────────────────────────────────────────────────
    def test_topic_progress_counts_leaves_not_nodes(self):
        group = TopicLesson.objects.create(topic=self.topic, slug='kin-four', name='Four')
        TopicLesson.objects.create(topic=self.topic, parent=group, slug='kin-four-a', name='A')
        r = self.client.get(f'/api/v1/progress/topics/{self.topic.slug}/')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        # kin-one, kin-two, kin-four-a — the group itself is not a lesson.
        self.assertEqual(r.data['total_lessons'], 3)

    def test_unknown_topic_is_404_not_500(self):
        self.assertEqual(
            self.client.get('/api/v1/progress/topics/nope/').status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_enrolling_twice_is_not_an_error(self):
        first = self.client.post(f'/api/v1/progress/topics/{self.topic.slug}/enroll/')
        second = self.client.post(f'/api/v1/progress/topics/{self.topic.slug}/enroll/')
        self.assertEqual(first.status_code, status.HTTP_201_CREATED)
        self.assertEqual(second.status_code, status.HTTP_200_OK)
        self.assertEqual(UserTopicEnrollment.objects.count(), 1)

    def test_progress_listing_is_scoped_to_the_caller(self):
        other = User.objects.create_user(username='o', email='o@e.com', password='x')
        UserLessonProgress.objects.create(user=other, lesson=self.one, score=100)
        r = self.client.get('/api/v1/progress/')
        self.assertEqual(r.data['lessons'], [])

    def test_the_deleted_unit_routes_are_gone(self):
        for path in ('/api/v1/progress/units/u1/', '/api/v1/progress/units/u1/enroll/'):
            self.assertEqual(
                self.client.get(path).status_code, status.HTTP_404_NOT_FOUND, path,
            )
