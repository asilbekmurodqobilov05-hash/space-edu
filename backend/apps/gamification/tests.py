"""Regression tests for findings from the 2026-08-22 audit."""
import math

from django.test import TestCase
from django.utils import timezone
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
        from apps.courses.models import Sphere, Topic, TopicLesson
        from apps.progress.models import UserLessonProgress

        sphere = Sphere.objects.create(slug='physics', title='Fizika', title_en='Physics')
        topic = Topic.objects.create(sphere=sphere, slug='physics-kinematics', title='Kinematika')
        for i in range(5):
            lesson = TopicLesson.objects.create(
                topic=topic, slug=f'physics-kinematics-l{i}', order=i, name=f'L{i}',
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


class DailyStreakClaimTests(TestCase):
    """Findings from the second pass, 22 Aug 2026.

    `StreakUpdateView` read `last_play_date`, decided, and only then wrote, with
    nothing holding the row in between — so it was the one award path the first
    audit's row-lock sweep missed. It also used `date.today()`, which on a UTC
    server is not the date in Asia/Tashkent.
    """

    def setUp(self):
        self.user = User.objects.create_user(username='streaker', email='s@e.com', password='x')
        self.profile = UserGamificationProfile.objects.get(user=self.user)
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_claiming_pays_the_bonus_and_starts_the_streak(self):
        r = self.client.post('/api/v1/gamification/streak/')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['streak'], 1)
        self.assertEqual(r.data['fuel_bonus'], 10)
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.fuel, 110)

    def test_claiming_twice_in_a_day_pays_once(self):
        self.client.post('/api/v1/gamification/streak/')
        second = self.client.post('/api/v1/gamification/streak/')
        self.assertEqual(second.data['fuel_bonus'], 0)
        self.assertFalse(second.data['updated'])
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.fuel, 110)

    def test_the_bonus_is_atomic_against_a_stale_copy(self):
        """Two requests that both read the row before either wrote used to pay
        the bonus twice and lose one of the two streak increments."""
        stale = UserGamificationProfile.objects.get(pk=self.profile.pk)

        self.profile.claim_daily_streak()
        streak, awarded = stale.claim_daily_streak()

        self.assertEqual(awarded, 0)
        self.assertEqual(streak, 1)
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.fuel, 110)
        self.assertEqual(self.profile.streak, 1)

    def test_a_consecutive_day_extends_the_streak(self):
        yesterday = timezone.localdate() - timezone.timedelta(days=1)
        self.profile.claim_daily_streak(today=yesterday)
        streak, awarded = self.profile.claim_daily_streak()
        self.assertEqual(streak, 2)
        self.assertEqual(awarded, 10)

    def test_a_missed_day_resets_the_streak(self):
        long_ago = timezone.localdate() - timezone.timedelta(days=5)
        self.profile.claim_daily_streak(today=long_ago)
        streak, _ = self.profile.claim_daily_streak()
        self.assertEqual(streak, 1)

    def test_the_bonus_respects_the_fuel_cap(self):
        UserGamificationProfile.objects.filter(pk=self.profile.pk).update(
            fuel=UserGamificationProfile.FUEL_CAP,
        )
        self.profile.refresh_from_db()
        self.profile.claim_daily_streak()
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.fuel, UserGamificationProfile.FUEL_CAP)

    def test_the_day_is_the_users_day_not_the_servers(self):
        """The site runs on Asia/Tashkent and the server on UTC, so between
        local midnight and 05:00 `date.today()` still says yesterday."""
        import datetime
        import inspect

        from apps.gamification import models as gamification_models

        source = inspect.getsource(gamification_models.UserGamificationProfile.claim_daily_streak)
        self.assertIn('timezone.localdate()', source)
        self.assertNotIn('date.today()', source.split('"""')[-1])

        # And the two really do differ for a Tashkent evening.
        tashkent_evening = datetime.datetime(2026, 8, 22, 23, 30, tzinfo=datetime.timezone.utc)
        with self.settings(TIME_ZONE='Asia/Tashkent'):
            self.assertNotEqual(
                timezone.localdate(tashkent_evening), tashkent_evening.date(),
            )
