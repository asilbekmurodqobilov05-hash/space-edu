import math

from django.conf import settings
from django.db import models


class UserGamificationProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='gamification',
    )
    xp = models.PositiveIntegerField(default=0)
    level = models.PositiveSmallIntegerField(default=1)
    fuel = models.PositiveIntegerField(default=100)
    streak = models.PositiveSmallIntegerField(default=0)
    last_play_date = models.DateField(null=True, blank=True)
    skills = models.JSONField(default=dict)

    class Meta:
        verbose_name = 'Gamification Profile'

    def __str__(self):
        return f'{self.user.username} — Level {self.level}'

    def add_xp(self, amount):
        self.xp += amount
        self.level = math.floor(math.sqrt(self.xp / 100)) + 1
        self.save(update_fields=['xp', 'level'])

    def add_fuel(self, amount):
        self.fuel = min(self.fuel + amount, 1000)
        self.save(update_fields=['fuel'])

    def spend_fuel(self, amount):
        if self.fuel < amount:
            return False
        self.fuel -= amount
        self.save(update_fields=['fuel'])
        return True


class Badge(models.Model):
    CONDITION_TYPES = [
        ('xp_threshold', 'XP Threshold'),
        ('streak', 'Streak Days'),
        ('lessons', 'Lessons Completed'),
    ]
    RARITY_CHOICES = [
        ('common', 'Common'),
        ('rare', 'Rare'),
        ('epic', 'Epic'),
        ('legendary', 'Legendary'),
        ('exclusive', 'Exclusive'),
    ]
    
    slug = models.SlugField(unique=True)
    title_en = models.CharField(max_length=100)
    title_uz = models.CharField(max_length=100)
    title_ru = models.CharField(max_length=100)
    description_en = models.TextField()
    description_uz = models.TextField()
    description_ru = models.TextField()
    icon = models.CharField(max_length=50)
    rarity = models.CharField(max_length=20, choices=RARITY_CHOICES, default='common')
    condition_type = models.CharField(max_length=30, choices=CONDITION_TYPES)
    condition_value = models.PositiveIntegerField()

    class Meta:
        verbose_name = 'Badge'

    def __str__(self):
        return self.slug


class UserBadge(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='badges',
    )
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'badge')
        verbose_name = 'User Badge'

    def __str__(self):
        return f'{self.user.username} — {self.badge.slug}'


# ──────────────────────────────────────────────────────────────────────────────
#  REWARD PRODUCT  —  store items that users unlock with coins (fuel)
# ──────────────────────────────────────────────────────────────────────────────
class RewardProduct(models.Model):
    TIER_CHOICES = [
        ('common', 'Common'),
        ('rare', 'Rare'),
        ('epic', 'Epic'),
        ('legendary', 'Legendary'),
    ]
    CATEGORY_CHOICES = [
        ('tests', 'Mock Tests'),
        ('mentor', 'Mentorship'),
        ('content', 'Premium Content'),
        ('game', 'Game Items'),
    ]
    ICON_CHOICES = [
        ('BookOpen', 'BookOpen'),
        ('Code2', 'Code2'),
        ('GraduationCap', 'GraduationCap'),
        ('MessageSquare', 'MessageSquare'),
        ('Trophy', 'Trophy'),
        ('Zap', 'Zap'),
        ('Crown', 'Crown'),
        ('Rocket', 'Rocket'),
        ('Gamepad2', 'Gamepad2'),
        ('Star', 'Star'),
        ('Sparkles', 'Sparkles'),
        ('ShieldCheck', 'ShieldCheck'),
    ]

    slug = models.SlugField(unique=True)
    title_en = models.CharField(max_length=150)
    title_uz = models.CharField(max_length=150, blank=True, default='')
    title_ru = models.CharField(max_length=150, blank=True, default='')
    description_en = models.TextField()
    description_uz = models.TextField(blank=True, default='')
    description_ru = models.TextField(blank=True, default='')
    icon = models.CharField(max_length=30, choices=ICON_CHOICES, default='Star')
    tier = models.CharField(max_length=20, choices=TIER_CHOICES, default='common')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='content')
    cost = models.PositiveIntegerField(default=50, help_text='Cost in coins (fuel)')
    features = models.JSONField(default=list, blank=True, help_text='List of feature strings, e.g. ["3 Passages","40 Questions"]')
    is_active = models.BooleanField(default=True)
    order = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = 'Reward Product'

    def __str__(self):
        return f'{self.title_en} ({self.tier}) — {self.cost} coins'


class UserRewardPurchase(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reward_purchases',
    )
    product = models.ForeignKey(RewardProduct, on_delete=models.CASCADE, related_name='purchases')
    purchased_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')
        verbose_name = 'User Reward Purchase'

    def __str__(self):
        return f'{self.user.username} — {self.product.slug}'


# ──────────────────────────────────────────────────────────────────────────────
#  MISSION  —  dynamic objectives like "Complete 1 lesson", "Streak bonus"
# ──────────────────────────────────────────────────────────────────────────────
class Mission(models.Model):
    MISSION_TYPES = [
        ('streak', 'Daily Streak'),
        ('lesson', 'Lessons Completed'),
        ('mastery', 'Lessons Mastered'),
        ('inventory', 'Shop Items Owned'),
        ('custom', 'Custom'),
    ]

    slug = models.SlugField(unique=True)
    title_en = models.CharField(max_length=150)
    title_uz = models.CharField(max_length=150, blank=True, default='')
    title_ru = models.CharField(max_length=150, blank=True, default='')
    description_en = models.TextField()
    description_uz = models.TextField(blank=True, default='')
    description_ru = models.TextField(blank=True, default='')
    
    mission_type = models.CharField(max_length=30, choices=MISSION_TYPES, default='custom')
    target_value = models.PositiveIntegerField(default=1, help_text='How many actions required (e.g., 2 items)')
    reward_xp = models.PositiveIntegerField(default=0)
    reward_fuel = models.PositiveIntegerField(default=10)
    
    is_active = models.BooleanField(default=True)
    is_daily = models.BooleanField(default=False, help_text='If True, mission resets daily')
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Mission'

    def __str__(self):
        return f'{self.title_en} [{self.mission_type}]'


class UserMission(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='completed_missions',
    )
    mission = models.ForeignKey(Mission, on_delete=models.CASCADE, related_name='completions')
    is_completed = models.BooleanField(default=False)
    last_claimed_date = models.DateField(null=True, blank=True)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'mission')
        verbose_name = 'User Mission'

    def __str__(self):
        return f'{self.user.username} — {self.mission.slug}'

