from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.permissions import AdminWriteOrReadOnly

from .models import (
    Sphere, Topic, TopicLesson, SubLesson, Problem,
    Level, Unit, Lesson, LessonSection, QuizQuestion,
)
from .serializers import (
    # New sphere-based
    SphereListSerializer, SphereDetailSerializer, SphereWriteSerializer,
    TopicListSerializer, TopicDetailSerializer, TopicWriteSerializer,
    TopicLessonSerializer, TopicLessonWriteSerializer,
    SubLessonSerializer, SubLessonWriteSerializer,
    ProblemSerializer, ProblemFullSerializer, ProblemWriteSerializer,
    # Legacy
    LevelSerializer, LevelWriteSerializer,
    UnitListSerializer, UnitDetailSerializer, UnitWriteSerializer,
    LessonListSerializer, LessonDetailSerializer, LessonWriteSerializer,
    SectionSerializer, QuizQuestionSerializer, QuizQuestionFullSerializer,
)


def _is_staff(request):
    return bool(request.user.is_authenticated and request.user.is_staff)


def _first_match_by_slug(self):
    """Resolve `lookup_field = 'slug'` when the slug is not globally unique.

    DRF's default calls .get(slug=...), which explodes with MultipleObjectsReturned
    the moment two parents reuse a slug. Filtering and taking the first keeps the
    endpoint answering instead of returning 500; the query params these viewsets
    already support (?level=, ?unit=) narrow it to one row.
    """
    from django.shortcuts import get_object_or_404

    queryset = self.filter_queryset(self.get_queryset())
    slug = self.kwargs[self.lookup_field]
    obj = queryset.filter(**{self.lookup_field: slug}).first()
    if obj is None:
        get_object_or_404(queryset, **{self.lookup_field: slug})
    self.check_object_permissions(self.request, obj)
    return obj


# ══════════════════════════════════════════════════════════════════════════════
#  NEW SPHERE-BASED VIEWSETS
# ══════════════════════════════════════════════════════════════════════════════

class SphereViewSet(viewsets.ModelViewSet):
    queryset = Sphere.objects.filter(is_active=True)
    permission_classes = [AdminWriteOrReadOnly]
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.request.method in ('POST', 'PUT', 'PATCH'):
            return SphereWriteSerializer
        if self.action == 'retrieve':
            return SphereDetailSerializer
        return SphereListSerializer

    @action(detail=True, methods=['get'])
    def topics(self, request, slug=None):
        sphere = self.get_object()
        return Response(TopicListSerializer(sphere.topics.all(), many=True).data)

    @action(detail=True, methods=['get'])
    def problems(self, request, slug=None):
        sphere = self.get_object()
        return Response(ProblemSerializer(sphere.problems.all(), many=True).data)


class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    permission_classes = [AdminWriteOrReadOnly]

    def get_queryset(self):
        qs = Topic.objects.all()
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

    def get_queryset(self):
        qs = TopicLesson.objects.all()
        topic = self.request.query_params.get('topic')
        if topic:
            qs = qs.filter(topic_id=topic)
        return qs

    def get_serializer_class(self):
        if self.request.method in ('POST', 'PUT', 'PATCH'):
            return TopicLessonWriteSerializer
        return TopicLessonSerializer


class SubLessonViewSet(viewsets.ModelViewSet):
    queryset = SubLesson.objects.all()
    permission_classes = [AdminWriteOrReadOnly]

    def get_queryset(self):
        qs = SubLesson.objects.all()
        parent = self.request.query_params.get('parent')
        if parent:
            qs = qs.filter(parent_lesson_id=parent)
        return qs

    def get_serializer_class(self):
        if self.request.method in ('POST', 'PUT', 'PATCH'):
            return SubLessonWriteSerializer
        return SubLessonSerializer


class ProblemViewSet(viewsets.ModelViewSet):
    queryset = Problem.objects.all()
    permission_classes = [AdminWriteOrReadOnly]

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


# ══════════════════════════════════════════════════════════════════════════════
#  LEGACY VIEWSETS
# ══════════════════════════════════════════════════════════════════════════════

class LevelViewSet(viewsets.ModelViewSet):
    queryset = Level.objects.all()
    permission_classes = [AdminWriteOrReadOnly]
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.request.method in ('POST', 'PUT', 'PATCH'):
            return LevelWriteSerializer
        return LevelSerializer

    @action(detail=True, methods=['get'])
    def units(self, request, slug=None):
        level = self.get_object()
        qs = Unit.objects.filter(level=level)
        return Response(UnitListSerializer(qs, many=True).data)


class UnitViewSet(viewsets.ModelViewSet):
    queryset = Unit.objects.all()
    permission_classes = [AdminWriteOrReadOnly]
    lookup_field = 'slug'

    # Unit.slug is only unique together with its level, so a bare slug lookup
    # raised MultipleObjectsReturned -> 500 as soon as two levels had a unit with
    # the same name. Narrow by ?level= when given, else take the first by order.
    get_object = _first_match_by_slug

    def get_queryset(self):
        qs = Unit.objects.all()
        level = self.request.query_params.get('level')
        if level:
            qs = qs.filter(level__slug=level)
        return qs

    def get_serializer_class(self):
        if self.request.method in ('POST', 'PUT', 'PATCH'):
            return UnitWriteSerializer
        if self.action == 'retrieve':
            return UnitDetailSerializer
        return UnitListSerializer


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    permission_classes = [AdminWriteOrReadOnly]
    lookup_field = 'slug'

    # Lesson.slug is unique per unit only — same problem as UnitViewSet above.
    get_object = _first_match_by_slug

    def get_queryset(self):
        qs = Lesson.objects.all()
        unit = self.request.query_params.get('unit')
        if unit:
            qs = qs.filter(unit__slug=unit)
        return qs

    def get_serializer_class(self):
        if self.request.method in ('POST', 'PUT', 'PATCH'):
            return LessonWriteSerializer
        if self.action == 'retrieve':
            return LessonDetailSerializer
        return LessonListSerializer


class SectionViewSet(viewsets.ModelViewSet):
    serializer_class = SectionSerializer
    permission_classes = [AdminWriteOrReadOnly]

    def get_queryset(self):
        qs = LessonSection.objects.all()
        lesson = self.request.query_params.get('lesson')
        if lesson:
            qs = qs.filter(lesson__slug=lesson)
        return qs


class QuizQuestionViewSet(viewsets.ModelViewSet):
    permission_classes = [AdminWriteOrReadOnly]

    def get_serializer_class(self):
        return QuizQuestionFullSerializer if _is_staff(self.request) else QuizQuestionSerializer

    def get_queryset(self):
        qs = QuizQuestion.objects.all()
        lesson = self.request.query_params.get('lesson')
        if lesson:
            qs = qs.filter(lesson__slug=lesson)
        return qs
