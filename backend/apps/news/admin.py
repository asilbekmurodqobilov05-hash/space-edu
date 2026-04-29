from django.contrib import admin

from .models import NewsArticle


@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display  = ('title_en', 'category', 'source', 'published_at', 'is_published')
    list_filter   = ('category', 'is_published')
    search_fields = ('title_en', 'title_uz', 'title_ru', 'source')
    list_editable = ('is_published',)
    date_hierarchy = 'published_at'
