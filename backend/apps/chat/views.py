"""Chat, and the moderation that had to exist before it could stay shipped.

Before this, the app offered a public room and private messaging to an audience
of 10-to-18-year-olds with: no screening, no reporting, no blocking, no
moderator delete, no rate limit, and no consent step before a stranger's first
message. Any account could find any other by a two-character name search.

What changed, in order of how much it matters:

- Direct messages are behind `DM_ENABLED`, off by default (ticket B1).
- Starting a conversation with a stranger sends one message and then waits. The
  recipient accepts or declines.
- Blocking is mutual in effect and needs no explanation.
- Every message can be reported, and reports go to a queue staff can work.
- Moderators soft-delete; nothing is erased, so a report can still be reviewed.
- Writes are rate-limited.
- User search matches a whole name, not a two-character fragment.
"""
from django.db import IntegrityError, transaction
from django.db.models import Count, Max, Q
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import IsAdminUser, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import User

from .models import ChatMessage, ChatRoom, Conversation, DirectMessage, MessageReport, UserBlock
from .serializers import (
    BlockSerializer, ChatMessageSerializer, ChatRoomSerializer, ConversationSerializer,
    DirectMessageSerializer, ModerationDeleteSerializer, PostDirectMessageSerializer,
    PostMessageSerializer, ReportCreateSerializer, ReportSerializer, UserMiniSerializer,
    dm_enabled,
)
from .throttles import DirectMessageThrottle, ReportThrottle, RoomMessageThrottle

DM_DISABLED_RESPONSE = {
    'detail': 'Direct messages are turned off on this site.',
    'code': 'dm_disabled',
}


class DirectMessagesEnabledMixin:
    """Refuse every DM endpoint while the feature flag is off.

    A flag that only hides the UI is not a flag — the endpoints stay open to
    anyone with a browser console. This gate is the one that counts.
    """

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        if not dm_enabled():
            self.permission_denied(request, message=DM_DISABLED_RESPONSE['detail'])


# ══════════════════════════════════════════════════════════════════
# Community Chat
# ══════════════════════════════════════════════════════════════════

class RoomListView(generics.ListAPIView):
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]
    queryset = ChatRoom.objects.all()
    pagination_class = None


class RoomMessagesView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    throttle_classes = [RoomMessageThrottle]

    def get(self, request, slug):
        try:
            room = ChatRoom.objects.get(slug=slug)
        except ChatRoom.DoesNotExist:
            return Response({'detail': 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)

        messages = (
            ChatMessage.objects.filter(room=room, is_deleted=False)
            .select_related('user')
            .order_by('-created_at')
        )
        if request.user.is_authenticated:
            # Blocking hides both directions in one query rather than N.
            hidden = UserBlock.ids_hidden_from(request.user)
            if hidden:
                messages = messages.exclude(user_id__in=hidden)

        data = ChatMessageSerializer(
            reversed(list(messages[:50])), many=True, context={'request': request}
        ).data
        return Response(data)

    def post(self, request, slug):
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required.'},
                            status=status.HTTP_401_UNAUTHORIZED)

        try:
            room = ChatRoom.objects.get(slug=slug)
        except ChatRoom.DoesNotExist:
            return Response({'detail': 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PostMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        message = ChatMessage.objects.create(
            room=room,
            user=request.user,
            content=serializer.validated_data['content'],
        )
        return Response(
            ChatMessageSerializer(message, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )


class RoomMessageDeleteView(APIView):
    """DELETE /chat/rooms/<slug>/messages/<id>/ — moderator, or your own message.

    Soft delete. A moderator has to be able to see what an account actually sent
    after the fact, and a hard delete would let the author erase the evidence
    for a report against them.
    """

    permission_classes = [IsAuthenticated]

    def delete(self, request, slug, message_id):
        message = ChatMessage.objects.filter(id=message_id, room__slug=slug).first()
        if message is None or message.is_deleted:
            return Response({'detail': 'Message not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not (request.user.is_staff or message.user_id == request.user.id):
            return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = ModerationDeleteSerializer(data=request.data or {})
        serializer.is_valid(raise_exception=True)
        message.soft_delete(request.user, serializer.validated_data['reason'])
        return Response(status=status.HTTP_204_NO_CONTENT)


# ══════════════════════════════════════════════════════════════════
# Blocking
# ══════════════════════════════════════════════════════════════════

class BlockListCreateView(APIView):
    """GET/POST /chat/blocks/

    Available whether or not DMs are on — the public room needs it too.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        blocks = UserBlock.objects.filter(blocker=request.user).select_related('blocked')
        return Response(BlockSerializer(blocks, many=True).data)

    def post(self, request):
        user_id = request.data.get('user_id')
        try:
            target = User.objects.get(id=int(user_id))
        except (TypeError, ValueError, User.DoesNotExist):
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if target.id == request.user.id:
            return Response({'detail': 'You cannot block yourself.'},
                            status=status.HTTP_400_BAD_REQUEST)

        block, created = UserBlock.objects.get_or_create(blocker=request.user, blocked=target)
        return Response(
            BlockSerializer(block).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class BlockDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, user_id):
        deleted, _ = UserBlock.objects.filter(blocker=request.user, blocked_id=user_id).delete()
        if not deleted:
            return Response({'detail': 'Not blocked.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)


# ══════════════════════════════════════════════════════════════════
# Reporting
# ══════════════════════════════════════════════════════════════════

class ReportCreateView(APIView):
    """POST /chat/reports/ — anyone can flag a message they can see."""

    permission_classes = [IsAuthenticated]
    throttle_classes = [ReportThrottle]

    def post(self, request):
        serializer = ReportCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        fields = {'reporter': request.user, 'reason': data['reason'], 'detail': data['detail']}

        if data['message_type'] == 'room':
            message = ChatMessage.objects.filter(id=data['message_id']).first()
            if message is None:
                return Response({'detail': 'Message not found.'}, status=status.HTTP_404_NOT_FOUND)
            fields['chat_message'] = message
        else:
            message = (
                DirectMessage.objects
                .filter(id=data['message_id'], conversation__participants=request.user)
                .first()
            )
            # Not a 403: telling a caller that a message exists but is not theirs
            # is a way to walk the id space and confirm who is talking to whom.
            if message is None:
                return Response({'detail': 'Message not found.'}, status=status.HTTP_404_NOT_FOUND)
            fields['direct_message'] = message

        try:
            # The unique constraint is the check. Doing it as an exists() first
            # would still race, and an IntegrityError outside a savepoint marks
            # the whole surrounding transaction unusable.
            with transaction.atomic():
                report = MessageReport.objects.create(**fields)
        except IntegrityError:
            return Response({'detail': 'You have already reported this message.'},
                            status=status.HTTP_409_CONFLICT)

        return Response(ReportSerializer(report).data, status=status.HTTP_201_CREATED)


class ReportQueueView(generics.ListAPIView):
    """GET /chat/reports/queue/ — staff only. Open reports first, oldest first."""

    permission_classes = [IsAdminUser]
    serializer_class = ReportSerializer
    pagination_class = None

    def get_queryset(self):
        qs = (
            MessageReport.objects
            .select_related('reporter', 'chat_message__user', 'direct_message__sender')
            .order_by('status', 'created_at')
        )
        wanted = self.request.query_params.get('status')
        if wanted in dict(MessageReport.STATUSES):
            qs = qs.filter(status=wanted)
        return qs


class ReportResolveView(APIView):
    """POST /chat/reports/<id>/resolve/  {"action": "actioned"|"dismissed",
    "delete_message": true}"""

    permission_classes = [IsAdminUser]

    def post(self, request, report_id):
        report = MessageReport.objects.filter(id=report_id).first()
        if report is None:
            return Response({'detail': 'Report not found.'}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action')
        if action not in (MessageReport.ACTIONED, MessageReport.DISMISSED):
            return Response({'detail': 'action must be "actioned" or "dismissed".'},
                            status=status.HTTP_400_BAD_REQUEST)

        if action == MessageReport.ACTIONED and request.data.get('delete_message'):
            target = report.message
            if target is not None and not target.is_deleted:
                target.soft_delete(request.user, f'report #{report.id}')

        report.status = action
        report.handled_by = request.user
        report.handled_at = timezone.now()
        report.save(update_fields=['status', 'handled_by', 'handled_at'])
        return Response(ReportSerializer(report).data)


# ══════════════════════════════════════════════════════════════════
# Direct Messages
# ══════════════════════════════════════════════════════════════════

class UserSearchView(DirectMessagesEnabledMixin, APIView):
    """GET /chat/dm/users/?q=<name> — find someone you already know.

    This used to be `icontains` on username, first and last name at two
    characters, which turns the whole membership list into something anyone can
    enumerate two letters at a time. It now matches a whole username or a whole
    first+last name, so you can find a classmate you can already name and cannot
    browse for children by prefix.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        q = request.query_params.get('q', '').strip()
        if len(q) < 3:
            return Response([])

        parts = q.split()
        match = Q(username__iexact=q)
        if len(parts) >= 2:
            match |= Q(first_name__iexact=parts[0], last_name__iexact=' '.join(parts[1:]))

        users = (
            User.objects
            .filter(match, is_active=True)
            .exclude(id=request.user.id)
            .exclude(id__in=UserBlock.ids_hidden_from(request.user))
            .order_by('username')[:10]
        )
        return Response(UserMiniSerializer(users, many=True, context={'request': request}).data)


class ConversationListView(DirectMessagesEnabledMixin, APIView):
    """GET /chat/dm/conversations/ — list of all DM conversations for current user."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        convos = (
            Conversation.objects
            .filter(participants=request.user)
            .exclude(status=Conversation.DECLINED)
            .prefetch_related('participants', 'messages')
            .annotate(
                last_msg_time=Max('messages__created_at'),
                unread_count_annotated=Count(
                    'messages',
                    filter=(
                        Q(messages__is_read=False)
                        & Q(messages__is_deleted=False)
                        & ~Q(messages__sender=request.user)
                    ),
                    distinct=True,
                ),
            )
            .order_by('-last_msg_time', '-updated_at')
        )
        return Response(
            ConversationSerializer(convos, many=True, context={'request': request}).data
        )


class ConversationStartView(DirectMessagesEnabledMixin, APIView):
    """POST /chat/dm/conversations/start/  { user_id: <int> }"""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        other_id = request.data.get('user_id')
        if not other_id:
            return Response({'detail': 'user_id is required.'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            other = User.objects.get(id=other_id)
        except (ValueError, TypeError, User.DoesNotExist):
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if other.id == request.user.id:
            return Response({'detail': 'Cannot message yourself.'},
                            status=status.HTTP_400_BAD_REQUEST)

        if UserBlock.between(request.user, other):
            # Same wording either way. "You are blocked" tells the blocked party
            # something the blocker did not agree to share.
            return Response({'detail': 'You cannot message this person.'},
                            status=status.HTTP_403_FORBIDDEN)

        existing = (
            Conversation.objects
            .filter(participants=request.user)
            .filter(participants=other)
            .first()
        )
        if existing:
            if existing.status == Conversation.DECLINED:
                return Response({'detail': 'You cannot message this person.'},
                                status=status.HTTP_403_FORBIDDEN)
            convo = existing
        else:
            convo = Conversation.objects.create(
                initiator=request.user, status=Conversation.PENDING,
            )
            convo.participants.add(request.user, other)

        return Response(
            ConversationSerializer(convo, context={'request': request}).data,
            status=status.HTTP_200_OK,
        )


def _conversation_for(request, convo_id):
    return (
        Conversation.objects
        .filter(id=convo_id, participants=request.user)
        .prefetch_related('participants')
        .first()
    )


class ConversationMessagesView(DirectMessagesEnabledMixin, APIView):
    """GET/POST /chat/dm/conversations/<id>/messages/"""

    permission_classes = [IsAuthenticated]
    throttle_classes = [DirectMessageThrottle]

    def get(self, request, convo_id):
        convo = _conversation_for(request, convo_id)
        if not convo:
            return Response({'detail': 'Conversation not found.'},
                            status=status.HTTP_404_NOT_FOUND)

        messages = (
            convo.messages.filter(is_deleted=False)
            .select_related('sender')
            .order_by('-created_at')[:100]
        )
        # Mark incoming messages as read
        convo.messages.filter(is_read=False).exclude(sender=request.user).update(is_read=True)

        data = DirectMessageSerializer(
            reversed(list(messages)), many=True, context={'request': request}
        ).data
        return Response(data)

    def post(self, request, convo_id):
        convo = _conversation_for(request, convo_id)
        if not convo:
            return Response({'detail': 'Conversation not found.'},
                            status=status.HTTP_404_NOT_FOUND)

        other = convo.other_user(request.user)
        if other and UserBlock.between(request.user, other):
            return Response({'detail': 'You cannot message this person.'},
                            status=status.HTTP_403_FORBIDDEN)

        refusal = self._consent_refusal(convo, request.user)
        if refusal:
            return refusal

        serializer = PostDirectMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        msg = DirectMessage.objects.create(
            conversation=convo,
            sender=request.user,
            content=serializer.validated_data['content'],
        )
        # Replying to a request is consent. Nobody should have to press a button
        # to accept a conversation they have just answered.
        if convo.status == Conversation.PENDING and convo.initiator_id != request.user.id:
            convo.status = Conversation.ACCEPTED
        convo.save(update_fields=['status', 'updated_at'])

        return Response(
            DirectMessageSerializer(msg, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )

    def _consent_refusal(self, convo, sender):
        """One message, then wait — until the other side answers or accepts."""
        if convo.status == Conversation.ACCEPTED:
            return None
        if convo.status == Conversation.DECLINED:
            return Response({'detail': 'This person declined the conversation.'},
                            status=status.HTTP_403_FORBIDDEN)
        if convo.initiator_id != sender.id:
            return None  # the recipient answering is what accepts it
        if convo.messages.filter(sender=sender).exists():
            return Response(
                {'detail': 'Wait for them to accept before sending another message.',
                 'code': 'awaiting_consent'},
                status=status.HTTP_403_FORBIDDEN,
            )
        return None


class ConversationRespondView(DirectMessagesEnabledMixin, APIView):
    """POST /chat/dm/conversations/<id>/accept/ and .../decline/"""

    permission_classes = [IsAuthenticated]
    decision = None

    def post(self, request, convo_id):
        convo = _conversation_for(request, convo_id)
        if not convo:
            return Response({'detail': 'Conversation not found.'},
                            status=status.HTTP_404_NOT_FOUND)
        if convo.initiator_id == request.user.id:
            return Response({'detail': 'Only the person who was messaged can answer this.'},
                            status=status.HTTP_403_FORBIDDEN)

        convo.status = self.decision
        convo.save(update_fields=['status', 'updated_at'])
        return Response(ConversationSerializer(convo, context={'request': request}).data)


class ConversationAcceptView(ConversationRespondView):
    decision = Conversation.ACCEPTED


class ConversationDeclineView(ConversationRespondView):
    decision = Conversation.DECLINED


class DirectMessageDeleteView(DirectMessagesEnabledMixin, APIView):
    """DELETE /chat/dm/messages/<id>/ — the sender, or a moderator."""

    permission_classes = [IsAuthenticated]

    def delete(self, request, message_id):
        message = DirectMessage.objects.filter(id=message_id).first()
        if message is None or message.is_deleted:
            return Response({'detail': 'Message not found.'}, status=status.HTTP_404_NOT_FOUND)

        is_sender = message.sender_id == request.user.id
        if not (request.user.is_staff or is_sender):
            return Response({'detail': 'Message not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ModerationDeleteSerializer(data=request.data or {})
        serializer.is_valid(raise_exception=True)
        message.soft_delete(request.user, serializer.validated_data['reason'])
        return Response(status=status.HTTP_204_NO_CONTENT)


class UnreadCountView(DirectMessagesEnabledMixin, APIView):
    """GET /chat/dm/unread-count/ — total unread DMs for current user."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        count = DirectMessage.objects.filter(
            conversation__participants=request.user,
            is_read=False,
            is_deleted=False,
        ).exclude(sender=request.user).count()
        return Response({'unread_count': count})


class ChatSettingsView(APIView):
    """GET /chat/settings/ — what the client is allowed to show.

    The frontend needs to know whether to render the DM tab at all, and reading
    it from the server means one place decides rather than two.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'dm_enabled': dm_enabled(),
            'report_reasons': [
                {'value': value, 'label': label} for value, label in MessageReport.REASONS
            ],
        })
