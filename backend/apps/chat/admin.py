from django.contrib import admin

from .models import ChatMessage, ChatRoom, Conversation, DirectMessage


@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ('slug', 'name', 'is_global')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('user', 'room', 'content', 'created_at')
    list_filter = ('room',)
    search_fields = ('user__username', 'content')


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_participants', 'updated_at', 'created_at')
    list_filter = ('created_at',)
    filter_horizontal = ('participants',)

    @admin.display(description='Participants')
    def get_participants(self, obj):
        return ', '.join(u.username for u in obj.participants.all()[:2])


@admin.register(DirectMessage)
class DirectMessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'conversation', 'short_content', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('sender__username', 'content')

    @admin.display(description='Content')
    def short_content(self, obj):
        return obj.content[:80]
