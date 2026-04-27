from rest_framework import serializers
from .models import LessonProgress, UnitEnrollment


class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = ("lesson_id", "unit_id", "score", "completed", "mastered", "updated_at")
        read_only_fields = ("updated_at",)


class UnitEnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnitEnrollment
        fields = ("unit_id", "created_at")
        read_only_fields = ("created_at",)


class ProgressSyncSerializer(serializers.Serializer):
    completed_lessons = serializers.ListField(child=serializers.CharField())
    enrolled_units = serializers.ListField(child=serializers.CharField())
    lesson_scores = serializers.DictField(child=serializers.IntegerField())
