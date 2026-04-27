from django.contrib import admin
from .models import LessonProgress, UnitEnrollment


@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ("user", "lesson_id", "unit_id", "score", "completed", "mastered")
    list_filter = ("completed", "mastered")
    search_fields = ("user__email", "lesson_id", "unit_id")


@admin.register(UnitEnrollment)
class UnitEnrollmentAdmin(admin.ModelAdmin):
    list_display = ("user", "unit_id", "created_at")
    search_fields = ("user__email", "unit_id")
