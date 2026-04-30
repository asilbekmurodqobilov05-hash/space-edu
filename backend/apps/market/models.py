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

    # Pricing
    price = models.PositiveIntegerField(default=0, help_text='Price in soums')
    original_price = models.PositiveIntegerField(blank=True, null=True, help_text='Original price before discount (leave blank if no discount)')
    discount_percent = models.PositiveSmallIntegerField(default=0, help_text='Discount percentage (0-100)')
    cost_fuel = models.PositiveIntegerField(help_text='Price in fuel (gamification currency)')

    # Badges / flags
    is_bestseller = models.BooleanField(default=False)
    is_new = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    image = models.ImageField(upload_to='market/', blank=True)

    class Meta:
        verbose_name = 'Market Item'

    def __str__(self):
        return f'{self.title_en} ({self.slug})'


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
