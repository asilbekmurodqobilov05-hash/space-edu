from django.contrib import admin

from .models import SpaceEvent


@admin.register(SpaceEvent)
class SpaceEventAdmin(admin.ModelAdmin):
    list_display  = ('event_date', 'title_en', 'event_type', 'is_featured', 'is_historical')
    list_filter   = ('event_type', 'is_featured', 'is_historical')
    search_fields = ('title_en', 'title_uz', 'title_ru')
    list_editable = ('is_featured', 'is_historical')
    date_hierarchy = 'event_date'
