from rest_framework import serializers

from .models import ChatMessage, ChatRoom


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
