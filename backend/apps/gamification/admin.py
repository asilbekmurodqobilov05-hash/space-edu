from django.contrib import admin

from .models import Badge, UserBadge, UserGamificationProfile, RewardProduct, UserRewardPurchase


@admin.register(UserGamificationProfile)
class GamificationProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'xp', 'level', 'fuel', 'streak')
    list_filter = ('level',)
    search_fields = ('user__username',)


@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ('slug', 'rarity', 'condition_type', 'condition_value')
    list_filter = ('condition_type', 'rarity')
    prepopulated_fields = {'slug': ('title_en',)}


@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ('user', 'badge', 'earned_at')
    search_fields = ('user__username', 'badge__slug')


@admin.register(RewardProduct)
class RewardProductAdmin(admin.ModelAdmin):
    list_display = ('title_en', 'tier', 'category', 'cost', 'is_active', 'order')
    list_filter = ('tier', 'category', 'is_active')
    list_editable = ('cost', 'tier', 'category', 'is_active', 'order')
    search_fields = ('title_en', 'slug')
    prepopulated_fields = {'slug': ('title_en',)}
    fieldsets = (
        ('Identity', {
            'fields': ('slug', 'icon', 'tier', 'category', 'cost', 'order', 'is_active'),
        }),
        ('English', {
            'fields': ('title_en', 'description_en'),
        }),
        ('Uzbek', {
            'fields': ('title_uz', 'description_uz'),
            'classes': ('collapse',),
        }),
        ('Russian', {
            'fields': ('title_ru', 'description_ru'),
            'classes': ('collapse',),
        }),
        ('Features', {
            'fields': ('features',),
            'description': 'JSON list: ["Feature 1", "Feature 2"]',
        }),
    )


@admin.register(UserRewardPurchase)
class UserRewardPurchaseAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'purchased_at')
    list_filter = ('product__tier', 'product__category')
    search_fields = ('user__username', 'product__slug')
    raw_id_fields = ('user', 'product')

