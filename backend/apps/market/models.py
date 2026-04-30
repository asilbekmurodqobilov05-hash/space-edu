from django.conf import settings
from django.db import models


class MarketItem(models.Model):
    ITEM_TYPES = [
        ('spaceship', 'Spaceship'),
        ('badge', 'Badge'),
        ('boost', 'XP Boost'),
        ('book', 'Book'),
        ('rocket_module', 'Rocket Module'),
        ('satellite', 'Satellite'),
        ('other', 'Other'),
    ]
    slug = models.SlugField(unique=True)
    title_en = models.CharField(max_length=100)
    title_uz = models.CharField(max_length=100)
    title_ru = models.CharField(max_length=100)
    description_en = models.TextField()
    description_uz = models.TextField()
    description_ru = models.TextField()
    item_type = models.CharField(max_length=20, choices=ITEM_TYPES)
    cost_fuel = models.PositiveIntegerField()
    image = models.ImageField(upload_to='market/', blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Market Item'

    def __str__(self):
        return self.slug


class UserInventory(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='inventory',
    )
    item = models.ForeignKey(MarketItem, on_delete=models.CASCADE)
    purchased_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'item')
        verbose_name = 'User Inventory'

    def __str__(self):
        return f'{self.user.username} — {self.item.slug}'
