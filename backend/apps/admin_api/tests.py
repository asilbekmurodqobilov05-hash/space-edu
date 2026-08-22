"""Regression tests for findings from the 2026-08-22 audit."""
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.gamification.models import Mission


class MissionsEndpointTests(TestCase):
    """Finding: MissionsListView.get referenced apps.gamification.models.Mission
    while the module only ever did `from apps.… import …`, which does not bind the
    name `apps`. GET raised NameError -> 500; the write methods worked because they
    each did a local import. The admin Missions tab could not be opened at all."""

    def setUp(self):
        self.staff = User.objects.create_user(
            username='teacher', email='t@e.com', password='x', is_staff=True
        )
        self.client = APIClient()
        self.client.force_authenticate(self.staff)
        Mission.objects.create(slug='m1', title_en='M', description_en='d', target_value=1)

    def test_missions_listing_does_not_500(self):
        r = self.client.get('/api/v1/admin-panel/missions/')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(len(r.data), 1)

    def test_missions_listing_requires_staff(self):
        anon = APIClient()
        self.assertIn(
            anon.get('/api/v1/admin-panel/missions/').status_code,
            (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
        )


class PrivilegeBoundaryTests(TestCase):
    """Finding: UserDetailView.patch ran under IsAdminUser (plain is_staff) and
    used raw setattr, so any staff member could grant is_staff to anyone and
    deactivate a superuser — locking the owner out. setattr also coerced the
    string "false" to True."""

    def setUp(self):
        self.staff = User.objects.create_user(
            username='teacher', email='t@e.com', password='x', is_staff=True
        )
        self.superuser = User.objects.create_superuser(
            username='owner', email='o@e.com', password='x'
        )
        self.pupil = User.objects.create_user(username='pupil', email='p@e.com', password='x')
        self.client = APIClient()
        self.client.force_authenticate(self.staff)

    def test_staff_cannot_deactivate_a_superuser(self):
        r = self.client.patch(
            f'/api/v1/admin-panel/users/{self.superuser.id}/', {'is_active': False}, format='json'
        )
        self.superuser.refresh_from_db()
        self.assertTrue(self.superuser.is_active)
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_staff_cannot_promote_a_user_to_staff(self):
        r = self.client.patch(
            f'/api/v1/admin-panel/users/{self.pupil.id}/', {'is_staff': True}, format='json'
        )
        self.pupil.refresh_from_db()
        self.assertFalse(self.pupil.is_staff)
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

    def test_superuser_can_change_the_privilege_flags(self):
        su_client = APIClient()
        su_client.force_authenticate(self.superuser)
        r = su_client.patch(
            f'/api/v1/admin-panel/users/{self.pupil.id}/', {'is_staff': True}, format='json'
        )
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.pupil.refresh_from_db()
        self.assertTrue(self.pupil.is_staff)

    def test_staff_can_still_edit_harmless_profile_fields(self):
        r = self.client.patch(
            f'/api/v1/admin-panel/users/{self.pupil.id}/', {'first_name': 'Aziz'}, format='json'
        )
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.pupil.refresh_from_db()
        self.assertEqual(self.pupil.first_name, 'Aziz')

    def test_boolean_fields_are_not_coerced_from_arbitrary_strings(self):
        su_client = APIClient()
        su_client.force_authenticate(self.superuser)
        su_client.patch(
            f'/api/v1/admin-panel/users/{self.pupil.id}/', {'is_staff': 'false'}, format='json'
        )
        self.pupil.refresh_from_db()
        self.assertFalse(self.pupil.is_staff, '"false" was coerced to True by raw setattr')


class AdminInputValidationTests(TestCase):
    """Finding: admin_api hand-rolled serialisation with dict literals and raw
    int() casts, so bad input surfaced as IntegrityError/ValueError -> 500."""

    def setUp(self):
        self.client = APIClient()
        self.client.force_authenticate(
            User.objects.create_superuser(username='owner', email='o@e.com', password='x')
        )

    def test_duplicate_sphere_slug_is_a_400_not_a_500(self):
        payload = {'slug': 'physics', 'title': 'Fizika', 'title_en': 'Physics'}
        self.assertEqual(
            self.client.post('/api/v1/admin-panel/spheres/', payload, format='json').status_code,
            status.HTTP_201_CREATED,
        )
        self.assertEqual(
            self.client.post('/api/v1/admin-panel/spheres/', payload, format='json').status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_non_numeric_order_is_a_400_not_a_500(self):
        r = self.client.post(
            '/api/v1/admin-panel/spheres/',
            {'slug': 'astro', 'title': 'A', 'title_en': 'A', 'order': 'abc'},
            format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_topic_without_a_sphere_is_a_400_not_a_500(self):
        r = self.client.post('/api/v1/admin-panel/topics/', {'title': 'Orphan'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_non_numeric_market_price_is_a_400_not_a_500(self):
        r = self.client.post(
            '/api/v1/admin-panel/market/',
            {'slug': 'x', 'title_en': 'X', 'price': 'free'},
            format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
