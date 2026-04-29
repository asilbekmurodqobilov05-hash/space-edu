from django.contrib import admin

from .models import Badge, UserBadge, UserGamificationProfile


@admin.register(UserGamificationProfile)
class GamificationProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'xp', 'level', 'fuel', 'streak')
    list_filter = ('level',)
    search_fields = ('user__username',)


@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ('slug', 'condition_type', 'condition_value')
    list_filter = ('condition_type',)
    prepopulated_fields = {'slug': ('title_en',)}


@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ('user', 'badge', 'earned_at')
    search_fields = ('user__username', 'badge__slug')
