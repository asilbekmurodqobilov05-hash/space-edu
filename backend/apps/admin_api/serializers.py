"""Serializers for the admin panel.

Replaces roughly 700 lines of hand-rolled `_serialize_*` dict literals and
`setattr` loops (ticket B4). That approach had no validation at all, so ordinary
caller mistakes surfaced as unhandled exceptions and 500s: a duplicate slug came
back as IntegrityError, a missing foreign key the same, a non-numeric price as
ValueError, and `{"is_staff": "false"}` was stored as True because a non-empty
string is truthy.

Everything here is read and written by staff only — see views.AdminModelViewSet.
"""
from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.challenges.models import ChallengeQuestion
from apps.chat.models import ChatRoom
from apps.courses.models import Sphere, Topic, TopicLesson
from apps.events.models import SpaceEvent
from apps.gamification.models import Mission
from apps.market.models import MarketItem
from apps.news.models import NewsArticle

User = get_user_model()


class AdminUserSerializer(serializers.ModelSerializer):
    """Staff view of a user.

    `is_staff` and `is_active` are read-only here and handled separately in the
    view, because IsAdminUser means plain `is_staff`: without that split any
    staff member could promote themselves, or set `is_active=False` on a
    superuser and lock the owner out of their own project.
    """

    gamification = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'username', 'first_name', 'last_name', 'email',
            'is_staff', 'is_active', 'date_joined', 'date_of_birth',
            'language', 'astronaut_name', 'bio', 'gamification',
        )
        read_only_fields = ('id', 'username', 'email', 'date_joined', 'is_staff', 'is_active')

    def get_gamification(self, obj):
        profile = getattr(obj, 'gamification', None)
        if profile is None:
            return None
        return {
            'xp': profile.xp,
            'level': profile.level,
            'fuel': profile.fuel,
            'streak': profile.streak,
        }


class PrivilegeSerializer(serializers.Serializer):
    """The two fields only a superuser may change."""

    is_staff = serializers.BooleanField(required=False)
    is_active = serializers.BooleanField(required=False)


class AdminNewsSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(read_only=True)

    class Meta:
        model = NewsArticle
        fields = '__all__'


class AdminEventSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(read_only=True)

    class Meta:
        model = SpaceEvent
        fields = '__all__'


class AdminQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChallengeQuestion
        fields = '__all__'

    def validate(self, attrs):
        """`correct_answer` is an index into `options`.

        Nothing checked this before, so a question could be saved pointing at an
        option that does not exist — unanswerable, and invisible until a student
        hit it.
        """
        options = attrs.get('options', getattr(self.instance, 'options', None)) or []
        index = attrs.get('correct_answer', getattr(self.instance, 'correct_answer', None))
        if not isinstance(options, list) or len(options) < 2:
            raise serializers.ValidationError({'options': 'Provide at least two options.'})
        # Blank strings are what the panel's empty form sends; a question with
        # fewer than two real answers is not answerable.
        if len([o for o in options if str(o).strip()]) < 2:
            raise serializers.ValidationError({'options': 'At least two options need text.'})
        if index is None or not 0 <= index < len(options):
            raise serializers.ValidationError({
                'correct_answer': f'Must be an index between 0 and {len(options) - 1}.'
            })
        return attrs


class AdminSphereSerializer(serializers.ModelSerializer):
    topics_count = serializers.IntegerField(read_only=True, default=0)
    lessons_count_actual = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Sphere
        fields = '__all__'


class AdminTopicSerializer(serializers.ModelSerializer):
    """The dashboard posts `sphere_id`, not `sphere`.

    A plain ModelSerializer names the relation `sphere`, so switching this
    module to DRF would have silently broken topic creation in the panel: the
    request carries sphere_id, DRF ignores it and reports `sphere` as required.
    Accept both, and keep emitting sphere_id so the existing form round-trips.
    """

    sphere_id = serializers.PrimaryKeyRelatedField(
        source='sphere', queryset=Sphere.objects.all(),
    )

    class Meta:
        model = Topic
        fields = '__all__'
        extra_kwargs = {'sphere': {'required': False, 'write_only': True}}


class AdminTopicLessonSerializer(serializers.ModelSerializer):
    """Same as AdminTopicSerializer: the panel posts `topic_id`."""

    topic_id = serializers.PrimaryKeyRelatedField(
        source='topic', queryset=Topic.objects.all(),
    )

    class Meta:
        model = TopicLesson
        fields = '__all__'
        extra_kwargs = {'topic': {'required': False, 'write_only': True}}


class AdminMarketItemSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(read_only=True)

    class Meta:
        model = MarketItem
        fields = '__all__'
        # Derived from purchases; a typo here would silently rewrite history.
        read_only_fields = ('sold_count', 'rating_avg', 'rating_count')


class AdminChatRoomSerializer(serializers.ModelSerializer):
    messages = serializers.IntegerField(source='msg_count', read_only=True, default=0)

    class Meta:
        model = ChatRoom
        fields = ('id', 'slug', 'name', 'is_global', 'messages')


class AdminMissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mission
        fields = '__all__'
