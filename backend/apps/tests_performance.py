"""Query-count budgets.

Finding (22 Aug 2026 audit): N+1 was systemic rather than incidental —
`SphereListSerializer` ran two queries per sphere, `ConversationSerializer` ran
three per conversation, `SpheresListView` called `.count()` after
`prefetch_related` (which ignores the prefetch), and `FullProfileView` came to
roughly forty queries for one page.

These tests pin a budget that does not grow with the number of rows. The exact
number matters less than the shape: doubling the data must not double the
queries.
"""
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.chat.models import Conversation, DirectMessage
from apps.courses.models import Problem, Sphere, Topic, TopicLesson


def make_spheres(count=6, topics_each=4, lessons_each=3):
    for s in range(count):
        sphere = Sphere.objects.create(
            slug=f'sphere-{s}', title=f'Soha {s}', title_en=f'Sphere {s}', order=s
        )
        for t in range(topics_each):
            topic = Topic.objects.create(sphere=sphere, title=f'Mavzu {t}', order=t)
            for l in range(lessons_each):
                TopicLesson.objects.create(topic=topic, name=f'Dars {l}', order=l)
        for n in range(2):
            Problem.objects.create(
                sphere=sphere, number=n + 1, question=f'Savol {n}', answer='42'
            )


class SphereListQueryBudgetTests(TestCase):
    """The list serializer exposed topic_count and problem_count as
    `source='topics.count'`, which is one query per sphere per field."""

    def test_sphere_list_does_not_grow_with_the_number_of_spheres(self):
        client = APIClient()

        make_spheres(count=2)
        with self.assertNumQueries(0):
            pass
        small = self._count_queries(client, '/api/v1/courses/spheres/')

        Sphere.objects.all().delete()
        make_spheres(count=12)
        large = self._count_queries(client, '/api/v1/courses/spheres/')

        self.assertEqual(
            small, large,
            f'{small} queries for 2 spheres but {large} for 12 — the count is per row',
        )

    def _count_queries(self, client, url):
        from django.db import connection, reset_queries
        from django.test.utils import CaptureQueriesContext

        with CaptureQueriesContext(connection) as ctx:
            response = client.get(url)
            self.assertEqual(response.status_code, 200)
        return len(ctx)


@override_settings(DM_ENABLED=True)
class ConversationListQueryBudgetTests(TestCase):
    """ConversationSerializer resolved other_user, last_message and unread_count
    with a separate query each, so a list of N conversations cost 3N + 1."""

    def setUp(self):
        self.me = User.objects.create_user(username='me', email='me@e.com', password='x')
        self.client = APIClient()
        self.client.force_authenticate(self.me)

    def _make(self, n):
        start = User.objects.count()
        for i in range(start, start + n):
            other = User.objects.create_user(
                username=f'peer{i}', email=f'p{i}@e.com', password='x'
            )
            convo = Conversation.objects.create(
                initiator=other, status=Conversation.ACCEPTED,
            )
            convo.participants.add(self.me, other)
            DirectMessage.objects.create(
                conversation=convo, sender=other, content=f'Salom {i}'
            )

    def _count(self):
        from django.db import connection
        from django.test.utils import CaptureQueriesContext

        with CaptureQueriesContext(connection) as ctx:
            r = self.client.get('/api/v1/chat/dm/conversations/')
            self.assertEqual(r.status_code, 200)
        return len(ctx)

    def test_conversation_list_does_not_grow_per_conversation(self):
        self._make(2)
        small = self._count()

        self._make(10)
        large = self._count()

        self.assertLessEqual(
            large - small, 2,
            f'{small} queries for 2 conversations, {large} for 12 — '
            'each row is fetching its own peer, last message and unread count',
        )


class IndexTests(TestCase):
    """Fields we filter and order by on every request need an index."""

    def test_news_and_event_hot_fields_are_indexed(self):
        from apps.events.models import SpaceEvent
        from apps.news.models import NewsArticle

        expected = {
            NewsArticle: ('published_at', 'category', 'is_published'),
            SpaceEvent: ('event_date', 'event_type', 'is_featured'),
        }
        for model, fields in expected.items():
            indexed = {f.name for f in model._meta.fields if f.db_index}
            for index in model._meta.indexes:
                indexed.update(f.lstrip('-') for f in index.fields)
            for field in fields:
                self.assertIn(
                    field, indexed,
                    f'{model.__name__}.{field} is filtered or ordered on every '
                    f'list request but has no index',
                )
