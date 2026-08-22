from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.validators import image_upload_to
from django.db.models import Avg, Count
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
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

    image = models.ImageField(upload_to=image_upload_to('market'), blank=True)
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
    # Documented as 1-5 but declared with no validator, so the write serializer
    # accepted anything up to 32767 and ItemReview.save() copied it straight
    # into the public MarketItem.rating_avg.
    rating = models.PositiveSmallIntegerField(
        help_text='1-5 stars',
        validators=[MinValueValidator(1), MaxValueValidator(5)],
    )
    comment = models.TextField(blank=True, default='', max_length=2000)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'item')
        ordering = ['-created_at']
        verbose_name = 'Item Review'

    def __str__(self):
        return f'{self.user.username} rated {self.item.slug} {self.rating}/5'

    @staticmethod
    def recalculate_item_rating(item):
        """Recompute the cached rating in the database rather than in Python.

        The old version loaded every review into memory and called .count() twice.
        """
        agg = item.reviews.aggregate(avg=Avg('rating'), n=Count('id'))
        item.rating_avg = round(agg['avg'] or 0.0, 2)
        item.rating_count = agg['n'] or 0
        item.save(update_fields=['rating_avg', 'rating_count'])


@receiver(post_save, sender=ItemReview)
@receiver(post_delete, sender=ItemReview)
def _sync_item_rating(sender, instance, **kwargs):
    """Keep MarketItem.rating_avg / rating_count in step with the reviews.

    Signals rather than a Model.delete() override, because a queryset delete
    (an admin bulk action, or a cascade from a removed user) never calls the
    method. Recomputing only on save meant a deleted one-star review kept
    dragging the public average down for good.
    """
    ItemReview.recalculate_item_rating(instance.item)
