from django.contrib import admin

from .models import MarketItem, UserInventory


@admin.register(MarketItem)
class MarketItemAdmin(admin.ModelAdmin):
    list_display = ('slug', 'item_type', 'cost_fuel', 'is_active')
    list_filter = ('item_type', 'is_active')
    prepopulated_fields = {'slug': ('title_en',)}


@admin.register(UserInventory)
class UserInventoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'item', 'purchased_at')
    search_fields = ('user__username', 'item__slug')
