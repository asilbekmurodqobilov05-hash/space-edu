from django.conf import settings
from rest_framework import serializers

from .models import ChatMessage, ChatRoom, Conversation, DirectMessage, MessageReport, UserBlock
from .moderation import find_profanity


class CleanTextField(serializers.CharField):
    """A message body that is screened before it is stored.

    The rejection deliberately does not name the word it matched. Echoing it
    back turns the endpoint into an oracle for probing the list, and there is no
    version of quoting a slur back at a child that reads well.
    """

    def to_internal_value(self, data):
        value = super().to_internal_value(data).strip()
        if not value:
            raise serializers.ValidationError('Message cannot be empty.')
        if find_profanity(value):
            raise serializers.ValidationError(
                'This message looks like it contains language that is not allowed here. '
                'Please rewrite it.',
                code='profanity',
            )
        return value


class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ('slug', 'name', 'is_global')


class ChatMessageSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = ChatMessage
        fields = ('id', 'user_id', 'username', 'first_name', 'avatar_url', 'content', 'created_at')
        read_only_fields = fields

    def get_avatar_url(self, obj):
        if not obj.user.avatar:
            return None
        request = self.context.get('request')
        return request.build_absolute_uri(obj.user.avatar.url) if request else obj.user.avatar.url


class PostMessageSerializer(serializers.Serializer):
    content = CleanTextField(max_length=1000, min_length=1)


# ── Direct Message serializers ───────────────────────────────────

class UserMiniSerializer(serializers.Serializer):
    """Lightweight user representation for DM contacts."""
    id = serializers.IntegerField()
    username = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    avatar_url = serializers.SerializerMethodField()

    def get_avatar_url(self, obj):
        if not obj.avatar:
            return None
        request = self.context.get('request')
        try:
            url = obj.avatar.url
            return request.build_absolute_uri(url) if request else url
        except Exception:
            return None


class DirectMessageSerializer(serializers.ModelSerializer):
    sender_id = serializers.IntegerField(source='sender.id', read_only=True)
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    sender_first_name = serializers.CharField(source='sender.first_name', read_only=True)
    sender_avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = DirectMessage
        fields = (
            'id', 'conversation', 'sender_id', 'sender_username',
            'sender_first_name', 'sender_avatar_url',
            'content', 'is_read', 'created_at',
        )
        read_only_fields = fields

    def get_sender_avatar_url(self, obj):
        if not obj.sender.avatar:
            return None
        request = self.context.get('request')
        try:
            url = obj.sender.avatar.url
            return request.build_absolute_uri(url) if request else url
        except Exception:
            return None


class PostDirectMessageSerializer(serializers.Serializer):
    content = CleanTextField(max_length=2000, min_length=1)


class ConversationSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    awaiting_my_consent = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ('id', 'other_user', 'last_message', 'unread_count',
                  'status', 'awaiting_my_consent', 'updated_at')

    def _me(self):
        return self.context['request'].user

    # Each of these used to run its own query, so a list of N conversations
    # cost 3N + 1. ConversationListView now prefetches the participants and the
    # messages and annotates the unread count, so these read from memory.

    def get_other_user(self, obj):
        me = self._me()
        # `obj.participants.all()` is prefetched; filtering in Python avoids a
        # fresh query per row that a .exclude() would trigger.
        other = next((u for u in obj.participants.all() if u.id != me.id), None)
        if not other:
            return None
        return UserMiniSerializer(other, context=self.context).data

    def get_last_message(self, obj):
        messages = [m for m in obj.messages.all() if not m.is_deleted]
        if not messages:
            return None
        msg = max(messages, key=lambda m: m.created_at)
        return {
            'content': msg.content[:100],
            'created_at': msg.created_at,
            'is_mine': msg.sender_id == self._me().id,
        }

    def get_unread_count(self, obj):
        annotated = getattr(obj, 'unread_count_annotated', None)
        if annotated is not None:
            return annotated
        me_id = self._me().id
        return sum(
            1 for m in obj.messages.all()
            if not m.is_read and not m.is_deleted and m.sender_id != me_id
        )

    def get_awaiting_my_consent(self, obj):
        """The recipient sees a request; the sender sees a conversation on hold."""
        return obj.status == Conversation.PENDING and obj.initiator_id != self._me().id


# ── Moderation serializers ───────────────────────────────────────

class ReportCreateSerializer(serializers.Serializer):
    MESSAGE_TYPES = ('room', 'direct')

    message_type = serializers.ChoiceField(choices=MESSAGE_TYPES)
    message_id = serializers.IntegerField(min_value=1)
    reason = serializers.ChoiceField(choices=[r[0] for r in MessageReport.REASONS])
    detail = serializers.CharField(max_length=1000, required=False, allow_blank=True, default='')


class ReportSerializer(serializers.ModelSerializer):
    """What a moderator sees. Includes the message body — reviewing a report
    without reading what was said is not reviewing anything."""

    reporter_username = serializers.CharField(source='reporter.username', read_only=True)
    author_username = serializers.SerializerMethodField()
    author_id = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()
    scope = serializers.SerializerMethodField()
    is_deleted = serializers.SerializerMethodField()

    class Meta:
        model = MessageReport
        fields = ('id', 'scope', 'chat_message', 'direct_message',
                  'reporter_username', 'author_username', 'author_id', 'content',
                  'reason', 'detail', 'status', 'is_deleted',
                  'created_at', 'handled_at')

    def _target(self, obj):
        return obj.chat_message or obj.direct_message

    def _author(self, obj):
        target = self._target(obj)
        if target is None:
            return None
        return getattr(target, 'user', None) or getattr(target, 'sender', None)

    def get_scope(self, obj):
        return 'room' if obj.chat_message_id else 'direct'

    def get_author_username(self, obj):
        author = self._author(obj)
        return author.username if author else None

    def get_author_id(self, obj):
        author = self._author(obj)
        return author.id if author else None

    def get_content(self, obj):
        target = self._target(obj)
        return target.content if target else None

    def get_is_deleted(self, obj):
        target = self._target(obj)
        return bool(target and target.is_deleted)


class BlockSerializer(serializers.ModelSerializer):
    blocked_username = serializers.CharField(source='blocked.username', read_only=True)
    blocked_first_name = serializers.CharField(source='blocked.first_name', read_only=True)

    class Meta:
        model = UserBlock
        fields = ('blocked', 'blocked_username', 'blocked_first_name', 'created_at')
        read_only_fields = ('created_at',)


class ModerationDeleteSerializer(serializers.Serializer):
    reason = serializers.CharField(max_length=200, required=False, allow_blank=True, default='')


def dm_enabled():
    """Read at call time, not at import, so tests and staging can override it."""
    return bool(getattr(settings, 'DM_ENABLED', False))
