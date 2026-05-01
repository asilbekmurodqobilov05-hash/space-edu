from django.db.models import Avg, Max, Sum, Count
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.permissions import AdminWriteOrReadOnly

from .models import ChallengeQuestion, DailyChallenge, UserChallengeResult, UserStreak, QuizSession, QuizAnswer
from .serializers import (
    ChallengeQuestionFullSerializer,
    ChallengeQuestionSerializer,
    DailyChallengeSerializer,
    SubmitAnswersSerializer,
    UserChallengeResultSerializer,
    UserStreakSerializer,
    LeaderboardEntrySerializer,
    QuizStartSerializer,
    QuizSubmitAllSerializer,
    QuizSessionSerializer,
    QuizSessionListSerializer,
    QuizCategoryStatsSerializer,
)


# ══════════════════════════════════════════════════════════════════════════════
#  QUESTION POOL  (admin CRUD)
# ══════════════════════════════════════════════════════════════════════════════
class ChallengeQuestionViewSet(viewsets.ModelViewSet):
    queryset = ChallengeQuestion.objects.filter(is_active=True)
    serializer_class = ChallengeQuestionFullSerializer
    permission_classes = [AdminWriteOrReadOnly]

    def get_queryset(self):
        qs = ChallengeQuestion.objects.all()
        cat = self.request.query_params.get('category')
        if cat:
            qs = qs.filter(category=cat)
        diff = self.request.query_params.get('difficulty')
        if diff:
            qs = qs.filter(difficulty=diff)
        return qs


# ══════════════════════════════════════════════════════════════════════════════
#  DAILY CHALLENGE
# ══════════════════════════════════════════════════════════════════════════════
class TodayChallengeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        challenge = DailyChallenge.get_or_create_today()
        data = DailyChallengeSerializer(challenge).data

        if request.user.is_authenticated:
            completed = UserChallengeResult.objects.filter(
                user=request.user, challenge=challenge
            ).first()
            data['already_completed'] = completed is not None
            if completed:
                data['result'] = UserChallengeResultSerializer(completed).data

            streak, _ = UserStreak.objects.get_or_create(user=request.user)
            data['streak'] = UserStreakSerializer(streak).data

        return Response(data)


class SubmitChallengeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        challenge = DailyChallenge.get_or_create_today()

        if UserChallengeResult.objects.filter(user=request.user, challenge=challenge).exists():
            return Response(
                {'detail': 'You already completed today\'s challenge.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = SubmitAnswersSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        answers = serializer.validated_data['answers']
        time_taken = serializer.validated_data.get('time_taken', 0)

        score = 0
        question_ids = list(challenge.questions.values_list('id', flat=True))
        for ans in answers:
            qid = ans.get('question_id')
            selected = ans.get('selected')
            if qid in question_ids:
                try:
                    q = ChallengeQuestion.objects.get(id=qid)
                    if q.correct_answer == selected:
                        score += 1
                except ChallengeQuestion.DoesNotExist:
                    pass

        total = challenge.questions.count()
        xp_earned = score * challenge.xp_per_correct + challenge.xp_completion_bonus
        fuel_earned = challenge.fuel_reward

        result = UserChallengeResult.objects.create(
            user=request.user, challenge=challenge,
            score=score, total=total,
            xp_earned=xp_earned, fuel_earned=fuel_earned, time_taken=time_taken,
        )

        streak, _ = UserStreak.objects.get_or_create(user=request.user)
        streak.update_streak()

        try:
            profile = request.user.gamification
            profile.xp += xp_earned
            profile.fuel += fuel_earned
            profile.save(update_fields=['xp', 'fuel'])
        except Exception:
            pass

        return Response({
            'result': UserChallengeResultSerializer(result).data,
            'streak': UserStreakSerializer(streak).data,
            'correct_answers': {
                q.id: q.correct_answer
                for q in challenge.questions.all()
            },
        }, status=status.HTTP_201_CREATED)


class MyChallengeHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        results = UserChallengeResult.objects.filter(user=request.user).select_related('challenge')[:30]
        streak, _ = UserStreak.objects.get_or_create(user=request.user)

        total_xp = results.aggregate(total=Sum('xp_earned'))['total'] or 0

        return Response({
            'streak': UserStreakSerializer(streak).data,
            'total_challenges': results.count(),
            'total_xp_earned': total_xp,
            'history': UserChallengeResultSerializer(results, many=True).data,
        })


class DailyLeaderboardView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        challenge = DailyChallenge.get_or_create_today()
        results = (
            UserChallengeResult.objects
            .filter(challenge=challenge)
            .select_related('user')
            .order_by('-score', 'time_taken')[:20]
        )

        entries = [
            {'username': r.user.username, 'score': r.score, 'time_taken': r.time_taken}
            for r in results
        ]

        return Response({
            'date': challenge.date,
            'leaderboard': LeaderboardEntrySerializer(entries, many=True).data,
        })


# ══════════════════════════════════════════════════════════════════════════════
#  QUIZ / TEST  —  Full quiz flow
# ══════════════════════════════════════════════════════════════════════════════

class QuizStartView(APIView):
    """Start a new quiz session. Returns questions WITHOUT correct answers."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = QuizStartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        category = serializer.validated_data['category']
        count = serializer.validated_data.get('count', 30)

        # Get questions for this category
        pool = list(ChallengeQuestion.objects.filter(
            category=category, is_active=True
        ))

        if not pool:
            return Response({'detail': f'No questions found for category: {category}'},
                            status=status.HTTP_404_NOT_FOUND)

        import random
        selected = random.sample(pool, min(count, len(pool)))

        # Create session
        session = QuizSession.objects.create(
            user=request.user if request.user.is_authenticated else None,
            category=category,
            total=len(selected),
        )
        session.questions.set(selected)

        # Return questions without correct answers
        questions_data = ChallengeQuestionSerializer(selected, many=True).data

        return Response({
            'session_id': session.id,
            'category': category,
            'total': len(selected),
            'questions': questions_data,
        }, status=status.HTTP_201_CREATED)


class QuizSubmitView(APIView):
    """Submit all answers for a quiz session. Returns graded results."""
    permission_classes = [AllowAny]

    def post(self, request, session_id):
        try:
            session = QuizSession.objects.get(id=session_id)
        except QuizSession.DoesNotExist:
            return Response({'detail': 'Session not found.'}, status=status.HTTP_404_NOT_FOUND)

        if session.is_completed:
            return Response({'detail': 'This quiz was already submitted.'},
                            status=status.HTTP_400_BAD_REQUEST)

        serializer = QuizSubmitAllSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        answers_data = serializer.validated_data['answers']
        time_taken = serializer.validated_data.get('time_taken', 0)

        # Build question lookup
        question_ids = set(session.questions.values_list('id', flat=True))
        questions_map = {q.id: q for q in session.questions.all()}

        score = 0
        quiz_answers = []
        for ans in answers_data:
            qid = ans.get('question_id')
            selected = ans.get('selected', -1)
            time_spent = ans.get('time_spent', 0)

            if qid not in question_ids:
                continue

            q = questions_map[qid]
            is_correct = (q.correct_answer == selected)
            if is_correct:
                score += 1

            quiz_answers.append(QuizAnswer(
                session=session, question=q,
                selected_answer=selected, is_correct=is_correct,
                time_spent=time_spent,
            ))

        QuizAnswer.objects.bulk_create(quiz_answers)

        # Update session
        percentage = round((score / session.total) * 100, 1) if session.total > 0 else 0
        xp_earned = score * 20 + 50  # 20 XP per correct + 50 completion bonus

        session.score = score
        session.percentage = percentage
        session.time_taken = time_taken
        session.xp_earned = xp_earned
        session.is_completed = True
        session.completed_at = timezone.now()
        session.save()

        # Award XP if authenticated
        if request.user.is_authenticated:
            try:
                profile = request.user.gamification
                profile.xp += xp_earned
                profile.save(update_fields=['xp'])
            except Exception:
                pass

        return Response(QuizSessionSerializer(session).data, status=status.HTTP_200_OK)


class QuizResultView(APIView):
    """Get results for a completed quiz session."""
    permission_classes = [AllowAny]

    def get(self, request, session_id):
        try:
            session = QuizSession.objects.prefetch_related('answers__question').get(id=session_id)
        except QuizSession.DoesNotExist:
            return Response({'detail': 'Session not found.'}, status=status.HTTP_404_NOT_FOUND)

        return Response(QuizSessionSerializer(session).data)


class QuizHistoryView(APIView):
    """Get quiz history for authenticated user."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        category = request.query_params.get('category')
        qs = QuizSession.objects.filter(user=request.user, is_completed=True)
        if category:
            qs = qs.filter(category=category)

        sessions = qs[:30]
        return Response({
            'total_quizzes': qs.count(),
            'total_xp': qs.aggregate(total=Sum('xp_earned'))['total'] or 0,
            'history': QuizSessionListSerializer(sessions, many=True).data,
        })


class QuizCategoryStatsView(APIView):
    """Get per-category quiz stats for the user."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stats = []
        for cat_code, cat_name in QuizSession.QUIZ_CATEGORIES:
            total_questions = ChallengeQuestion.objects.filter(
                category=cat_code, is_active=True
            ).count()

            user_sessions = QuizSession.objects.filter(
                user=request.user, category=cat_code, is_completed=True
            )

            agg = user_sessions.aggregate(
                best_score=Max('score'),
                best_pct=Max('percentage'),
                avg_pct=Avg('percentage'),
                count=Count('id'),
            )

            stats.append({
                'category': cat_code,
                'total_questions': total_questions,
                'total_attempts': agg['count'] or 0,
                'best_score': agg['best_score'] or 0,
                'best_percentage': round(agg['best_pct'] or 0, 1),
                'avg_percentage': round(agg['avg_pct'] or 0, 1),
            })

        return Response(stats)


class QuizQuestionsPublicView(APIView):
    """Get all questions for a category (without correct answers) — for frontend compatibility."""
    permission_classes = [AllowAny]

    def get(self, request, category):
        valid_cats = [c[0] for c in ChallengeQuestion.CATEGORIES if c[0] != 'general']
        if category not in valid_cats:
            return Response({'detail': f'Invalid category. Choose from: {valid_cats}'},
                            status=status.HTTP_400_BAD_REQUEST)

        questions = ChallengeQuestion.objects.filter(
            category=category, is_active=True
        )

        return Response({
            'category': category,
            'count': questions.count(),
            'questions': ChallengeQuestionSerializer(questions, many=True).data,
        })
