from django.db.models import Avg, Max, Sum, Count
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.courses.models import TopicLesson
from apps.gamification.models import UserGamificationProfile
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
    """Question pool.

    AdminWriteOrReadOnly means anyone may read, so the serializer has to be
    chosen by role. It used to be pinned to ChallengeQuestionFullSerializer,
    which carries `correct_answer` — an anonymous GET returned the entire answer
    key and made QuizStartView's careful answer-stripping pointless.
    """

    queryset = ChallengeQuestion.objects.filter(is_active=True)
    permission_classes = [AdminWriteOrReadOnly]

    def get_serializer_class(self):
        user = self.request.user
        if user.is_authenticated and user.is_staff:
            return ChallengeQuestionFullSerializer
        return ChallengeQuestionSerializer

    def get_queryset(self):
        qs = ChallengeQuestion.objects.all()
        user = self.request.user
        if not (user.is_authenticated and user.is_staff):
            qs = qs.filter(is_active=True)
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

        # One answer per question, and one query for the whole set. The old loop
        # counted every duplicate, so repeating a correct question_id inflated
        # the score without limit, and it issued a separate .get() per element.
        questions = {q.id: q for q in challenge.questions.all()}
        seen = set()
        score = 0
        for ans in answers:
            qid = ans['question_id']
            if qid in seen or qid not in questions:
                continue
            seen.add(qid)
            if questions[qid].correct_answer == ans['selected']:
                score += 1

        total = len(questions)
        xp_earned = score * challenge.xp_per_correct + challenge.xp_completion_bonus
        fuel_earned = challenge.fuel_reward

        result = UserChallengeResult.objects.create(
            user=request.user, challenge=challenge,
            score=score, total=total,
            xp_earned=xp_earned, fuel_earned=fuel_earned, time_taken=time_taken,
        )

        streak, _ = UserStreak.objects.get_or_create(user=request.user)
        streak.update_streak()

        # add_xp/add_fuel take the row lock and recompute the level. Writing the
        # fields directly skipped the level recompute and the fuel cap, and the
        # bare `except Exception: pass` hid every failure.
        profile, _ = UserGamificationProfile.objects.get_or_create(user=request.user)
        profile.add_xp(xp_earned)
        profile.add_fuel(fuel_earned)

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
        # `total_challenges` used to be counted on the sliced queryset, so it
        # stopped rising at 30 no matter how many the student had done.
        all_results = UserChallengeResult.objects.filter(user=request.user)
        recent = all_results.select_related('challenge')[:30]
        streak, _ = UserStreak.objects.get_or_create(user=request.user)

        return Response({
            'streak': UserStreakSerializer(streak).data,
            'total_challenges': all_results.count(),
            'total_xp_earned': all_results.aggregate(total=Sum('xp_earned'))['total'] or 0,
            'history': UserChallengeResultSerializer(recent, many=True).data,
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
    """Start a new quiz session. Returns questions WITHOUT correct answers.

    Takes either a category (the whole pool for a subject) or a lesson slug
    (only the questions attached to that lesson — ADR 0001, step 5).
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = QuizStartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        category = serializer.validated_data.get('category')
        lesson_slug = serializer.validated_data.get('lesson')
        count = serializer.validated_data.get('count', 30)

        if lesson_slug:
            lesson = TopicLesson.objects.filter(slug=lesson_slug).first()
            if lesson is None:
                return Response({'detail': 'Lesson not found.'},
                                status=status.HTTP_404_NOT_FOUND)
            # A lesson quiz stays inside its own sphere for the category label,
            # so history and stats keep grouping the way they always did.
            category = category or lesson.topic.sphere.slug
            if category not in dict(QuizSession.QUIZ_CATEGORIES):
                category = 'courses'
            pool = list(ChallengeQuestion.objects.filter(lesson=lesson, is_active=True))
            if not pool:
                return Response({'detail': 'This lesson has no questions yet.'},
                                status=status.HTTP_404_NOT_FOUND)
        else:
            pool = list(ChallengeQuestion.objects.filter(category=category, is_active=True))
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

        if session.user_id is None:
            # Tie the anonymous session to this browser session so that only the
            # visitor who started it can submit or read it back.
            owned = request.session.get('quiz_sessions', [])
            owned.append(session.id)
            request.session['quiz_sessions'] = owned[-20:]

        # Return questions without correct answers
        questions_data = ChallengeQuestionSerializer(selected, many=True).data

        return Response({
            'session_id': session.id,
            'category': category,
            'total': len(selected),
            'questions': questions_data,
        }, status=status.HTTP_201_CREATED)


def _owned_session_or_none(request, session_id):
    """Fetch a quiz session the caller is allowed to touch.

    Session ids are sequential and both the submit and result endpoints were
    AllowAny with no ownership check, so anyone could walk the ids to read a
    classmate's answers or close their unfinished session for them.

    An anonymous session (user is NULL) stays reachable within the browser
    session that created it, tracked server-side rather than trusted from input.
    """
    session = QuizSession.objects.filter(id=session_id).first()
    if session is None:
        return None
    if session.user_id is not None:
        if not request.user.is_authenticated:
            return None
        if session.user_id != request.user.id and not request.user.is_staff:
            return None
        return session
    # Anonymous session: only the browser that started it may continue.
    return session if session.id in set(request.session.get('quiz_sessions', [])) else None


class QuizSubmitView(APIView):
    """Submit all answers for a quiz session. Returns graded results."""
    permission_classes = [AllowAny]

    def post(self, request, session_id):
        session = _owned_session_or_none(request, session_id)
        if session is None:
            return Response({'detail': 'Session not found.'}, status=status.HTTP_404_NOT_FOUND)

        if session.is_completed:
            return Response({'detail': 'This quiz was already submitted.'},
                            status=status.HTTP_400_BAD_REQUEST)

        serializer = QuizSubmitAllSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        answers_data = serializer.validated_data['answers']
        time_taken = serializer.validated_data.get('time_taken', 0)

        # One row and one point per question. Without the `seen` guard, repeating
        # a correct question_id pushed `score` past `total` — 50 copies of one
        # answer produced 50/5 and a percentage of 1000.
        questions_map = {q.id: q for q in session.questions.all()}
        seen = set()
        score = 0
        quiz_answers = []
        for ans in answers_data:
            qid = ans['question_id']
            if qid in seen or qid not in questions_map:
                continue
            seen.add(qid)

            q = questions_map[qid]
            is_correct = (q.correct_answer == ans['selected'])
            if is_correct:
                score += 1

            quiz_answers.append(QuizAnswer(
                session=session, question=q,
                selected_answer=ans['selected'], is_correct=is_correct,
                time_spent=ans['time_spent'],
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

        # add_xp recomputes the level; writing profile.xp directly did not, which
        # is why three perfect quizzes left a student on level 1 with 450 XP.
        if request.user.is_authenticated:
            from apps.gamification.models import UserGamificationProfile

            profile, _ = UserGamificationProfile.objects.get_or_create(user=request.user)
            profile.add_xp(xp_earned)

        return Response(QuizSessionSerializer(session).data, status=status.HTTP_200_OK)


class QuizResultView(APIView):
    """Get results for a completed quiz session."""
    permission_classes = [AllowAny]

    def get(self, request, session_id):
        session = _owned_session_or_none(request, session_id)
        if session is None:
            return Response({'detail': 'Session not found.'}, status=status.HTTP_404_NOT_FOUND)

        session = (
            QuizSession.objects
            .prefetch_related('answers__question')
            .get(id=session.id)
        )
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
