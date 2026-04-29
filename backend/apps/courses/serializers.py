from rest_framework import serializers

from .models import Lesson, LessonSection, Level, QuizQuestion, Unit


# ── Write serializers (admin CRUD) ────────────────────────────────────────────

class LevelWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = ('id', 'slug', 'order', 'title_en', 'title_uz', 'title_ru',
                  'description_en', 'description_uz', 'description_ru', 'icon', 'color')


class UnitWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ('id', 'level', 'slug', 'order', 'title_en', 'title_uz', 'title_ru',
                  'xp_reward', 'fuel_reward')


class LessonWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ('id', 'unit', 'slug', 'order', 'title_en', 'title_uz', 'title_ru',
                  'lesson_type', 'xp_reward', 'estimated_minutes')


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonSection
        fields = ('id', 'lesson', 'order', 'section_type',
                  'content_en', 'content_uz', 'content_ru')


class QuizQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestion
        fields = ('id', 'lesson', 'order', 'text_en', 'text_uz', 'text_ru',
                  'options', 'correct_answer',
                  'explanation_en', 'explanation_uz', 'explanation_ru')


# ── Read serializers (public API) ─────────────────────────────────────────────

class LessonListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ('id', 'slug', 'order', 'title_en', 'title_uz', 'title_ru',
                  'lesson_type', 'xp_reward', 'estimated_minutes')


class LessonDetailSerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True, read_only=True)
    questions = QuizQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = ('id', 'slug', 'order', 'title_en', 'title_uz', 'title_ru',
                  'lesson_type', 'xp_reward', 'estimated_minutes',
                  'sections', 'questions')


class UnitListSerializer(serializers.ModelSerializer):
    lesson_count = serializers.IntegerField(source='lessons.count', read_only=True)

    class Meta:
        model = Unit
        fields = ('id', 'slug', 'order', 'title_en', 'title_uz', 'title_ru',
                  'xp_reward', 'fuel_reward', 'lesson_count')


class UnitDetailSerializer(serializers.ModelSerializer):
    lessons = LessonListSerializer(many=True, read_only=True)

    class Meta:
        model = Unit
        fields = ('id', 'slug', 'order', 'title_en', 'title_uz', 'title_ru',
                  'xp_reward', 'fuel_reward', 'lessons')


class LevelSerializer(serializers.ModelSerializer):
    unit_count = serializers.IntegerField(source='units.count', read_only=True)

    class Meta:
        model = Level
        fields = ('id', 'slug', 'order', 'title_en', 'title_uz', 'title_ru',
                  'description_en', 'description_uz', 'description_ru',
                  'icon', 'color', 'unit_count')
