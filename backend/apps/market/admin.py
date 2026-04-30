from django.contrib import admin

from .models import MarketItem, UserInventory


@admin.register(MarketItem)
class MarketItemAdmin(admin.ModelAdmin):
    list_display = ('slug', 'title_en', 'item_type', 'price', 'discount_percent', 'cost_fuel', 'is_bestseller', 'is_new', 'is_active')
    list_filter = ('item_type', 'is_active', 'is_bestseller', 'is_new')
    list_editable = ('price', 'discount_percent', 'cost_fuel', 'is_bestseller', 'is_new', 'is_active')
    search_fields = ('slug', 'title_en', 'title_ru', 'title_uz')
    prepopulated_fields = {'slug': ('title_en',)}
    fieldsets = (
        ('Identity', {
            'fields': ('slug', 'item_type', 'image'),
        }),
        ('Titles', {
            'fields': ('title_en', 'title_uz', 'title_ru'),
        }),
        ('Descriptions', {
            'fields': ('description_en', 'description_uz', 'description_ru'),
            'classes': ('collapse',),
        }),
        ('Pricing', {
            'fields': ('price', 'original_price', 'discount_percent', 'cost_fuel'),
        }),
        ('Flags', {
            'fields': ('is_bestseller', 'is_new', 'is_active'),
        }),
    )


@admin.register(UserInventory)
class UserInventoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'item', 'purchased_at')
    search_fields = ('user__username', 'item__slug')
