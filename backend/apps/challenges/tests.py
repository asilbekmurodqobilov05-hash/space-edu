"""Regression tests for findings from the 2026-08-22 audit."""
from django.core.cache import cache
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.accounts.models import User

from .models import ChallengeQuestion, DailyChallenge, QuizSession


def _question(i=0, category='physics', difficulty='easy', correct=1):
    return ChallengeQuestion.objects.create(
        category=category,
        difficulty=difficulty,
        question=f'Savol {i}',
        options=['a', 'b', 'c', 'd'],
        correct_answer=correct,
    )


class AnswerKeyExposureTests(TestCase):
    """Finding: ChallengeQuestionViewSet served ChallengeQuestionFullSerializer
    (which carries correct_answer) under AdminWriteOrReadOnly, so an anonymous
    GET returned the whole answer key."""

    def setUp(self):
        cache.clear()
        self.q = _question()
        self.anon = APIClient()

    def _payload_rows(self, response):
        data = response.data
        return data['results'] if isinstance(data, dict) and 'results' in data else data

    def test_anonymous_listing_hides_correct_answer(self):
        r = self.anon.get('/api/v1/challenges/questions/')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        for row in self._payload_rows(r):
            self.assertNotIn('correct_answer', row)

    def test_authenticated_non_staff_listing_hides_correct_answer(self):
        user = User.objects.create_user(username='pupil', email='p@e.com', password='x')
        c = APIClient()
        c.force_authenticate(user)
        r = c.get('/api/v1/challenges/questions/')
        for row in self._payload_rows(r):
            self.assertNotIn('correct_answer', row)

    def test_staff_listing_still_shows_correct_answer(self):
        staff = User.objects.create_user(
            username='teacher', email='t@e.com', password='x', is_staff=True
        )
        c = APIClient()
        c.force_authenticate(staff)
        r = c.get('/api/v1/challenges/questions/')
        rows = self._payload_rows(r)
        self.assertTrue(rows)
        self.assertIn('correct_answer', rows[0])

    def test_public_category_endpoint_hides_correct_answer(self):
        r = self.anon.get('/api/v1/challenges/quiz/physics/questions/')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        for row in r.data['questions']:
            self.assertNotIn('correct_answer', row)


class QuizScoringTests(TestCase):
    """Findings: QuizSubmitView never de-duplicated question_id, so repeating one
    correct answer inflated the score past `total` (1000% observed); the answers
    list had no max_length, making a single request an unbounded DB write."""

    def setUp(self):
        cache.clear()
        self.questions = [_question(i) for i in range(5)]
        self.user = User.objects.create_user(username='alice', email='a@e.com', password='x')
        self.client = APIClient()
        self.client.force_authenticate(self.user)
        r = self.client.post(
            '/api/v1/challenges/quiz/start/', {'category': 'physics', 'count': 5}, format='json'
        )
        self.session_id = r.data['session_id']
        self.qids = [q['id'] for q in r.data['questions']]

    def _submit(self, answers, client=None):
        return (client or self.client).post(
            f'/api/v1/challenges/quiz/{self.session_id}/submit/',
            {'answers': answers},
            format='json',
        )

    def test_duplicate_question_ids_cannot_inflate_the_score(self):
        dup = [{'question_id': self.qids[0], 'selected': 1} for _ in range(50)]
        r = self._submit(dup)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertLessEqual(r.data['score'], r.data['total'])
        self.assertLessEqual(r.data['percentage'], 100)

    def test_answers_list_is_length_capped(self):
        flood = [{'question_id': self.qids[0], 'selected': 1} for _ in range(5000)]
        r = self._submit(flood)
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_a_correct_answer_sent_as_a_string_still_counts(self):
        """Finding: `q.correct_answer == selected` compared int to str, so a
        client sending "1" instead of 1 scored zero on every question."""
        answers = [{'question_id': q, 'selected': '1'} for q in self.qids]
        r = self._submit(answers)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['score'], len(self.qids))

    def test_selected_out_of_range_is_rejected(self):
        r = self._submit([{'question_id': self.qids[0], 'selected': 99}])
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_xp_award_recomputes_the_level(self):
        """Finding: quiz XP was written with profile.xp += n, bypassing add_xp(),
        so the stored level never moved."""
        import math

        answers = [{'question_id': q, 'selected': 1} for q in self.qids]
        self._submit(answers)
        profile = self.user.gamification
        profile.refresh_from_db()
        expected = math.floor(math.sqrt(profile.xp / 100)) + 1
        self.assertEqual(profile.level, expected)


class QuizOwnershipTests(TestCase):
    """Finding: QuizResultView and QuizSubmitView were AllowAny and took
    session_id straight from the URL, so sequential IDs exposed and let anyone
    close another student's session."""

    def setUp(self):
        cache.clear()
        [_question(i) for i in range(5)]
        self.alice = User.objects.create_user(username='alice', email='a@e.com', password='x')
        self.bob = User.objects.create_user(username='bob', email='b@e.com', password='x')

        self.alice_client = APIClient()
        self.alice_client.force_authenticate(self.alice)
        r = self.alice_client.post(
            '/api/v1/challenges/quiz/start/', {'category': 'physics', 'count': 5}, format='json'
        )
        self.session_id = r.data['session_id']
        self.qids = [q['id'] for q in r.data['questions']]

        self.bob_client = APIClient()
        self.bob_client.force_authenticate(self.bob)

    def test_another_user_cannot_read_the_session_result(self):
        r = self.bob_client.get(f'/api/v1/challenges/quiz/{self.session_id}/result/')
        self.assertIn(r.status_code, (status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND))

    def test_anonymous_cannot_read_the_session_result(self):
        r = APIClient().get(f'/api/v1/challenges/quiz/{self.session_id}/result/')
        self.assertIn(
            r.status_code,
            (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND),
        )

    def test_another_user_cannot_submit_into_the_session(self):
        r = self.bob_client.post(
            f'/api/v1/challenges/quiz/{self.session_id}/submit/',
            {'answers': [{'question_id': self.qids[0], 'selected': 1}]},
            format='json',
        )
        self.assertIn(r.status_code, (status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND))
        self.assertFalse(QuizSession.objects.get(id=self.session_id).is_completed)

    def test_the_owner_can_read_and_submit(self):
        submit = self.alice_client.post(
            f'/api/v1/challenges/quiz/{self.session_id}/submit/',
            {'answers': [{'question_id': self.qids[0], 'selected': 1}]},
            format='json',
        )
        self.assertEqual(submit.status_code, status.HTTP_200_OK)
        result = self.alice_client.get(f'/api/v1/challenges/quiz/{self.session_id}/result/')
        self.assertEqual(result.status_code, status.HTTP_200_OK)


class DailyChallengeTests(TestCase):
    """Findings: the daily submit had the same duplicate-answer inflation, ran one
    DB query per submitted element, and its history endpoint counted a slice."""

    def setUp(self):
        cache.clear()
        self.questions = [_question(i) for i in range(6)]
        self.user = User.objects.create_user(username='alice', email='a@e.com', password='x')
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_duplicate_answers_cannot_inflate_the_daily_score(self):
        challenge = DailyChallenge.get_or_create_today()
        qid = challenge.questions.first().id
        r = self.client.post(
            '/api/v1/challenges/submit/',
            {'answers': [{'question_id': qid, 'selected': 1} for _ in range(200)]},
            format='json',
        )
        self.assertIn(r.status_code, (status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST))
        if r.status_code == status.HTTP_201_CREATED:
            result = r.data['result']
            self.assertLessEqual(result['score'], result['total'])

    def test_history_total_is_not_capped_by_the_display_slice(self):
        self.client.post(
            '/api/v1/challenges/submit/',
            {'answers': [{'question_id': self.questions[0].id, 'selected': 1}]},
            format='json',
        )
        r = self.client.get('/api/v1/challenges/history/')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        from .models import UserChallengeResult

        self.assertEqual(
            r.data['total_challenges'], UserChallengeResult.objects.filter(user=self.user).count()
        )

    def test_today_endpoint_does_not_create_rows_on_a_get(self):
        """A GET must be safe. get_or_create_today() wrote a DailyChallenge row."""
        APIClient().get('/api/v1/challenges/today/')
        before = DailyChallenge.objects.count()
        APIClient().get('/api/v1/challenges/today/')
        self.assertEqual(DailyChallenge.objects.count(), before)


class LessonQuizTests(TestCase):
    """ADR 0001, step 5: a question can belong to one lesson, and a quiz can be
    started for that lesson rather than for a whole subject.

    `courses.QuizQuestion` was the alternative — a second question model with no
    readers, no admin and no submit flow. This bank already has all three."""

    def setUp(self):
        from apps.courses.models import Sphere, Topic, TopicLesson

        self.client = APIClient()
        sphere = Sphere.objects.create(slug='physics', title='Fizika', title_en='Physics')
        topic = Topic.objects.create(sphere=sphere, slug='physics-kinematics', title='Kinematika')
        self.lesson = TopicLesson.objects.create(
            topic=topic, slug='kin-one', name='Straight-line motion',
        )
        self.other_lesson = TopicLesson.objects.create(
            topic=topic, slug='kin-two', name='Relativity of motion',
        )

        self.attached = ChallengeQuestion.objects.create(
            category='physics', difficulty='easy', lesson=self.lesson,
            question='Tezlik nima?', options=['a', 'b', 'c', 'd'], correct_answer=1,
        )
        # In the category pool but attached to nothing.
        ChallengeQuestion.objects.create(
            category='physics', difficulty='easy',
            question='Loose question', options=['a', 'b', 'c', 'd'], correct_answer=0,
        )

    def test_a_lesson_quiz_only_draws_that_lesson_s_questions(self):
        r = self.client.post(
            '/api/v1/challenges/quiz/start/', {'lesson': 'kin-one', 'count': 10}, format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_201_CREATED, r.data)
        self.assertEqual(r.data['total'], 1)
        self.assertEqual(r.data['questions'][0]['id'], self.attached.id)

    def test_it_still_hides_the_answer_key(self):
        r = self.client.post(
            '/api/v1/challenges/quiz/start/', {'lesson': 'kin-one'}, format='json',
        )
        for question in r.data['questions']:
            self.assertNotIn('correct_answer', question)
            self.assertNotIn('explanation', question)

    def test_a_lesson_with_no_questions_says_so_rather_than_serving_the_category(self):
        r = self.client.post(
            '/api/v1/challenges/quiz/start/', {'lesson': 'kin-two'}, format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)

    def test_an_unknown_lesson_is_404_not_500(self):
        r = self.client.post(
            '/api/v1/challenges/quiz/start/', {'lesson': 'nope'}, format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)

    def test_neither_a_category_nor_a_lesson_is_a_400(self):
        r = self.client.post('/api/v1/challenges/quiz/start/', {}, format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_a_category_quiz_still_works_and_ignores_the_lesson_link(self):
        r = self.client.post(
            '/api/v1/challenges/quiz/start/', {'category': 'physics', 'count': 10}, format='json',
        )
        self.assertEqual(r.data['total'], 2)

    def test_deleting_a_lesson_keeps_its_questions_in_the_category_pool(self):
        self.lesson.delete()
        self.attached.refresh_from_db()
        self.assertIsNone(self.attached.lesson)
        r = self.client.post(
            '/api/v1/challenges/quiz/start/', {'category': 'physics', 'count': 10}, format='json',
        )
        self.assertEqual(r.data['total'], 2)

    def test_the_lesson_tree_reports_whether_a_lesson_has_a_quiz(self):
        r = self.client.get('/api/v1/courses/spheres/physics/tree/')
        counts = {
            node['slug']: node['question_count']
            for topic in r.data['topics'] for node in topic['lessons']
        }
        self.assertEqual(counts['kin-one'], 1)
        self.assertEqual(counts['kin-two'], 0)
