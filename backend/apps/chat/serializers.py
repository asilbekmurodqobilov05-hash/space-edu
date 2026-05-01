from rest_framework import serializers
from django.conf import settings

from .models import ChatMessage, ChatRoom, Conversation, DirectMessage


class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ('slug', 'name', 'is_global')


class ChatMessageSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = ChatMessage
        fields = ('id', 'username', 'first_name', 'avatar_url', 'content', 'created_at')
        read_only_fields = ('id', 'username', 'first_name', 'avatar_url', 'created_at')

    def get_avatar_url(self, obj):
        if not obj.user.avatar:
            return None
        request = self.context.get('request')
        return request.build_absolute_uri(obj.user.avatar.url) if request else obj.user.avatar.url


class PostMessageSerializer(serializers.Serializer):
    content = serializers.CharField(max_length=1000, min_length=1)


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


class ConversationSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ('id', 'other_user', 'last_message', 'unread_count', 'updated_at')

    def _me(self):
        return self.context['request'].user

    def get_other_user(self, obj):
        other = obj.other_user(self._me())
        if not other:
            return None
        return UserMiniSerializer(other, context=self.context).data

    def get_last_message(self, obj):
        msg = obj.messages.order_by('-created_at').first()
        if not msg:
            return None
        return {
            'content': msg.content[:100],
            'created_at': msg.created_at,
            'is_mine': msg.sender_id == self._me().id,
        }

    def get_unread_count(self, obj):
        return obj.messages.filter(is_read=False).exclude(sender=self._me()).count()
