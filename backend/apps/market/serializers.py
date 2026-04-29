from rest_framework import serializers

from .models import MarketItem, UserInventory


class MarketItemSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = MarketItem
        fields = (
            'id', 'slug', 'title_en', 'title_uz', 'title_ru',
            'description_en', 'description_uz', 'description_ru',
            'item_type', 'cost_fuel', 'image_url', 'is_active',
        )

    def get_image_url(self, obj):
        if not obj.image:
            return None
        request = self.context.get('request')
        return request.build_absolute_uri(obj.image.url) if request else obj.image.url


class UserInventorySerializer(serializers.ModelSerializer):
    item = MarketItemSerializer()

    class Meta:
        model = UserInventory
        fields = ('item', 'purchased_at')


class PurchaseSerializer(serializers.Serializer):
    item_slug = serializers.SlugField()
