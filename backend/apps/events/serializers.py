from rest_framework import serializers

from .models import SpaceEvent


class SpaceEventSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = SpaceEvent
        fields = (
            'id', 'title_en', 'title_uz', 'title_ru',
            'description_en', 'description_uz', 'description_ru',
            'event_date', 'event_type', 'image_url',
            'source_url', 'is_featured', 'is_historical',
            'event_time', 'visibility', 'facts',
        )

    def get_image_url(self, obj):
        if not obj.image:
            return None
        request = self.context.get('request')
        return request.build_absolute_uri(obj.image.url) if request else obj.image.url


class SpaceEventWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpaceEvent
        fields = (
            'title_en', 'title_uz', 'title_ru',
            'description_en', 'description_uz', 'description_ru',
            'event_date', 'event_type', 'image',
            'source_url', 'is_featured', 'is_historical',
            'event_time', 'visibility', 'facts',
        )
