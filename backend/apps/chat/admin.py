from django.contrib import admin
from django.utils import timezone

from .models import (
    ChatMessage, ChatRoom, Conversation, DirectMessage, MessageReport, UserBlock,
)


@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ('slug', 'name', 'is_global')
    prepopulated_fields = {'slug': ('name',)}


@admin.action(description='Hide the selected messages')
def hide_messages(modeladmin, request, queryset):
    for message in queryset.filter(is_deleted=False):
        message.soft_delete(request.user, 'hidden from the admin')


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('user', 'room', 'content', 'is_deleted', 'created_at')
    list_filter = ('room', 'is_deleted')
    search_fields = ('user__username', 'content')
    actions = [hide_messages]
    readonly_fields = ('deleted_at', 'deleted_by')


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_participants', 'status', 'initiator', 'updated_at', 'created_at')
    list_filter = ('status', 'created_at')
    filter_horizontal = ('participants',)

    @admin.display(description='Participants')
    def get_participants(self, obj):
        return ', '.join(u.username for u in obj.participants.all()[:2])


@admin.register(DirectMessage)
class DirectMessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'conversation', 'short_content', 'is_read',
                    'is_deleted', 'created_at')
    list_filter = ('is_read', 'is_deleted', 'created_at')
    search_fields = ('sender__username', 'content')
    actions = [hide_messages]
    readonly_fields = ('deleted_at', 'deleted_by')

    @admin.display(description='Content')
    def short_content(self, obj):
        return obj.content[:80]


@admin.register(UserBlock)
class UserBlockAdmin(admin.ModelAdmin):
    list_display = ('blocker', 'blocked', 'created_at')
    search_fields = ('blocker__username', 'blocked__username')


@admin.action(description='Mark as actioned and hide the message')
def action_reports(modeladmin, request, queryset):
    for report in queryset:
        target = report.message
        if target is not None and not target.is_deleted:
            target.soft_delete(request.user, f'report #{report.id}')
        report.status = MessageReport.ACTIONED
        report.handled_by = request.user
        report.handled_at = timezone.now()
        report.save(update_fields=['status', 'handled_by', 'handled_at'])


@admin.action(description='Dismiss')
def dismiss_reports(modeladmin, request, queryset):
    queryset.update(
        status=MessageReport.DISMISSED, handled_by=request.user, handled_at=timezone.now(),
    )


@admin.register(MessageReport)
class MessageReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'reason', 'status', 'reporter', 'reported_content', 'created_at')
    list_filter = ('status', 'reason', 'created_at')
    search_fields = ('reporter__username', 'detail')
    actions = [action_reports, dismiss_reports]
    readonly_fields = ('reporter', 'chat_message', 'direct_message', 'created_at')

    @admin.display(description='Message')
    def reported_content(self, obj):
        target = obj.message
        return target.content[:80] if target else '(gone)'
