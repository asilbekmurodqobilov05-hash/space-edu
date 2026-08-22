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


class ModeratedMessage(models.Model):
    """Shared soft-delete fields for anything a moderator can remove.

    Rows are hidden, never deleted. A moderator has to be able to answer "what
    did this account actually send" after the fact, and a hard delete on report
    would let anyone erase the evidence for their own report.
    """

    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    deleted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL, null=True, blank=True,
        related_name='+',
    )
    deleted_reason = models.CharField(max_length=200, blank=True, default='')

    class Meta:
        abstract = True

    def soft_delete(self, by, reason=''):
        from django.utils import timezone

        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.deleted_by = by
        self.deleted_reason = reason[:200]
        self.save(update_fields=['is_deleted', 'deleted_at', 'deleted_by', 'deleted_reason'])


class ChatMessage(ModeratedMessage):
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
        indexes = [models.Index(fields=['room', '-created_at'])]

    def __str__(self):
        return f'{self.user.username}: {self.content[:50]}'


# ── Direct Messages ──────────────────────────────────────────────

class Conversation(models.Model):
    """A 1-to-1 conversation between exactly two users.

    `status` is the consent step. Any account could previously find any other by
    a two-character name search and drop a message straight into their inbox.
    A conversation now starts pending: the first message is delivered, but the
    sender cannot send a second until the recipient accepts, and declining ends
    it. This is the shape most messaging products settle on, and it is the
    minimum for a product whose users are minors.
    """

    PENDING = 'pending'
    ACCEPTED = 'accepted'
    DECLINED = 'declined'
    STATUS_CHOICES = [
        (PENDING, 'Awaiting the recipient'),
        (ACCEPTED, 'Accepted'),
        (DECLINED, 'Declined'),
    ]

    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='dm_conversations',
    )
    initiator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, null=True, blank=True,
        related_name='initiated_conversations',
        help_text='Who asked to start it. The other side is the one who accepts.',
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=PENDING)
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


class DirectMessage(ModeratedMessage):
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


# ── Moderation ───────────────────────────────────────────────────

class UserBlock(models.Model):
    """One user refusing contact from another.

    Blocking is one-directional in intent and two-directional in effect: the
    blocker stops seeing the blocked account, and the blocked account cannot
    reach the blocker. A child should not have to explain themselves to make
    someone stop.
    """

    blocker = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='blocks_made',
    )
    blocked = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='blocks_received',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('blocker', 'blocked')
        verbose_name = 'User Block'
        indexes = [models.Index(fields=['blocker', 'blocked'])]

    def __str__(self):
        return f'{self.blocker.username} blocked {self.blocked.username}'

    @classmethod
    def between(cls, a, b):
        """True if either has blocked the other."""
        return cls.objects.filter(
            models.Q(blocker=a, blocked=b) | models.Q(blocker=b, blocked=a)
        ).exists()

    @classmethod
    def ids_hidden_from(cls, user):
        """Everyone whose messages `user` should not see, in one query."""
        made = cls.objects.filter(blocker=user).values_list('blocked_id', flat=True)
        received = cls.objects.filter(blocked=user).values_list('blocker_id', flat=True)
        return set(made) | set(received)


class MessageReport(models.Model):
    """A user flagging a message for a moderator.

    Points at either a room message or a direct message — exactly one — rather
    than at a generic relation, because two nullable columns with a constraint
    are easier to query and to read in the admin than a content-type join.
    """

    REASONS = [
        ('abuse', 'Abusive or threatening'),
        ('sexual', 'Sexual content'),
        ('bullying', 'Bullying or harassment'),
        ('personal_info', 'Sharing personal information'),
        ('spam', 'Spam or advertising'),
        ('other', 'Something else'),
    ]
    OPEN = 'open'
    ACTIONED = 'actioned'
    DISMISSED = 'dismissed'
    STATUSES = [
        (OPEN, 'Open'),
        (ACTIONED, 'Actioned'),
        (DISMISSED, 'Dismissed'),
    ]

    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reports_made',
    )
    chat_message = models.ForeignKey(
        ChatMessage, on_delete=models.CASCADE, null=True, blank=True, related_name='reports',
    )
    direct_message = models.ForeignKey(
        DirectMessage, on_delete=models.CASCADE, null=True, blank=True, related_name='reports',
    )
    reason = models.CharField(max_length=20, choices=REASONS)
    detail = models.TextField(blank=True, default='', max_length=1000)
    status = models.CharField(max_length=10, choices=STATUSES, default=OPEN)
    created_at = models.DateTimeField(auto_now_add=True)
    handled_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL, null=True, blank=True, related_name='reports_handled',
    )
    handled_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['status', '-created_at']
        verbose_name = 'Message Report'
        constraints = [
            models.CheckConstraint(
                condition=(
                    models.Q(chat_message__isnull=False, direct_message__isnull=True)
                    | models.Q(chat_message__isnull=True, direct_message__isnull=False)
                ),
                name='report_targets_exactly_one_message',
            ),
            # One report per person per message. A second click is not a second
            # complaint, and letting it be one makes the queue useless.
            models.UniqueConstraint(
                fields=['reporter', 'chat_message'],
                condition=models.Q(chat_message__isnull=False),
                name='one_report_per_reporter_per_chat_message',
            ),
            models.UniqueConstraint(
                fields=['reporter', 'direct_message'],
                condition=models.Q(direct_message__isnull=False),
                name='one_report_per_reporter_per_direct_message',
            ),
        ]

    def __str__(self):
        return f'{self.get_reason_display()} — {self.status}'

    @property
    def message(self):
        return self.chat_message or self.direct_message


class ChatSuspension(models.Model):
    """A moderator stopping one account from posting, for a while.

    Deleting a message removes what was said; it does nothing about someone who
    keeps saying it. The alternative already on the User model is `is_active`,
    which is an account ban — it locks the student out of their lessons too.
    A child who was unkind in chat should lose the chat, not their education.

    Not deleted when it expires: a moderator looking at a repeat report needs to
    see that this account has been here before.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chat_suspensions',
    )
    until = models.DateTimeField(help_text='Posting is refused until this moment.')
    reason = models.CharField(max_length=200, blank=True, default='')
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL, null=True, blank=True, related_name='+',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    lifted_at = models.DateTimeField(
        null=True, blank=True, help_text='Set when a moderator ends it early.',
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Chat Suspension'
        indexes = [models.Index(fields=['user', 'until'])]

    def __str__(self):
        return f'{self.user.username} until {self.until:%Y-%m-%d %H:%M}'

    @property
    def is_active(self):
        from django.utils import timezone

        return self.lifted_at is None and self.until > timezone.now()

    @classmethod
    def active_for(cls, user):
        """The suspension in force for this user, or None. One query."""
        from django.utils import timezone

        if not user.is_authenticated:
            return None
        return (
            cls.objects
            .filter(user=user, lifted_at__isnull=True, until__gt=timezone.now())
            .order_by('-until')
            .first()
        )
