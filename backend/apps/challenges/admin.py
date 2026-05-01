from django.contrib import admin
from .models import (
    ChallengeQuestion, DailyChallenge, UserChallengeResult, UserStreak,
    QuizSession, QuizAnswer,
)


@admin.register(ChallengeQuestion)
class ChallengeQuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'category', 'difficulty', 'question_short', 'correct_answer', 'time_seconds', 'is_active')
    list_filter = ('category', 'difficulty', 'is_active')
    list_editable = ('is_active', 'time_seconds')
    search_fields = ('question', 'question_en')

    def question_short(self, obj):
        return obj.question[:80] + '...' if len(obj.question) > 80 else obj.question
    question_short.short_description = 'Question'


class ResultInline(admin.TabularInline):
    model = UserChallengeResult
    extra = 0
    fields = ('user', 'score', 'total', 'xp_earned', 'time_taken', 'completed_at')
    readonly_fields = ('completed_at',)


@admin.register(DailyChallenge)
class DailyChallengeAdmin(admin.ModelAdmin):
    list_display = ('date', 'question_count', 'time_limit', 'xp_per_correct', 'xp_completion_bonus', 'is_active')
    list_filter = ('is_active',)
    filter_horizontal = ('questions',)
    inlines = [ResultInline]


@admin.register(UserChallengeResult)
class UserChallengeResultAdmin(admin.ModelAdmin):
    list_display = ('user', 'challenge', 'score', 'total', 'xp_earned', 'time_taken', 'completed_at')
    list_filter = ('challenge__date',)
    search_fields = ('user__username',)


@admin.register(UserStreak)
class UserStreakAdmin(admin.ModelAdmin):
    list_display = ('user', 'current_streak', 'longest_streak', 'last_completed')
    search_fields = ('user__username',)


# ── Quiz / Test ──
class QuizAnswerInline(admin.TabularInline):
    model = QuizAnswer
    extra = 0
    fields = ('question', 'selected_answer', 'is_correct', 'time_spent')
    readonly_fields = ('is_correct',)


@admin.register(QuizSession)
class QuizSessionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'category', 'score', 'total', 'percentage', 'xp_earned', 'is_completed', 'started_at')
    list_filter = ('category', 'is_completed')
    search_fields = ('user__username',)
    inlines = [QuizAnswerInline]


@admin.register(QuizAnswer)
class QuizAnswerAdmin(admin.ModelAdmin):
    list_display = ('session', 'question', 'selected_answer', 'is_correct', 'time_spent')
    list_filter = ('is_correct',)
