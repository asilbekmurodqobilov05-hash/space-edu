from rest_framework import serializers

from .models import MarketItem, MarketCategory, UserInventory, Wishlist, ItemReview


# ── Category ──
class MarketCategorySerializer(serializers.ModelSerializer):
    item_count = serializers.IntegerField(source='items.count', read_only=True)

    class Meta:
        model = MarketCategory
        fields = ('id', 'slug', 'name_en', 'name_uz', 'name_ru', 'icon', 'color', 'order', 'item_count')


# ── MarketItem ──
class MarketItemSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name_en', read_only=True, default=None)
    is_discount_active = serializers.BooleanField(read_only=True)
    effective_price = serializers.IntegerField(read_only=True)
    in_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = MarketItem
        fields = (
            'id', 'slug', 'title_en', 'title_uz', 'title_ru',
            'description_en', 'description_uz', 'description_ru',
            'item_type', 'category', 'category_name',
            'price', 'original_price', 'discount_percent',
            'discount_start', 'discount_end', 'is_discount_active', 'effective_price',
            'cost_fuel', 'is_bestseller', 'is_new', 'is_featured', 'is_limited',
            'stock', 'sold_count', 'in_stock',
            'rating_avg', 'rating_count',
            'tags', 'image_url', 'is_active', 'created_at',
        )

    def get_image_url(self, obj):
        if not obj.image:
            return None
        request = self.context.get('request')
        return request.build_absolute_uri(obj.image.url) if request else obj.image.url


class MarketItemWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketItem
        fields = (
            'slug', 'category', 'title_en', 'title_uz', 'title_ru',
            'description_en', 'description_uz', 'description_ru',
            'item_type', 'price', 'original_price', 'discount_percent',
            'discount_start', 'discount_end',
            'cost_fuel', 'is_bestseller', 'is_new', 'is_featured', 'is_limited',
            'stock', 'tags', 'image', 'is_active',
        )


# ── Inventory ──
class UserInventorySerializer(serializers.ModelSerializer):
    item = MarketItemSerializer()

    class Meta:
        model = UserInventory
        fields = ('item', 'purchased_at')


class PurchaseSerializer(serializers.Serializer):
    item_slug = serializers.SlugField()


# ── Wishlist ──
class WishlistSerializer(serializers.ModelSerializer):
    item = MarketItemSerializer(read_only=True)

    class Meta:
        model = Wishlist
        fields = ('id', 'item', 'added_at')


class WishlistWriteSerializer(serializers.Serializer):
    item_slug = serializers.SlugField()


# ── Review ──
class ItemReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = ItemReview
        fields = ('id', 'username', 'rating', 'comment', 'created_at')


class ItemReviewWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemReview
        fields = ('rating', 'comment')
