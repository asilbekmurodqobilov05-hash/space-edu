from rest_framework import serializers

from .models import Problem, Sphere, Topic, TopicLesson


# ── TopicLesson ──
class TopicLessonSerializer(serializers.ModelSerializer):
    """A lesson node and, recursively, the nodes under it.

    Replaced the flat `sub_lessons` list when ADR 0001 traded the fixed
    four-level tree for `TopicLesson.parent`. Depth is content-defined and
    shallow — three below a topic in the deepest subject (interviews).
    """

    children = serializers.SerializerMethodField()
    question_count = serializers.IntegerField(source='questions.count', read_only=True)

    class Meta:
        model = TopicLesson
        fields = ('id', 'slug', 'order', 'name', 'name_en', 'name_ru',
                  'video_url', 'content', 'xp_reward', 'fuel_reward',
                  'question_count', 'children')

    def get_children(self, obj):
        return TopicLessonSerializer(
            obj.children.all(), many=True, context=self.context,
        ).data


class TopicLessonWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TopicLesson
        fields = ('id', 'topic', 'parent', 'slug', 'order', 'name', 'name_en', 'name_ru',
                  'video_url', 'content', 'xp_reward', 'fuel_reward')

    def validate(self, attrs):
        """A lesson and its parent must sit in the same topic, and a lesson
        cannot be its own parent — either one produces a tree the progress
        queries silently mis-count."""
        parent = attrs.get('parent', getattr(self.instance, 'parent', None))
        topic = attrs.get('topic', getattr(self.instance, 'topic', None))
        if parent is not None:
            if self.instance is not None and parent.pk == self.instance.pk:
                raise serializers.ValidationError({'parent': 'A lesson cannot be its own parent.'})
            if topic is not None and parent.topic_id != topic.id:
                raise serializers.ValidationError(
                    {'parent': 'Parent lesson belongs to a different topic.'}
                )
        return attrs


# ── Topic ──
class TopicListSerializer(serializers.ModelSerializer):
    # Same per-row COUNT problem as SphereListSerializer below.
    lesson_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Topic
        fields = ('id', 'slug', 'order', 'title', 'title_en', 'title_ru',
                  'color', 'description', 'fuel_reward', 'lesson_count')


class TopicDetailSerializer(serializers.ModelSerializer):
    lessons = serializers.SerializerMethodField()

    class Meta:
        model = Topic
        fields = ('id', 'slug', 'order', 'title', 'title_en', 'title_ru',
                  'color', 'description', 'fuel_reward', 'lessons')

    def get_lessons(self, obj):
        # Roots only — the rest arrive nested under `children`, so a child would
        # otherwise be serialised twice and counted twice by the client.
        roots = obj.lessons.filter(parent__isnull=True)
        return TopicLessonSerializer(roots, many=True, context=self.context).data


class TopicWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ('id', 'sphere', 'slug', 'order', 'title', 'title_en', 'title_ru',
                  'color', 'description', 'fuel_reward')


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


class ProblemCheckSerializer(serializers.Serializer):
    """What a student submits for one problem. The answer never comes back up
    from the client — only what they typed."""

    answer = serializers.CharField(max_length=500, allow_blank=False, trim_whitespace=True)
