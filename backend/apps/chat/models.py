from django.conf import settings
from django.db import models


class ChatRoom(models.Model):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=100)
    is_global = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Chat Room'

    def __str__(self):
        return self.slug


class ChatMessage(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='chat_messages',
    )
    content = models.TextField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Chat Message'

    def __str__(self):
        return f'{self.user.username}: {self.content[:50]}'


# ── Direct Messages ──────────────────────────────────────────────

class Conversation(models.Model):
    """A 1-to-1 conversation between exactly two users."""
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='dm_conversations',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        verbose_name = 'DM Conversation'

    def __str__(self):
        names = ', '.join(u.username for u in self.participants.all()[:2])
        return f'DM: {names}'

    def other_user(self, me):
        return self.participants.exclude(id=me.id).first()


class DirectMessage(models.Model):
    conversation = models.ForeignKey(
        Conversation, on_delete=models.CASCADE, related_name='messages',
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_dms',
    )
    content = models.TextField(max_length=2000)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        verbose_name = 'Direct Message'

    def __str__(self):
        return f'{self.sender.username}: {self.content[:50]}'
