from rest_framework import serializers

from .models import NewsArticle


class NewsArticleSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = NewsArticle
        fields = (
            'id', 'title_en', 'title_uz', 'title_ru',
            'summary_en', 'summary_uz', 'summary_ru',
            'content_en', 'content_uz', 'content_ru',
            'image_url', 'category', 'source', 'source_url',
            'published_at', 'is_published',
        )

    def get_image_url(self, obj):
        if not obj.image:
            return None
        request = self.context.get('request')
        return request.build_absolute_uri(obj.image.url) if request else obj.image.url


class NewsArticleWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsArticle
        fields = (
            'title_en', 'title_uz', 'title_ru',
            'summary_en', 'summary_uz', 'summary_ru',
            'content_en', 'content_uz', 'content_ru',
            'image', 'category', 'source', 'source_url',
            'published_at', 'is_published',
        )
