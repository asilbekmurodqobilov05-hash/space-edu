from rest_framework import serializers

from .models import UserLessonProgress, UserTopicEnrollment


class LessonProgressSerializer(serializers.ModelSerializer):
    lesson_slug = serializers.CharField(source='lesson.slug', read_only=True)
    topic_slug = serializers.CharField(source='lesson.topic.slug', read_only=True)

    class Meta:
        model = UserLessonProgress
        fields = ('lesson_slug', 'topic_slug', 'score', 'attempts', 'is_mastered', 'completed_at')


class TopicEnrollmentSerializer(serializers.ModelSerializer):
    topic_slug = serializers.CharField(source='topic.slug', read_only=True)

    class Meta:
        model = UserTopicEnrollment
        fields = ('topic_slug', 'enrolled_at', 'completed_at')


class LessonCompleteSerializer(serializers.Serializer):
    score = serializers.IntegerField(min_value=0, max_value=100)
