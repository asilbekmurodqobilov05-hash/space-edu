"""Load the learn tree from `fixtures/learn_content.json`.

ADR 0001, step 3. Replaces `seed_learn_data`, which held a hand-written second
copy of the content that had already drifted from the static files the site
actually rendered, and `seed_courses`, which targeted Level slugs that were
never created.

The fixture is generated from `frontend/src/data/*TopicsData.js` by
`frontend/scripts/export-learn-content.mjs`, and CI fails if the committed copy
is stale — so there is one source of truth, not three.

    python manage.py seed_learn_content
    python manage.py seed_learn_content --prune   # also delete what left the fixture

Idempotent, keyed on slug rather than on (parent, order): re-ordering a topic
must not orphan every progress row beneath it.
"""
import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.courses.models import Problem, Sphere, Topic, TopicLesson

FIXTURE = Path(__file__).resolve().parents[2] / 'fixtures' / 'learn_content.json'


class Command(BaseCommand):
    help = 'Populate Sphere/Topic/TopicLesson from the generated learn-content fixture.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--prune',
            action='store_true',
            help='Delete topics and lessons that are no longer in the fixture. '
                 'Their progress rows go with them, so this is opt-in.',
        )
        parser.add_argument('--fixture', default=str(FIXTURE))

    @transaction.atomic
    def handle(self, *args, **options):
        path = Path(options['fixture'])
        if not path.exists():
            raise CommandError(
                f'{path} is missing. Generate it with:\n'
                f'  cd frontend && node scripts/export-learn-content.mjs'
            )
        try:
            data = json.loads(path.read_text(encoding='utf-8'))
        except json.JSONDecodeError as exc:
            raise CommandError(f'{path} is not valid JSON: {exc}') from exc

        self.seen_topics = set()
        self.seen_lessons = set()
        counts = {'spheres': 0, 'topics': 0, 'lessons': 0, 'problems': 0}

        for sphere_data in data['spheres']:
            sphere = self._sync_sphere(sphere_data)
            counts['spheres'] += 1
            for topic_data in sphere_data['topics']:
                topic = self._sync_topic(sphere, topic_data)
                counts['topics'] += 1
                counts['lessons'] += self._sync_lessons(topic, None, topic_data['lessons'])

        counts['problems'] = self._sync_problems(data.get('problems'))

        if options['prune']:
            self._prune(counts)

        # `lessons_count` is a cached display number on the sphere card. It was
        # hand-typed in the old seed and wrong for every sphere.
        for sphere_slug in {s['slug'] for s in data['spheres']}:
            sphere = Sphere.objects.get(slug=sphere_slug)
            sphere.lessons_count = TopicLesson.objects.filter(
                topic__sphere=sphere, children__isnull=True,
            ).count()
            sphere.save(update_fields=['lessons_count'])

        self.stdout.write(self.style.SUCCESS(
            f'  {counts["spheres"]} spheres, {counts["topics"]} topics, '
            f'{counts["lessons"]} lesson nodes, {counts["problems"]} problems'
        ))

    # ──────────────────────────────────────────────────────────────────
    def _sync_sphere(self, data):
        fields = {k: v for k, v in data.items() if k not in ('slug', 'topics')}
        sphere, _ = Sphere.objects.update_or_create(slug=data['slug'], defaults=fields)
        return sphere

    def _sync_topic(self, sphere, data):
        topic, _ = Topic.objects.update_or_create(
            slug=data['slug'],
            defaults={
                'sphere': sphere,
                'order': data['order'],
                'title': data['title'],
                'title_en': data.get('title_en', ''),
                'title_ru': data.get('title_ru', ''),
                'color': data.get('color', ''),
            },
        )
        self.seen_topics.add(topic.pk)
        return topic

    def _sync_lessons(self, topic, parent, nodes):
        written = 0
        for node in nodes:
            lesson, _ = TopicLesson.objects.update_or_create(
                slug=node['slug'],
                defaults={
                    'topic': topic,
                    'parent': parent,
                    'order': node['order'],
                    'name': node['name'],
                    'name_en': node.get('name_en', ''),
                    'name_ru': node.get('name_ru', ''),
                    'video_url': node.get('video_url', ''),
                },
            )
            self.seen_lessons.add(lesson.pk)
            written += 1 + self._sync_lessons(topic, lesson, node.get('children', []))
        return written

    def _sync_problems(self, block):
        """The Masalalar set. Keyed on (sphere, number), which is its natural key.

        The answers live here and nowhere else now: they used to ship inside
        `problemsData.js`, which put the whole solution key in every visitor's
        browser even after the API stopped serving it.
        """
        if not block:
            return 0

        sphere, _ = Sphere.objects.update_or_create(
            slug=block['sphere']['slug'],
            defaults={k: v for k, v in block['sphere'].items() if k != 'slug'},
        )
        written = 0
        for item in block['items']:
            Problem.objects.update_or_create(
                sphere=sphere, number=item['number'],
                defaults={k: v for k, v in item.items() if k != 'number'},
            )
            written += 1

        # The sphere card counts problems, not lessons, for this one.
        sphere.lessons_count = Problem.objects.filter(sphere=sphere).count()
        sphere.save(update_fields=['lessons_count'])
        return written

    def _prune(self, counts):
        stale_lessons = TopicLesson.objects.exclude(pk__in=self.seen_lessons)
        stale_topics = Topic.objects.exclude(pk__in=self.seen_topics)
        removed = (stale_lessons.count(), stale_topics.count())
        stale_lessons.delete()
        stale_topics.delete()
        if any(removed):
            self.stdout.write(
                self.style.WARNING(f'  pruned {removed[0]} lessons, {removed[1]} topics')
            )
