"""Regression tests for findings from the 2026-08-22 audit."""
import math

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.accounts.models import User

from .models import Mission, RewardProduct, UserGamificationProfile, UserRewardPurchase


class XpFaucetTests(TestCase):
    """Finding: POST /gamification/grant/ accepted any xp/fuel with no check that
    the user had done anything — one request produced level 101. The endpoint was
    client-authoritative by design, so it is removed rather than validated."""

    def setUp(self):
        self.user = User.objects.create_user(username='alice', email='a@e.com', password='x')
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_client_cannot_grant_itself_xp(self):
        r = self.client.post(
            '/api/v1/gamification/grant/', {'xp': 1_000_000, 'fuel': 1000}, format='json'
        )
        self.assertIn(
            r.status_code,
            (status.HTTP_404_NOT_FOUND, status.HTTP_405_METHOD_NOT_ALLOWED,
             status.HTTP_403_FORBIDDEN, status.HTTP_410_GONE),
        )
        profile = UserGamificationProfile.objects.get(user=self.user)
        self.assertEqual(profile.xp, 0)
        self.assertEqual(profile.level, 1)


class MissionClaimTests(TestCase):
    """Finding: MissionClaimView never compared progress against
    mission.target_value, so 'Complete 5 lessons' paid out at zero lessons."""

    def setUp(self):
        self.user = User.objects.create_user(username='alice', email='a@e.com', password='x')
        self.client = APIClient()
        self.client.force_authenticate(self.user)
        self.mission = Mission.objects.create(
            slug='five-lessons',
            title_en='Complete 5 lessons',
            description_en='x',
            mission_type='lesson',
            target_value=5,
            reward_xp=500,
            reward_fuel=100,
        )

    def test_claiming_an_unearned_mission_is_rejected(self):
        r = self.client.post(
            '/api/v1/gamification/missions/claim/', {'mission_id': self.mission.id}, format='json'
        )
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        profile = UserGamificationProfile.objects.get(user=self.user)
        self.assertEqual(profile.xp, 0)
        self.assertEqual(profile.fuel, 100)  # starting balance, unchanged

    def test_claiming_an_earned_mission_pays_out_once(self):
        from apps.courses.models import Lesson, Level, Unit
        from apps.progress.models import UserLessonProgress

        common = dict(
            description_en='d', description_uz='d', description_ru='d', icon='i', color='#fff'
        )
        level = Level.objects.create(
            slug='lvl', order=1, title_en='A', title_uz='A', title_ru='A', **common
        )
        unit = Unit.objects.create(
            level=level, slug='u', order=1, title_en='U', title_uz='U', title_ru='U'
        )
        for i in range(5):
            lesson = Lesson.objects.create(
                unit=unit, slug=f'l{i}', order=i,
                title_en='L', title_uz='L', title_ru='L', lesson_type='quiz',
            )
            UserLessonProgress.objects.create(user=self.user, lesson=lesson, score=100)

        first = self.client.post(
            '/api/v1/gamification/missions/claim/', {'mission_id': self.mission.id}, format='json'
        )
        self.assertEqual(first.status_code, status.HTTP_200_OK)

        second = self.client.post(
            '/api/v1/gamification/missions/claim/', {'mission_id': self.mission.id}, format='json'
        )
        self.assertEqual(second.status_code, status.HTTP_400_BAD_REQUEST)


class ProfileArithmeticTests(TestCase):
    """Findings: add_xp/add_fuel/spend_fuel were read-modify-write on a loaded
    instance, so concurrent writes lost updates; and several call sites wrote
    profile.xp directly, skipping the level recompute."""

    def setUp(self):
        self.user = User.objects.create_user(username='alice', email='a@e.com', password='x')
        self.profile = UserGamificationProfile.objects.get(user=self.user)

    def test_add_xp_recomputes_the_level(self):
        self.profile.add_xp(450)
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.level, math.floor(math.sqrt(450 / 100)) + 1)

    def test_add_xp_is_atomic_against_a_stale_copy(self):
        stale = UserGamificationProfile.objects.get(pk=self.profile.pk)
        self.profile.add_xp(100)
        stale.add_xp(100)
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.xp, 200, 'a stale in-memory copy overwrote a concurrent add')

    def test_spend_fuel_refuses_to_go_negative(self):
        self.profile.fuel = 30
        self.profile.save(update_fields=['fuel'])
        self.assertFalse(self.profile.spend_fuel(50))
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.fuel, 30)

    def test_add_fuel_respects_the_cap(self):
        self.profile.add_fuel(5000)
        self.profile.refresh_from_db()
        self.assertLessEqual(self.profile.fuel, 1000)


class RewardPurchaseTests(TestCase):
    """Finding: the balance check and the debit were not serialised, so two
    concurrent purchases of different products both passed the check."""

    def setUp(self):
        self.user = User.objects.create_user(username='alice', email='a@e.com', password='x')
        self.client = APIClient()
        self.client.force_authenticate(self.user)
        profile = UserGamificationProfile.objects.get(user=self.user)
        profile.fuel = 100
        profile.save(update_fields=['fuel'])
        self.cheap = RewardProduct.objects.create(
            slug='a', title_en='A', description_en='d', cost=80
        )
        self.other = RewardProduct.objects.create(
            slug='b', title_en='B', description_en='d', cost=80
        )

    def test_cannot_buy_beyond_the_balance(self):
        first = self.client.post('/api/v1/gamification/rewards/buy/', {'slug': 'a'}, format='json')
        self.assertEqual(first.status_code, status.HTTP_201_CREATED)
        second = self.client.post('/api/v1/gamification/rewards/buy/', {'slug': 'b'}, format='json')
        self.assertEqual(second.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(UserRewardPurchase.objects.filter(user=self.user).count(), 1)
        profile = UserGamificationProfile.objects.get(user=self.user)
        self.assertEqual(profile.fuel, 20)

    def test_buying_the_same_reward_twice_is_rejected(self):
        self.client.post('/api/v1/gamification/rewards/buy/', {'slug': 'a'}, format='json')
        again = self.client.post('/api/v1/gamification/rewards/buy/', {'slug': 'a'}, format='json')
        self.assertEqual(again.status_code, status.HTTP_400_BAD_REQUEST)


class LeaderboardPrivacyTests(TestCase):
    """Finding: the public leaderboard exposed first_name, last_name and the
    R2 avatar URL of children, plus a username derived from the email local part."""

    def setUp(self):
        user = User.objects.create_user(
            username='aziz.karimov',
            email='aziz.karimov@example.com',
            password='x',
            first_name='Aziz',
            last_name='Karimov',
        )
        UserGamificationProfile.objects.filter(user=user).update(xp=500)

    def test_anonymous_leaderboard_does_not_expose_real_names(self):
        r = APIClient().get('/api/v1/gamification/leaderboard/')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        body = str(r.data)
        self.assertNotIn('Aziz', body)
        self.assertNotIn('Karimov', body)
