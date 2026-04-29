from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import Lesson, Level, Unit
from .serializers import (
    LessonDetailSerializer,
    LevelSerializer,
    UnitDetailSerializer,
    UnitListSerializer,
)


class LevelListView(generics.ListAPIView):
    serializer_class = LevelSerializer
    permission_classes = [AllowAny]
    queryset = Level.objects.all()
    pagination_class = None


class UnitsByLevelView(generics.ListAPIView):
    serializer_class = UnitListSerializer
    permission_classes = [AllowAny]
    pagination_class = None

    def get_queryset(self):
        return Unit.objects.filter(level__slug=self.kwargs['level_slug'])


class UnitDetailView(generics.RetrieveAPIView):
    serializer_class = UnitDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    queryset = Unit.objects.prefetch_related('lessons')


class LessonDetailView(generics.RetrieveAPIView):
    serializer_class = LessonDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    queryset = Lesson.objects.prefetch_related('sections', 'questions')
