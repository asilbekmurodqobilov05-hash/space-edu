from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.permissions import AdminWriteOrReadOnly

from .models import Lesson, LessonSection, Level, QuizQuestion, Unit
from .serializers import (
    LessonDetailSerializer,
    LessonListSerializer,
    LessonWriteSerializer,
    LevelSerializer,
    LevelWriteSerializer,
    QuizQuestionSerializer,
    SectionSerializer,
    UnitDetailSerializer,
    UnitListSerializer,
    UnitWriteSerializer,
)


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
    serializer_class = QuizQuestionSerializer
    permission_classes = [AdminWriteOrReadOnly]

    def get_queryset(self):
        qs = QuizQuestion.objects.all()
        lesson = self.request.query_params.get('lesson')
        if lesson:
            qs = qs.filter(lesson__slug=lesson)
        return qs
