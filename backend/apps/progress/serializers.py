from rest_framework import serializers

from .models import UserLessonProgress, UserUnitEnrollment


class LessonProgressSerializer(serializers.ModelSerializer):
    lesson_slug = serializers.CharField(source='lesson.slug', read_only=True)

    class Meta:
        model = UserLessonProgress
        fields = ('lesson_slug', 'score', 'attempts', 'is_mastered', 'completed_at')


class UnitEnrollmentSerializer(serializers.ModelSerializer):
    unit_slug = serializers.CharField(source='unit.slug', read_only=True)

    class Meta:
        model = UserUnitEnrollment
        fields = ('unit_slug', 'enrolled_at', 'completed_at')


class LessonCompleteSerializer(serializers.Serializer):
    score = serializers.IntegerField(min_value=0, max_value=100)
