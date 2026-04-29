from django.contrib import admin

from .models import UserLessonProgress, UserUnitEnrollment


@admin.register(UserLessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'lesson', 'score', 'attempts', 'is_mastered', 'completed_at')
    list_filter = ('is_mastered',)
    search_fields = ('user__username', 'lesson__slug')


@admin.register(UserUnitEnrollment)
class UnitEnrollmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'unit', 'enrolled_at', 'completed_at')
    search_fields = ('user__username', 'unit__slug')
