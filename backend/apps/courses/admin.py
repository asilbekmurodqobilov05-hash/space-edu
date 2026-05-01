from django.contrib import admin

from .models import (
    Sphere, Topic, TopicLesson, SubLesson, Problem,
    Level, Unit, Lesson, LessonSection, QuizQuestion,
)


# ══════════════════════════════════════════════════════════════════════════════
#  NEW SPHERE-BASED ADMIN
# ══════════════════════════════════════════════════════════════════════════════

class TopicInline(admin.TabularInline):
    model = Topic
    extra = 0
    fields = ('order', 'title', 'title_en', 'color')
    show_change_link = True


class TopicLessonInline(admin.TabularInline):
    model = TopicLesson
    extra = 0
    fields = ('order', 'name', 'name_en', 'video_url')
    show_change_link = True


class SubLessonInline(admin.TabularInline):
    model = SubLesson
    extra = 0
    fields = ('order', 'name', 'name_en', 'video_url')


class ProblemInline(admin.TabularInline):
    model = Problem
    extra = 0
    fields = ('number', 'question', 'answer', 'difficulty')


@admin.register(Sphere)
class SphereAdmin(admin.ModelAdmin):
    list_display = ('slug', 'title', 'title_en', 'order', 'color', 'lessons_count', 'is_active')
    list_editable = ('order', 'is_active')
    list_filter = ('is_active',)
    prepopulated_fields = {'slug': ('title_en',)}
    search_fields = ('title', 'title_en')
    inlines = [TopicInline, ProblemInline]
    fieldsets = (
        (None, {
            'fields': ('slug', 'order', 'is_active')
        }),
        ('Titles', {
            'fields': ('title', 'title_en', 'title_ru')
        }),
        ('Description', {
            'fields': ('description', 'description_en')
        }),
        ('UI', {
            'fields': ('color', 'icon', 'link', 'lessons_count')
        }),
    )


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ('title', 'sphere', 'order', 'color')
    list_filter = ('sphere',)
    search_fields = ('title', 'title_en')
    inlines = [TopicLessonInline]


@admin.register(TopicLesson)
class TopicLessonAdmin(admin.ModelAdmin):
    list_display = ('name', 'topic', 'order', 'video_url')
    list_filter = ('topic__sphere',)
    search_fields = ('name', 'name_en')
    inlines = [SubLessonInline]


@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    list_display = ('number', 'sphere', 'question_short', 'answer', 'difficulty')
    list_filter = ('sphere', 'difficulty')
    search_fields = ('question', 'answer')

    def question_short(self, obj):
        return obj.question[:80] + '...' if len(obj.question) > 80 else obj.question
    question_short.short_description = 'Question'


# ══════════════════════════════════════════════════════════════════════════════
#  LEGACY ADMIN
# ══════════════════════════════════════════════════════════════════════════════

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
