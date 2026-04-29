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
