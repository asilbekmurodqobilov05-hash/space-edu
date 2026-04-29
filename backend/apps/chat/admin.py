from django.contrib import admin

from .models import ChatMessage, ChatRoom


@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ('slug', 'name', 'is_global')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('user', 'room', 'content', 'created_at')
    list_filter = ('room',)
    search_fields = ('user__username', 'content')
