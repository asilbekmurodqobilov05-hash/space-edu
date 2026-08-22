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


class ResponseShapeTests(TestCase):
    """The dashboard reads every list response with `items.map(...)`.

    If DRF's global PageNumberPagination were left on, each response would
    become {count, next, previous, results} and every table in the panel would
    render empty — with no error anywhere. Ticket B4 rewrote this module onto
    ModelViewSets, which makes that a live risk rather than a theoretical one.
    """

    ENDPOINTS = (
        'users', 'news', 'events', 'questions', 'spheres',
        'topics', 'lessons', 'market', 'chat-rooms', 'missions',
    )

    def setUp(self):
        self.client = APIClient()
        self.client.force_authenticate(
            User.objects.create_superuser(username='owner', email='o@e.com', password='x')
        )

    def test_every_listing_is_a_bare_array(self):
        for endpoint in self.ENDPOINTS:
            with self.subTest(endpoint=endpoint):
                r = self.client.get(f'/api/v1/admin-panel/{endpoint}/')
                self.assertEqual(r.status_code, status.HTTP_200_OK)
                self.assertIsInstance(
                    r.data, list,
                    f'{endpoint} returned a paginated envelope; the panel expects an array',
                )

    def test_every_listing_requires_staff(self):
        anon = APIClient()
        for endpoint in self.ENDPOINTS:
            with self.subTest(endpoint=endpoint):
                self.assertIn(
                    anon.get(f'/api/v1/admin-panel/{endpoint}/').status_code,
                    (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
                )

    def test_a_plain_user_is_refused(self):
        c = APIClient()
        c.force_authenticate(
            User.objects.create_user(username='pupil', email='p@e.com', password='x')
        )
        for endpoint in self.ENDPOINTS:
            with self.subTest(endpoint=endpoint):
                self.assertEqual(
                    c.get(f'/api/v1/admin-panel/{endpoint}/').status_code,
                    status.HTTP_403_FORBIDDEN,
                )

    def test_detail_routes_still_exist(self):
        from apps.gamification.models import Mission

        mission = Mission.objects.create(
            slug='m', title_en='M', description_en='d', target_value=1
        )
        r = self.client.get(f'/api/v1/admin-panel/missions/{mission.id}/')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['slug'], 'm')


class QuestionValidationTests(TestCase):
    """A question whose correct_answer points outside its options is
    unanswerable, and nothing checked that before."""

    def setUp(self):
        self.client = APIClient()
        self.client.force_authenticate(
            User.objects.create_superuser(username='owner', email='o@e.com', password='x')
        )

    def _post(self, **over):
        payload = {
            'category': 'physics', 'difficulty': 'easy',
            'question': 'Savol?', 'options': ['a', 'b', 'c', 'd'], 'correct_answer': 1,
        }
        payload.update(over)
        return self.client.post('/api/v1/admin-panel/questions/', payload, format='json')

    def test_valid_question_is_accepted(self):
        self.assertEqual(self._post().status_code, status.HTTP_201_CREATED)

    def test_answer_index_past_the_end_is_rejected(self):
        self.assertEqual(self._post(correct_answer=9).status_code, status.HTTP_400_BAD_REQUEST)

    def test_too_few_options_is_rejected(self):
        self.assertEqual(self._post(options=['only one']).status_code, status.HTTP_400_BAD_REQUEST)

    def test_bad_category_is_rejected(self):
        self.assertEqual(self._post(category='astrology').status_code, status.HTTP_400_BAD_REQUEST)


class DerivedFieldTests(TestCase):
    """Counters that come from real activity must not be writable by hand."""

    def setUp(self):
        self.client = APIClient()
        self.client.force_authenticate(
            User.objects.create_superuser(username='owner', email='o@e.com', password='x')
        )

    def test_sold_count_and_rating_are_read_only(self):
        from apps.market.models import MarketItem

        item = MarketItem.objects.create(
            slug='ship', title_en='S', title_uz='S', title_ru='S',
            description_en='d', description_uz='d', description_ru='d',
            item_type='spaceship', cost_fuel=10,
        )
        r = self.client.patch(
            f'/api/v1/admin-panel/market/{item.id}/',
            {'sold_count': 9999, 'rating_avg': 5.0, 'title_en': 'Renamed'},
            format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        item.refresh_from_db()
        self.assertEqual(item.sold_count, 0)
        self.assertEqual(item.rating_avg, 0.0)
        self.assertEqual(item.title_en, 'Renamed')

    def test_sphere_listing_reports_its_counts(self):
        from apps.courses.models import Sphere, Topic, TopicLesson

        sphere = Sphere.objects.create(slug='physics', title='Fizika', title_en='Physics')
        for i in range(3):
            topic = Topic.objects.create(sphere=sphere, title=f'T{i}', order=i)
            TopicLesson.objects.create(topic=topic, name=f'L{i}', order=0)

        row = self.client.get('/api/v1/admin-panel/spheres/').data[0]
        self.assertEqual(row['topics_count'], 3)
        self.assertEqual(row['lessons_count_actual'], 3)

    def test_chat_room_listing_reports_message_count(self):
        from apps.chat.models import ChatMessage, ChatRoom

        room = ChatRoom.objects.create(slug='general', name='General')
        author = User.objects.create_user(username='a', email='a@e.com', password='x')
        for i in range(4):
            ChatMessage.objects.create(room=room, user=author, content=f'hi {i}')

        row = self.client.get('/api/v1/admin-panel/chat-rooms/').data[0]
        self.assertEqual(row['messages'], 4)


class OrderAssignmentTests(TestCase):
    """Omitting `order` should append, not collide at zero."""

    def setUp(self):
        self.client = APIClient()
        self.client.force_authenticate(
            User.objects.create_superuser(username='owner', email='o@e.com', password='x')
        )

    def test_spheres_are_appended(self):
        for i in range(3):
            r = self.client.post(
                '/api/v1/admin-panel/spheres/',
                {'slug': f's{i}', 'title': f'S{i}', 'title_en': f'S{i}'},
                format='json',
            )
            self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        orders = [row['order'] for row in self.client.get('/api/v1/admin-panel/spheres/').data]
        self.assertEqual(len(set(orders)), 3, f'orders collided: {orders}')


class SelfProtectionTests(TestCase):
    def setUp(self):
        self.owner = User.objects.create_superuser(
            username='owner', email='o@e.com', password='x'
        )
        self.client = APIClient()
        self.client.force_authenticate(self.owner)

    def test_cannot_delete_your_own_account_from_the_panel(self):
        r = self.client.delete(f'/api/v1/admin-panel/users/{self.owner.id}/')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(User.objects.filter(pk=self.owner.pk).exists())

    def test_users_cannot_be_created_through_the_panel(self):
        r = self.client.post('/api/v1/admin-panel/users/', {'username': 'ghost'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_user_search_filters(self):
        User.objects.create_user(username='aziz', email='aziz@e.com', password='x')
        User.objects.create_user(username='bobur', email='bobur@e.com', password='x')
        rows = self.client.get('/api/v1/admin-panel/users/?q=aziz').data
        self.assertEqual([r['username'] for r in rows], ['aziz'])


class DashboardPayloadContractTests(TestCase):
    """The exact payloads AdminDashboard.jsx sends must keep working.

    Ticket B4 moved this module onto DRF ModelViewSets, and a plain
    ModelSerializer names a relation `sphere`, not `sphere_id`. The dashboard's
    TOPIC_DEFAULT posts `{sphere_id: 1, ...}` and LESSON_DEFAULT posts
    `{topic_id: 1, ...}`, so without an explicit mapping the rewrite would have
    broken creating a topic or a lesson from the panel — with a 400 blaming a
    field the form does not have.

    Payloads below are copied from the dashboard's *_DEFAULT constants.
    """

    def setUp(self):
        self.client = APIClient()
        self.client.force_authenticate(
            User.objects.create_superuser(username='owner', email='o@e.com', password='x')
        )
        r = self.client.post(
            '/api/v1/admin-panel/spheres/',
            {'slug': 'physics', 'title': 'Fizika', 'title_en': 'Physics', 'title_ru': 'Физика',
             'description': '', 'description_en': '', 'link': '', 'color': '#a78bfa',
             'icon': 'BookOpen', 'is_active': True},
            format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_201_CREATED, r.data)
        self.sphere_id = r.data['id']

    def test_topic_is_created_from_sphere_id(self):
        r = self.client.post(
            '/api/v1/admin-panel/topics/',
            {'sphere_id': self.sphere_id, 'title': 'Kinematika', 'title_en': 'Kinematics',
             'title_ru': 'Кинематика', 'description': '', 'color': ''},
            format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_201_CREATED, r.data)
        self.assertEqual(r.data['sphere_id'], self.sphere_id)

    def test_lesson_is_created_from_topic_id(self):
        topic = self.client.post(
            '/api/v1/admin-panel/topics/',
            {'sphere_id': self.sphere_id, 'title': 'T', 'title_en': 'T'},
            format='json',
        ).data
        r = self.client.post(
            '/api/v1/admin-panel/lessons/',
            {'topic_id': topic['id'], 'name': 'Tezlik', 'name_en': 'Speed',
             'name_ru': 'Скорость', 'video_url': '', 'content': ''},
            format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_201_CREATED, r.data)
        self.assertEqual(r.data['topic_id'], topic['id'])

    def test_a_missing_sphere_id_is_reported_against_that_name(self):
        r = self.client.post('/api/v1/admin-panel/topics/', {'title': 'Orphan'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('sphere_id', r.data)

    def test_question_create_payload_from_the_panel(self):
        r = self.client.post(
            '/api/v1/admin-panel/questions/',
            {'question': 'Savol?', 'question_en': 'Question?', 'question_ru': 'Вопрос?',
             'category': 'general', 'difficulty': 'medium',
             'options': ['Bir', 'Ikki', 'Uch', "To'rt"], 'correct_answer': 0,
             'explanation': '', 'is_active': True},
            format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_201_CREATED, r.data)

    def test_an_all_blank_option_set_is_refused(self):
        # The panel's empty form ships options: ['', '', '', ''].
        r = self.client.post(
            '/api/v1/admin-panel/questions/',
            {'question': 'Savol?', 'category': 'general', 'difficulty': 'medium',
             'options': ['', '', '', ''], 'correct_answer': 0},
            format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_question_patch_without_options_still_works(self):
        created = self.client.post(
            '/api/v1/admin-panel/questions/',
            {'question': 'Q', 'category': 'general', 'difficulty': 'medium',
             'options': ['a', 'b'], 'correct_answer': 0},
            format='json',
        ).data
        # The edit form does not include `options`; validation must fall back to
        # the stored value rather than rejecting the patch.
        r = self.client.patch(
            f'/api/v1/admin-panel/questions/{created["id"]}/',
            {'question': 'Q edited', 'category': 'general', 'difficulty': 'hard',
             'correct_answer': 1, 'explanation': 'because', 'is_active': True},
            format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_200_OK, r.data)
        self.assertEqual(r.data['question'], 'Q edited')

    def test_news_and_market_payloads_from_the_panel(self):
        news = self.client.post(
            '/api/v1/admin-panel/news/',
            {'title_en': 'T', 'title_uz': 'T', 'title_ru': 'T',
             'summary_en': 's', 'summary_uz': 's', 'summary_ru': 's',
             'content_en': 'c', 'content_uz': 'c', 'content_ru': 'c',
             'category': 'science', 'source': '', 'source_url': '', 'is_published': True},
            format='json',
        )
        self.assertEqual(news.status_code, status.HTTP_201_CREATED, news.data)

        market = self.client.post(
            '/api/v1/admin-panel/market/',
            {'slug': 'ship', 'title_en': 'S', 'title_uz': 'S', 'title_ru': 'S',
             'description_en': 'd', 'description_uz': 'd', 'description_ru': 'd',
             'item_type': 'spaceship', 'price': 1000, 'cost_fuel': 50, 'stock': 0,
             'is_active': True, 'is_bestseller': False},
            format='json',
        )
        self.assertEqual(market.status_code, status.HTTP_201_CREATED, market.data)

    def test_chat_room_payload_from_the_panel(self):
        r = self.client.post(
            '/api/v1/admin-panel/chat-rooms/', {'name': 'General', 'slug': 'general'},
            format='json',
        )
        self.assertEqual(r.status_code, status.HTTP_201_CREATED, r.data)
        self.assertEqual(r.data['messages'], 0)
