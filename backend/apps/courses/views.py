from django.db.models import Count
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import SimpleRateThrottle

from apps.permissions import AdminWriteOrReadOnly

from .models import Problem, Sphere, Topic, TopicLesson
from .serializers import (
    ProblemCheckSerializer,
    ProblemFullSerializer, ProblemSerializer, ProblemWriteSerializer,
    SphereDetailSerializer, SphereListSerializer, SphereWriteSerializer,
    TopicDetailSerializer, TopicLessonSerializer, TopicLessonWriteSerializer,
    TopicListSerializer, TopicWriteSerializer,
)


def _is_staff(request):
    return bool(request.user.is_authenticated and request.user.is_staff)


class SphereViewSet(viewsets.ModelViewSet):
    queryset = Sphere.objects.filter(is_active=True)
    permission_classes = [AdminWriteOrReadOnly]
    lookup_field = 'slug'

    def get_queryset(self):
        # Two COUNTs in one pass instead of two per row. distinct=True because
        # joining both relations multiplies the rows.
        return super().get_queryset().annotate(
            topic_count=Count('topics', distinct=True),
            problem_count=Count('problems', distinct=True),
        )

    def get_serializer_class(self):
        if self.request.method in ('POST', 'PUT', 'PATCH'):
            return SphereWriteSerializer
        if self.action == 'retrieve':
            return SphereDetailSerializer
        return SphereListSerializer

    @action(detail=True, methods=['get'])
    def topics(self, request, slug=None):
        sphere = self.get_object()
        topics = sphere.topics.annotate(lesson_count=Count('lessons', distinct=True))
        return Response(TopicListSerializer(topics, many=True).data)

    @action(detail=True, methods=['get'])
    def problems(self, request, slug=None):
        sphere = self.get_object()
        return Response(ProblemSerializer(sphere.problems.all(), many=True).data)

    @action(detail=True, methods=['get'])
    def tree(self, request, slug=None):
        """Everything a subject page needs, in one request.

        The recursive serializer walks `children` per node, which is a query per
        node — around 170 of them for astronomy. This pulls the whole sphere in
        two queries and assembles the nesting in Python.
        """
        sphere = self.get_object()
        topics = list(sphere.topics.all())
        lessons = (
            TopicLesson.objects
            .filter(topic__sphere=sphere)
            .annotate(question_count=Count('questions'))
            .order_by('order', 'id')
        )

        by_parent = {}
        for lesson in lessons:
            by_parent.setdefault(lesson.parent_id, []).append(lesson)

        def nodes(parent_id, topic_id):
            return [
                {
                    'id': lesson.id,
                    'slug': lesson.slug,
                    'order': lesson.order,
                    'name': lesson.name,
                    'name_en': lesson.name_en,
                    'name_ru': lesson.name_ru,
                    'video_url': lesson.video_url,
                    'content': lesson.content,
                    'xp_reward': lesson.xp_reward,
                    'fuel_reward': lesson.fuel_reward,
                    # Whether to offer a quiz on this lesson (ADR 0001, step 5).
                    'question_count': lesson.question_count,
                    'children': nodes(lesson.id, topic_id),
                }
                for lesson in by_parent.get(parent_id, [])
                if lesson.topic_id == topic_id
            ]

        return Response({
            'slug': sphere.slug,
            'title': sphere.title,
            'title_en': sphere.title_en,
            'title_ru': sphere.title_ru,
            'color': sphere.color,
            'topics': [
                {
                    'id': topic.id,
                    'slug': topic.slug,
                    'order': topic.order,
                    'title': topic.title,
                    'title_en': topic.title_en,
                    'title_ru': topic.title_ru,
                    'color': topic.color or sphere.color,
                    'lessons': nodes(None, topic.id),
                }
                for topic in topics
            ],
        })


class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    permission_classes = [AdminWriteOrReadOnly]
    lookup_field = 'slug'

    def get_queryset(self):
        qs = Topic.objects.select_related('sphere').annotate(
            lesson_count=Count('lessons', distinct=True)
        )
        sphere = self.request.query_params.get('sphere')
        if sphere:
            qs = qs.filter(sphere__slug=sphere)
        return qs

    def get_serializer_class(self):
        if self.request.method in ('POST', 'PUT', 'PATCH'):
            return TopicWriteSerializer
        if self.action == 'retrieve':
            return TopicDetailSerializer
        return TopicListSerializer


class TopicLessonViewSet(viewsets.ModelViewSet):
    queryset = TopicLesson.objects.all()
    permission_classes = [AdminWriteOrReadOnly]
    lookup_field = 'slug'

    def get_queryset(self):
        qs = TopicLesson.objects.select_related('topic').prefetch_related('children')
        topic = self.request.query_params.get('topic')
        if topic:
            # Accept either the slug or the numeric id; the admin panel posts ids
            # and the site links by slug.
            qs = qs.filter(topic__slug=topic) if not topic.isdigit() else qs.filter(topic_id=topic)
        parent = self.request.query_params.get('parent')
        if parent == 'root':
            qs = qs.filter(parent__isnull=True)
        elif parent:
            qs = qs.filter(parent__slug=parent) if not parent.isdigit() else qs.filter(parent_id=parent)
        return qs

    def get_serializer_class(self):
        if self.request.method in ('POST', 'PUT', 'PATCH'):
            return TopicLessonWriteSerializer
        return TopicLessonSerializer


class ProblemCheckThrottle(SimpleRateThrottle):
    """Bound how fast the whole set can be walked.

    Grading on the server closes the front door — the answers no longer ship in
    `problemsData.js` — but a student can still submit once per problem and read
    the answer back. Thirty problems is thirty requests; this makes that take
    long enough to be pointless and stops a script doing it for a whole class.
    """

    scope = 'problem_check'

    def get_cache_key(self, request, view):
        ident = (
            f'user-{request.user.pk}' if request.user.is_authenticated
            else self.get_ident(request)
        )
        return self.cache_format % {'scope': self.scope, 'ident': ident}


class ProblemViewSet(viewsets.ModelViewSet):
    queryset = Problem.objects.all()
    permission_classes = [AdminWriteOrReadOnly]

    def get_permissions(self):
        # `check` is a POST but it is a read: it grades what the caller typed
        # and writes nothing. AdminWriteOrReadOnly would refuse it, which would
        # put the problem set behind a login it has never had.
        if self.action == 'check':
            return [AllowAny()]
        return super().get_permissions()

    def get_throttles(self):
        if self.action == 'check':
            return [ProblemCheckThrottle()]
        return super().get_throttles()

    @action(detail=True, methods=['post'])
    def check(self, request, pk=None):
        """POST /courses/problems/<id>/check/  {"answer": "..."}

        The comparison used to happen in the browser, against an answer key
        bundled into `problemsData.js` — so the whole Masalalar solution set was
        one View Source away, which is the same hole `ProblemSerializer` was
        hardened to close on the server side. The answer now lives only in the
        database.

        The result carries the correct answer and the explanation, because that
        is what the screen has always shown after an attempt and a problem set
        with no worked answer teaches nothing. If that turns out to be too
        generous, gate the reveal behind a second attempt — the shape is here
        for it.
        """
        problem = self.get_object()
        serializer = ProblemCheckSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        given = serializer.validated_data['answer']
        correct = self._matches(given, problem.answer)

        return Response({
            'correct': correct,
            'answer': problem.answer,
            'explanation': problem.explanation,
        }, status=status.HTTP_200_OK)

    @staticmethod
    def _matches(given, expected):
        """Forgiving on whitespace, case and the comma/point decimal mark.

        The browser used `userAnswer.trim() === problem.answer`, so "20 M",
        "20m" and "14,81 m/s" were all marked wrong against "20 m" and
        "14.81 m/s". Uzbek and Russian keyboards produce the comma form.
        """
        def normalise(value):
            return (
                str(value).strip().casefold()
                .replace(',', '.')
                .replace(' ', ' ')
                .replace(' ', '')
            )

        return normalise(given) == normalise(expected)

    def get_queryset(self):
        qs = Problem.objects.all()
        sphere = self.request.query_params.get('sphere')
        if sphere:
            qs = qs.filter(sphere__slug=sphere)
        difficulty = self.request.query_params.get('difficulty')
        if difficulty:
            qs = qs.filter(difficulty=difficulty)
        return qs

    def get_serializer_class(self):
        if self.request.method in ('POST', 'PUT', 'PATCH'):
            return ProblemWriteSerializer
        return ProblemFullSerializer if _is_staff(self.request) else ProblemSerializer
