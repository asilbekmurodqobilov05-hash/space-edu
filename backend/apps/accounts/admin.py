from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("email", "username", "astronaut_name", "language", "is_staff", "date_joined")
    list_filter = ("language", "is_staff", "is_active")
    search_fields = ("email", "username", "astronaut_name")
    ordering = ("-date_joined",)
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Space EDU", {"fields": ("astronaut_name", "language", "avatar_url")}),
    )
