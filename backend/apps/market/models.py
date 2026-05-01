from django.conf import settings
from django.db import models
from django.utils import timezone


# ──────────────────────────────────────────────────────────────────────────────
#  CATEGORY  —  marketplace sections
# ──────────────────────────────────────────────────────────────────────────────
class MarketCategory(models.Model):
    slug = models.SlugField(unique=True)
    name_en = models.CharField(max_length=80)
    name_uz = models.CharField(max_length=80)
    name_ru = models.CharField(max_length=80, blank=True, default='')
    icon = models.CharField(max_length=50, blank=True, default='Package', help_text='Lucide icon name')
    color = models.CharField(max_length=24, blank=True, default='#a78bfa')
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name_en


# ──────────────────────────────────────────────────────────────────────────────
#  MARKET ITEM  —  product in the marketplace
# ──────────────────────────────────────────────────────────────────────────────
class MarketItem(models.Model):
    ITEM_TYPES = [
        ('spaceship', 'Spaceship'),
        ('badge', 'Badge'),
        ('boost', 'XP Boost'),
        ('book', 'Book'),
        ('rocket_module', 'Rocket Module'),
        ('satellite', 'Satellite'),
        ('avatar', 'Avatar'),
        ('theme', 'Theme'),
        ('tool', 'Tool'),
        ('other', 'Other'),
    ]
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(MarketCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='items')
    title_en = models.CharField(max_length=100)
    title_uz = models.CharField(max_length=100)
    title_ru = models.CharField(max_length=100)
    description_en = models.TextField()
    description_uz = models.TextField()
    description_ru = models.TextField()
    item_type = models.CharField(max_length=20, choices=ITEM_TYPES)

    # Pricing
    price = models.PositiveIntegerField(default=0, help_text='Price in soums')
    original_price = models.PositiveIntegerField(blank=True, null=True, help_text='Original price before discount')
    discount_percent = models.PositiveSmallIntegerField(default=0, help_text='Discount 0-100')
    cost_fuel = models.PositiveIntegerField(help_text='Price in fuel (gamification currency)')

    # Discount scheduling
    discount_start = models.DateTimeField(null=True, blank=True, help_text='When discount becomes active')
    discount_end = models.DateTimeField(null=True, blank=True, help_text='When discount expires')

    # Badges / flags
    is_bestseller = models.BooleanField(default=False)
    is_new = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False, help_text='Show on homepage / featured section')
    is_limited = models.BooleanField(default=False, help_text='Limited edition item')
    is_active = models.BooleanField(default=True)

    # Stock
    stock = models.PositiveIntegerField(default=0, help_text='0 = unlimited')
    sold_count = models.PositiveIntegerField(default=0, editable=False)

    # Rating (cached)
    rating_avg = models.FloatField(default=0.0)
    rating_count = models.PositiveIntegerField(default=0)

    # Tags (comma-separated for simplicity)
    tags = models.CharField(max_length=500, blank=True, default='', help_text='Comma-separated tags')

    image = models.ImageField(upload_to='market/', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Market Item'

    def __str__(self):
        return f'{self.title_en} ({self.slug})'

    @property
    def is_discount_active(self):
        now = timezone.now()
        if self.discount_percent <= 0:
            return False
        if self.discount_start and now < self.discount_start:
            return False
        if self.discount_end and now > self.discount_end:
            return False
        return True

    @property
    def effective_price(self):
        if self.is_discount_active and self.original_price:
            return self.price
        return self.original_price or self.price

    @property
    def in_stock(self):
        return self.stock == 0 or self.stock > self.sold_count


# ──────────────────────────────────────────────────────────────────────────────
#  USER INVENTORY  —  purchased items
# ──────────────────────────────────────────────────────────────────────────────
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


# ──────────────────────────────────────────────────────────────────────────────
#  WISHLIST
# ──────────────────────────────────────────────────────────────────────────────
class Wishlist(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='wishlist',
    )
    item = models.ForeignKey(MarketItem, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'item')
        verbose_name = 'Wishlist Item'

    def __str__(self):
        return f'{self.user.username} wants {self.item.slug}'


# ──────────────────────────────────────────────────────────────────────────────
#  REVIEW / RATING
# ──────────────────────────────────────────────────────────────────────────────
class ItemReview(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='market_reviews',
    )
    item = models.ForeignKey(MarketItem, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(help_text='1-5 stars')
    comment = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'item')
        ordering = ['-created_at']
        verbose_name = 'Item Review'

    def __str__(self):
        return f'{self.user.username} rated {self.item.slug} {self.rating}/5'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update cached rating on MarketItem
        reviews = self.item.reviews.all()
        self.item.rating_count = reviews.count()
        self.item.rating_avg = round(sum(r.rating for r in reviews) / max(reviews.count(), 1), 2)
        self.item.save(update_fields=['rating_avg', 'rating_count'])
