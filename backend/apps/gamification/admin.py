from django.contrib import admin
from .models import PlayerProfile, Badge


class BadgeInline(admin.TabularInline):
    model = Badge
    extra = 0
    readonly_fields = ("unlocked_at",)


@admin.register(PlayerProfile)
class PlayerProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "xp", "level", "streak", "fuel", "career_track")
    list_filter = ("career_track",)
    search_fields = ("user__email", "user__username")
    inlines = (BadgeInline,)
    readonly_fields = ("level",)
