from rest_framework import serializers
from .models import (
    ChallengeQuestion, DailyChallenge, UserChallengeResult, UserStreak,
    QuizSession, QuizAnswer,
)


# ── Question (public — hides correct_answer) ──
class ChallengeQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChallengeQuestion
        fields = ('id', 'category', 'difficulty', 'question', 'question_en', 'question_ru',
                  'options', 'time_seconds')


# ── Question (admin — includes correct answer) ──
class ChallengeQuestionFullSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChallengeQuestion
        fields = ('id', 'category', 'difficulty', 'question', 'question_en', 'question_ru',
                  'options', 'correct_answer', 'explanation', 'time_seconds', 'is_active')


# ── Daily Challenge ──
class DailyChallengeSerializer(serializers.ModelSerializer):
    questions = ChallengeQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = DailyChallenge
        fields = ('id', 'date', 'question_count', 'time_limit',
                  'xp_per_correct', 'xp_completion_bonus', 'fuel_reward',
                  'questions')


class SubmitAnswersSerializer(serializers.Serializer):
    answers = serializers.ListField(
        child=serializers.DictField(), min_length=1,
        help_text='List of {question_id: int, selected: int}'
    )
    time_taken = serializers.IntegerField(min_value=0, default=0)


class UserChallengeResultSerializer(serializers.ModelSerializer):
    date = serializers.DateField(source='challenge.date', read_only=True)

    class Meta:
        model = UserChallengeResult
        fields = ('id', 'date', 'score', 'total', 'xp_earned', 'fuel_earned', 'time_taken', 'completed_at')


class UserStreakSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStreak
        fields = ('current_streak', 'longest_streak', 'last_completed')


class LeaderboardEntrySerializer(serializers.Serializer):
    username = serializers.CharField()
    score = serializers.IntegerField()
    time_taken = serializers.IntegerField()


# ══════════════════════════════════════════════════════════════════════════════
#  QUIZ / TEST SERIALIZERS
# ══════════════════════════════════════════════════════════════════════════════

class QuizStartSerializer(serializers.Serializer):
    """Input for starting a quiz."""
    category = serializers.ChoiceField(choices=['physics', 'astronomy', 'problems', 'courses'])
    count = serializers.IntegerField(min_value=5, max_value=50, default=30,
                                     help_text='Number of questions to include')


class QuizSubmitAnswerSerializer(serializers.Serializer):
    """Input for submitting a single answer during quiz."""
    question_id = serializers.IntegerField()
    selected = serializers.IntegerField(min_value=-1, max_value=3)
    time_spent = serializers.IntegerField(min_value=0, default=0)


class QuizSubmitAllSerializer(serializers.Serializer):
    """Input for submitting all answers at once."""
    answers = serializers.ListField(
        child=serializers.DictField(), min_length=1,
        help_text='List of {question_id, selected, time_spent}'
    )
    time_taken = serializers.IntegerField(min_value=0, default=0)


class QuizAnswerSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question.question', read_only=True)
    correct_answer = serializers.IntegerField(source='question.correct_answer', read_only=True)
    options = serializers.JSONField(source='question.options', read_only=True)
    explanation = serializers.CharField(source='question.explanation', read_only=True)

    class Meta:
        model = QuizAnswer
        fields = ('question', 'question_text', 'options', 'selected_answer',
                  'correct_answer', 'is_correct', 'time_spent', 'explanation')


class QuizSessionSerializer(serializers.ModelSerializer):
    answers = QuizAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = QuizSession
        fields = ('id', 'category', 'score', 'total', 'percentage',
                  'time_taken', 'xp_earned', 'is_completed',
                  'started_at', 'completed_at', 'answers')


class QuizSessionListSerializer(serializers.ModelSerializer):
    """Lightweight version for history listing."""
    class Meta:
        model = QuizSession
        fields = ('id', 'category', 'score', 'total', 'percentage',
                  'time_taken', 'xp_earned', 'started_at', 'is_completed')


class QuizCategoryStatsSerializer(serializers.Serializer):
    category = serializers.CharField()
    total_questions = serializers.IntegerField()
    total_attempts = serializers.IntegerField()
    best_score = serializers.IntegerField()
    best_percentage = serializers.FloatField()
    avg_percentage = serializers.FloatField()
