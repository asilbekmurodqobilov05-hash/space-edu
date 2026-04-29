from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'astronaut_name', 'language', 'is_staff', 'date_joined')
    list_filter = ('language', 'is_staff', 'is_active')
    search_fields = ('username', 'email', 'astronaut_name')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Profile', {'fields': ('avatar', 'astronaut_name', 'bio', 'selected_spaceship', 'language')}),
    )
