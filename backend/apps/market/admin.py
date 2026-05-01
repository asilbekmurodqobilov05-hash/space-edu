from django.contrib import admin

from .models import MarketItem, MarketCategory, UserInventory, Wishlist, ItemReview


@admin.register(MarketCategory)
class MarketCategoryAdmin(admin.ModelAdmin):
    list_display = ('slug', 'name_en', 'icon', 'color', 'order')
    list_editable = ('order',)
    prepopulated_fields = {'slug': ('name_en',)}


class ReviewInline(admin.TabularInline):
    model = ItemReview
    extra = 0
    fields = ('user', 'rating', 'comment', 'created_at')
    readonly_fields = ('created_at',)


@admin.register(MarketItem)
class MarketItemAdmin(admin.ModelAdmin):
    list_display = (
        'slug', 'title_en', 'category', 'item_type',
        'price', 'discount_percent', 'cost_fuel',
        'rating_avg', 'sold_count',
        'is_bestseller', 'is_new', 'is_featured', 'is_limited', 'is_active',
    )
    list_filter = ('item_type', 'category', 'is_active', 'is_bestseller', 'is_new', 'is_featured', 'is_limited')
    list_editable = ('price', 'discount_percent', 'cost_fuel', 'is_bestseller', 'is_new', 'is_featured', 'is_limited', 'is_active')
    search_fields = ('slug', 'title_en', 'title_ru', 'title_uz', 'tags')
    prepopulated_fields = {'slug': ('title_en',)}
    inlines = [ReviewInline]
    fieldsets = (
        ('Identity', {
            'fields': ('slug', 'category', 'item_type', 'image', 'tags'),
        }),
        ('Titles', {
            'fields': ('title_en', 'title_uz', 'title_ru'),
        }),
        ('Descriptions', {
            'fields': ('description_en', 'description_uz', 'description_ru'),
            'classes': ('collapse',),
        }),
        ('Pricing', {
            'fields': ('price', 'original_price', 'discount_percent', 'discount_start', 'discount_end', 'cost_fuel'),
        }),
        ('Stock & Stats', {
            'fields': ('stock', 'sold_count', 'rating_avg', 'rating_count'),
        }),
        ('Flags', {
            'fields': ('is_bestseller', 'is_new', 'is_featured', 'is_limited', 'is_active'),
        }),
    )
    readonly_fields = ('sold_count', 'rating_avg', 'rating_count')


@admin.register(UserInventory)
class UserInventoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'item', 'purchased_at')
    search_fields = ('user__username', 'item__slug')


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'item', 'added_at')
    search_fields = ('user__username', 'item__slug')


@admin.register(ItemReview)
class ItemReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'item', 'rating', 'created_at')
    list_filter = ('rating',)
    search_fields = ('user__username', 'item__slug', 'comment')
