from django.contrib import admin

from .models import Lesson, LessonSection, Level, QuizQuestion, Unit


class UnitInline(admin.TabularInline):
    model = Unit
    extra = 0
    fields = ('slug', 'order', 'title_en', 'xp_reward', 'fuel_reward')


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 0
    fields = ('slug', 'order', 'title_en', 'lesson_type', 'xp_reward')


class SectionInline(admin.TabularInline):
    model = LessonSection
    extra = 0
    fields = ('order', 'section_type', 'content_en')


class QuizInline(admin.TabularInline):
    model = QuizQuestion
    extra = 0
    fields = ('order', 'text_en', 'correct_answer')


@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ('slug', 'order', 'title_en')
    prepopulated_fields = {'slug': ('title_en',)}
    inlines = [UnitInline]


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ('slug', 'level', 'order', 'xp_reward', 'fuel_reward')
    list_filter = ('level',)
    inlines = [LessonInline]


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('slug', 'unit', 'order', 'lesson_type', 'xp_reward')
    list_filter = ('lesson_type', 'unit__level')
    inlines = [SectionInline, QuizInline]
