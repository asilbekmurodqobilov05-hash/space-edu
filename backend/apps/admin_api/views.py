"""Admin API — dashboard stats plus CRUD for the models the panel manages.

Everything requires `is_staff`; the two privilege flags require `is_superuser`.

Rewritten for ticket B4. This module used to hand-roll serialisation with dict
literals and `setattr` loops across roughly 700 lines, duplicating what
`courses`, `challenges` and `market` already had. It had no validation, so
ordinary caller mistakes came back as 500s — a duplicate slug as IntegrityError,
a missing foreign key the same, a non-numeric price as ValueError — and
`{"is_staff": "false"}` was stored as True, because a non-empty string is truthy.

Two contracts the rewrite has to preserve, both load-bearing for the existing
dashboard:
  * responses are bare arrays, not DRF's paginated envelope. The frontend does
    `items.map(...)` directly, so `pagination_class = None` everywhere.
  * the URL shapes stay `<resource>/` and `<resource>/<pk>/`.
"""
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db.models import Count, Max, Q
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.challenges.models import ChallengeQuestion, UserChallengeResult
from apps.chat.models import ChatMessage, ChatRoom, Conversation, DirectMessage
from apps.courses.models import Problem, Sphere, Topic, TopicLesson
from apps.events.models import SpaceEvent
from apps.gamification.models import Badge, Mission, RewardProduct
from apps.market.models import MarketCategory, MarketItem
from apps.news.models import NewsArticle

from .serializers import (
    AdminChatRoomSerializer,
    AdminEventSerializer,
    AdminMarketItemSerializer,
    AdminMissionSerializer,
    AdminNewsSerializer,
    AdminQuestionSerializer,
    AdminSphereSerializer,
    AdminTopicLessonSerializer,
    AdminTopicSerializer,
    AdminUserSerializer,
    PrivilegeSerializer,
)

User = get_user_model()


class AdminModelViewSet(viewsets.ModelViewSet):
    """Base for every admin resource.

    `pagination_class = None` is deliberate and load-bearing: the dashboard reads
    the response as a plain array. Turning pagination on here would empty every
    table in the panel at once.
    """

    permission_classes = [IsAdminUser]
    pagination_class = None

    #: Cap on list responses, so one request cannot pull the whole table.
    list_limit = 100

    def filter_queryset(self, queryset):
        queryset = super().filter_queryset(queryset)
        if self.action == 'list' and self.list_limit:
            return queryset[: self.list_limit]
        return queryset


# ═══════════════════════════════════════════════════════════════════
#  DASHBOARD
# ═══════════════════════════════════════════════════════════════════
class DashboardView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        now = timezone.now()
        week_ago = now - timedelta(days=7)
        month_ago = now - timedelta(days=30)

        return Response({
            'users': {
                'total': User.objects.count(),
                'new_week': User.objects.filter(date_joined__gte=week_ago).count(),
                'new_month': User.objects.filter(date_joined__gte=month_ago).count(),
                'staff_count': User.objects.filter(is_staff=True).count(),
            },
            'content': {
                'spheres': Sphere.objects.count(),
                'topics': Topic.objects.count(),
                'lessons': TopicLesson.objects.count(),
                'problems': Problem.objects.count(),
                'challenge_questions': ChallengeQuestion.objects.count(),
            },
            'market': {
                'items': MarketItem.objects.count(),
                'categories': MarketCategory.objects.count(),
                'reward_products': RewardProduct.objects.count(),
            },
            'community': {
                'news_articles': NewsArticle.objects.count(),
                'space_events': SpaceEvent.objects.count(),
                'chat_rooms': ChatRoom.objects.count(),
                'chat_messages': ChatMessage.objects.count(),
                'dm_conversations': Conversation.objects.count(),
                'dm_messages': DirectMessage.objects.count(),
            },
            'gamification': {
                'badges': Badge.objects.count(),
                'challenges_completed_week': UserChallengeResult.objects.filter(
                    completed_at__gte=week_ago
                ).count(),
            },
            'recent_users': list(
                User.objects.order_by('-date_joined')[:10].values(
                    'id', 'username', 'first_name', 'last_name', 'email',
                    'date_joined', 'is_staff', 'is_active',
                )
            ),
        })


# ═══════════════════════════════════════════════════════════════════
#  USERS
# ═══════════════════════════════════════════════════════════════════
class UserViewSet(AdminModelViewSet):
    """Users are never created here — people sign up. Read, edit, delete only."""

    serializer_class = AdminUserSerializer
    http_method_names = ['get', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        qs = User.objects.select_related('gamification').order_by('-date_joined')
        q = self.request.query_params.get('q', '').strip()
        if q:
            qs = qs.filter(
                Q(username__icontains=q) | Q(first_name__icontains=q)
                | Q(last_name__icontains=q) | Q(email__icontains=q)
            )
        return qs

    def update(self, request, *args, **kwargs):
        """Profile fields for staff; the privilege flags for superusers only."""
        instance = self.get_object()

        privileged = {k: v for k, v in request.data.items() if k in ('is_staff', 'is_active')}
        if privileged and not request.user.is_superuser:
            return Response(
                {'detail': f'Only a superuser may change {", ".join(sorted(privileged))}.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        if privileged:
            # Through a serializer so "false" is parsed as a boolean rather than
            # stored as a truthy string, which is what raw setattr did.
            flags = PrivilegeSerializer(data=privileged)
            flags.is_valid(raise_exception=True)
            for field, value in flags.validated_data.items():
                setattr(instance, field, value)
            instance.save(update_fields=list(flags.validated_data))

        instance.refresh_from_db()
        return Response(self.get_serializer(instance).data)

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        if user.is_superuser:
            return Response(
                {'detail': 'Cannot delete a superuser.'}, status=status.HTTP_400_BAD_REQUEST
            )
        if user.pk == request.user.pk:
            return Response(
                {'detail': 'You cannot delete your own account from here.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().destroy(request, *args, **kwargs)


# ═══════════════════════════════════════════════════════════════════
#  CONTENT
# ═══════════════════════════════════════════════════════════════════
class OrderedCreateMixin:
    """Append to the end of the list when `order` is not supplied.

    The old code repeated this block three times with a bare `int(order)` that
    turned a typo into a 500.
    """

    order_scope_field = None

    def perform_create(self, serializer):
        if serializer.validated_data.get('order') in (None, 0):
            qs = self.get_serializer().Meta.model.objects.all()
            scope = self.order_scope_field
            if scope and serializer.validated_data.get(scope) is not None:
                qs = qs.filter(**{scope: serializer.validated_data[scope]})
            highest = qs.aggregate(Max('order'))['order__max']
            serializer.validated_data['order'] = (highest or 0) + 1
        serializer.save()


class SphereViewSet(OrderedCreateMixin, AdminModelViewSet):
    serializer_class = AdminSphereSerializer

    def get_queryset(self):
        return Sphere.objects.annotate(
            topics_count=Count('topics', distinct=True),
            lessons_count_actual=Count('topics__lessons', distinct=True),
        ).order_by('order', 'id')


class TopicViewSet(OrderedCreateMixin, AdminModelViewSet):
    serializer_class = AdminTopicSerializer
    order_scope_field = 'sphere'

    def get_queryset(self):
        qs = Topic.objects.select_related('sphere').order_by('order', 'id')
        sphere_id = self.request.query_params.get('sphere_id')
        return qs.filter(sphere_id=sphere_id) if sphere_id else qs


class TopicLessonViewSet(OrderedCreateMixin, AdminModelViewSet):
    serializer_class = AdminTopicLessonSerializer
    order_scope_field = 'topic'
    list_limit = 300

    def get_queryset(self):
        qs = TopicLesson.objects.select_related('topic').order_by('order', 'id')
        topic_id = self.request.query_params.get('topic_id')
        return qs.filter(topic_id=topic_id) if topic_id else qs


class QuestionViewSet(AdminModelViewSet):
    serializer_class = AdminQuestionSerializer
    list_limit = 200

    def get_queryset(self):
        qs = ChallengeQuestion.objects.order_by('category', 'difficulty', 'id')
        category = self.request.query_params.get('category')
        return qs.filter(category=category) if category else qs


# ═══════════════════════════════════════════════════════════════════
#  COMMUNITY AND COMMERCE
# ═══════════════════════════════════════════════════════════════════
class NewsViewSet(AdminModelViewSet):
    serializer_class = AdminNewsSerializer
    queryset = NewsArticle.objects.all()


class EventViewSet(AdminModelViewSet):
    serializer_class = AdminEventSerializer
    queryset = SpaceEvent.objects.all()


class MarketItemViewSet(AdminModelViewSet):
    serializer_class = AdminMarketItemSerializer
    queryset = MarketItem.objects.select_related('category').all()


class ChatRoomViewSet(AdminModelViewSet):
    serializer_class = AdminChatRoomSerializer

    def get_queryset(self):
        return ChatRoom.objects.annotate(msg_count=Count('messages')).order_by('id')


class MissionViewSet(AdminModelViewSet):
    """This listing used to raise NameError on every request.

    It referenced `apps.gamification.models.Mission`, but `from apps.x import y`
    does not bind the name `apps`, so the panel's Missions tab could not be
    opened at all. The write methods worked because each did a local import.
    """

    serializer_class = AdminMissionSerializer
    queryset = Mission.objects.all().order_by('order', 'id')
