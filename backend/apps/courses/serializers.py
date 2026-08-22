from rest_framework import serializers

from .models import (
    Sphere, Topic, TopicLesson, SubLesson, Problem,
    Level, Unit, Lesson, LessonSection, QuizQuestion,
)


def _is_staff(context):
    request = context.get('request')
    return bool(request and request.user.is_authenticated and request.user.is_staff)


# ══════════════════════════════════════════════════════════════════════════════
#  NEW SPHERE-BASED SERIALIZERS
# ══════════════════════════════════════════════════════════════════════════════

# ── SubLesson ──
class SubLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubLesson
        fields = ('id', 'order', 'name', 'name_en', 'name_ru', 'video_url', 'content')


class SubLessonWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubLesson
        fields = ('id', 'parent_lesson', 'order', 'name', 'name_en', 'name_ru', 'video_url', 'content')


# ── TopicLesson ──
class TopicLessonSerializer(serializers.ModelSerializer):
    sub_lessons = SubLessonSerializer(many=True, read_only=True)

    class Meta:
        model = TopicLesson
        fields = ('id', 'order', 'name', 'name_en', 'name_ru', 'video_url', 'content', 'sub_lessons')


class TopicLessonWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TopicLesson
        fields = ('id', 'topic', 'order', 'name', 'name_en', 'name_ru', 'video_url', 'content')


# ── Topic ──
class TopicListSerializer(serializers.ModelSerializer):
    # Same per-row COUNT problem as SphereListSerializer above.
    lesson_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Topic
        fields = ('id', 'order', 'title', 'title_en', 'title_ru', 'color', 'description', 'lesson_count')


class TopicDetailSerializer(serializers.ModelSerializer):
    lessons = TopicLessonSerializer(many=True, read_only=True)

    class Meta:
        model = Topic
        fields = ('id', 'order', 'title', 'title_en', 'title_ru', 'color', 'description', 'lessons')


class TopicWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ('id', 'sphere', 'order', 'title', 'title_en', 'title_ru', 'color', 'description')


# ── Problem ──
class ProblemSerializer(serializers.ModelSerializer):
    """Public problem.

    `answer` and `explanation` used to be in this list, under a permission that
    allows anonymous reads — the solution key for the whole Masalalar set was one
    unauthenticated GET away. Staff get ProblemFullSerializer instead.
    """

    class Meta:
        model = Problem
        fields = ('id', 'number', 'question', 'question_en', 'question_ru', 'difficulty')


class ProblemFullSerializer(serializers.ModelSerializer):
    """Staff view — includes the solution."""

    class Meta:
        model = Problem
        fields = ('id', 'number', 'question', 'question_en', 'question_ru',
                  'answer', 'explanation', 'explanation_en', 'difficulty')


class ProblemWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = ('id', 'sphere', 'number', 'question', 'question_en', 'question_ru',
                  'answer', 'explanation', 'explanation_en', 'difficulty')


# ── Sphere ──
class SphereListSerializer(serializers.ModelSerializer):
    # `source='topics.count'` issues a COUNT per row, per field — two extra
    # queries for every sphere in the list. The viewset annotates these instead;
    # the fallback keeps the serializer usable outside that queryset.
    topic_count = serializers.IntegerField(read_only=True, default=0)
    problem_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Sphere
        fields = ('id', 'slug', 'order', 'title', 'title_en', 'title_ru',
                  'description', 'description_en', 'color', 'icon', 'link',
                  'lessons_count', 'is_active', 'topic_count', 'problem_count')


class SphereDetailSerializer(serializers.ModelSerializer):
    topics = TopicListSerializer(many=True, read_only=True)

    class Meta:
        model = Sphere
        fields = ('id', 'slug', 'order', 'title', 'title_en', 'title_ru',
                  'description', 'description_en', 'color', 'icon', 'link',
                  'lessons_count', 'is_active', 'topics')


class SphereWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sphere
        fields = ('id', 'slug', 'order', 'title', 'title_en', 'title_ru',
                  'description', 'description_en', 'color', 'icon', 'link',
                  'lessons_count', 'is_active')


# ══════════════════════════════════════════════════════════════════════════════
#  LEGACY SERIALIZERS (kept for backwards compat)
# ══════════════════════════════════════════════════════════════════════════════

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
    """Public question — no answer, no explanation."""

    class Meta:
        model = QuizQuestion
        fields = ('id', 'lesson', 'order', 'text_en', 'text_uz', 'text_ru', 'options')


class QuizQuestionFullSerializer(serializers.ModelSerializer):
    """Staff view — includes the answer key."""

    class Meta:
        model = QuizQuestion
        fields = ('id', 'lesson', 'order', 'text_en', 'text_uz', 'text_ru',
                  'options', 'correct_answer',
                  'explanation_en', 'explanation_uz', 'explanation_ru')


class LessonListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ('id', 'slug', 'order', 'title_en', 'title_uz', 'title_ru',
                  'lesson_type', 'xp_reward', 'estimated_minutes')


class LessonDetailSerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True, read_only=True)
    # Nesting the serializer directly re-exposed correct_answer to anonymous
    # callers through the lesson endpoint, bypassing the split above.
    questions = serializers.SerializerMethodField()

    def get_questions(self, obj):
        serializer = (
            QuizQuestionFullSerializer if _is_staff(self.context) else QuizQuestionSerializer
        )
        return serializer(obj.questions.all(), many=True, context=self.context).data

    class Meta:
        model = Lesson
        fields = ('id', 'slug', 'order', 'title_en', 'title_uz', 'title_ru',
                  'lesson_type', 'xp_reward', 'estimated_minutes',
                  'sections', 'questions')


class UnitListSerializer(serializers.ModelSerializer):
    lesson_count = serializers.IntegerField(read_only=True, default=0)

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
    units = UnitListSerializer(many=True, read_only=True)

    class Meta:
        model = Level
        fields = ('id', 'slug', 'order', 'title_en', 'title_uz', 'title_ru',
                  'description_en', 'description_uz', 'description_ru',
                  'icon', 'color', 'unit_count', 'units')
