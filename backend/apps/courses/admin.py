from django.contrib import admin

from .models import Problem, Sphere, Topic, TopicLesson

class TopicInline(admin.TabularInline):
    model = Topic
    extra = 0
    fields = ('order', 'title', 'title_en', 'color')
    show_change_link = True


class TopicLessonInline(admin.TabularInline):
    model = TopicLesson
    fk_name = 'topic'
    extra = 0
    fields = ('order', 'slug', 'name', 'name_en', 'parent', 'video_url')
    show_change_link = True


class ChildLessonInline(admin.TabularInline):
    """Sub-lessons are the same model now — see ADR 0001."""

    model = TopicLesson
    fk_name = 'parent'
    verbose_name_plural = 'Sub-lessons'
    extra = 0
    fields = ('order', 'slug', 'name', 'name_en', 'video_url')


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
    list_display = ('title', 'slug', 'sphere', 'order', 'color', 'fuel_reward')
    list_filter = ('sphere',)
    prepopulated_fields = {'slug': ('title_en',)}
    search_fields = ('title', 'title_en', 'slug')
    inlines = [TopicLessonInline]


@admin.register(TopicLesson)
class TopicLessonAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'topic', 'parent', 'order', 'xp_reward')
    list_filter = ('topic__sphere',)
    prepopulated_fields = {'slug': ('name_en',)}
    search_fields = ('name', 'name_en', 'slug')
    inlines = [ChildLessonInline]


@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    list_display = ('number', 'sphere', 'question_short', 'answer', 'difficulty')
    list_filter = ('sphere', 'difficulty')
    search_fields = ('question', 'answer')

    def question_short(self, obj):
        return obj.question[:80] + '...' if len(obj.question) > 80 else obj.question
    question_short.short_description = 'Question'
