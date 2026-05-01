"""
Unified user profile view — aggregates ALL user data across the platform.
GET /api/v1/gamification/profile/full/
"""
from django.db.models import Avg, Count, Max, Sum
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.serializers import UserSerializer
from apps.challenges.models import (
    ChallengeQuestion, DailyChallenge, QuizSession,
    UserChallengeResult, UserStreak,
)
from apps.gamification.models import UserBadge, UserGamificationProfile
from apps.gamification.serializers import BadgeSerializer, GamificationProfileSerializer
from apps.market.models import UserInventory, Wishlist
from apps.market.serializers import MarketItemSerializer


class FullProfileView(APIView):
    """
    Single endpoint returning the complete user profile:
    - user info
    - gamification (XP, level, fuel, streak)
    - badges earned
    - quiz stats per category
    - daily challenge stats + streak
    - market inventory + wishlist
    - leaderboard rank
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # ── 1. User info ──
        user_data = UserSerializer(user, context={'request': request}).data

        # ── 2. Gamification profile ──
        try:
            gam_profile = user.gamification
        except UserGamificationProfile.DoesNotExist:
            gam_profile = UserGamificationProfile.objects.create(user=user)
        gamification_data = GamificationProfileSerializer(gam_profile).data

        # ── 3. Leaderboard rank ──
        rank = (
            UserGamificationProfile.objects
            .filter(xp__gt=gam_profile.xp)
            .count() + 1
        )
        total_players = UserGamificationProfile.objects.count()

        # ── 4. Badges ──
        badges = UserBadge.objects.filter(user=user).select_related('badge')
        badges_data = [
            {
                **BadgeSerializer(ub.badge).data,
                'earned_at': ub.earned_at,
            }
            for ub in badges
        ]

        # ── 5. Daily Challenge stats ──
        challenge_results = UserChallengeResult.objects.filter(user=user)
        challenge_agg = challenge_results.aggregate(
            total_completed=Count('id'),
            total_xp=Sum('xp_earned'),
            total_fuel=Sum('fuel_earned'),
            best_score=Max('score'),
            avg_score=Avg('score'),
        )

        streak_obj, _ = UserStreak.objects.get_or_create(user=user)
        daily_challenge_data = {
            'total_completed': challenge_agg['total_completed'] or 0,
            'total_xp_earned': challenge_agg['total_xp'] or 0,
            'total_fuel_earned': challenge_agg['total_fuel'] or 0,
            'best_score': challenge_agg['best_score'] or 0,
            'avg_score': round(challenge_agg['avg_score'] or 0, 1),
            'current_streak': streak_obj.current_streak,
            'longest_streak': streak_obj.longest_streak,
            'last_completed': streak_obj.last_completed,
        }

        # ── 6. Quiz stats per category ──
        quiz_stats = []
        for cat_code, cat_name in QuizSession.QUIZ_CATEGORIES:
            sessions = QuizSession.objects.filter(
                user=user, category=cat_code, is_completed=True
            )
            agg = sessions.aggregate(
                count=Count('id'),
                best_score=Max('score'),
                best_pct=Max('percentage'),
                avg_pct=Avg('percentage'),
                total_xp=Sum('xp_earned'),
            )
            total_q = ChallengeQuestion.objects.filter(
                category=cat_code, is_active=True
            ).count()

            quiz_stats.append({
                'category': cat_code,
                'category_name': cat_name,
                'total_questions_available': total_q,
                'total_attempts': agg['count'] or 0,
                'best_score': agg['best_score'] or 0,
                'best_percentage': round(agg['best_pct'] or 0, 1),
                'avg_percentage': round(agg['avg_pct'] or 0, 1),
                'total_xp_earned': agg['total_xp'] or 0,
            })

        # Overall quiz summary
        all_quizzes = QuizSession.objects.filter(user=user, is_completed=True)
        quiz_overall = all_quizzes.aggregate(
            total=Count('id'),
            total_xp=Sum('xp_earned'),
            best_pct=Max('percentage'),
        )

        # ── 7. Market inventory ──
        inventory = UserInventory.objects.filter(user=user).select_related('item')
        inventory_data = [
            {
                'item': MarketItemSerializer(inv.item, context={'request': request}).data,
                'purchased_at': inv.purchased_at,
            }
            for inv in inventory
        ]

        # ── 8. Wishlist ──
        wishlist = Wishlist.objects.filter(user=user).select_related('item')
        wishlist_data = [
            {
                'item': MarketItemSerializer(wl.item, context={'request': request}).data,
                'added_at': wl.added_at,
            }
            for wl in wishlist
        ]

        # ── 9. Recent quiz history (last 10) ──
        recent_quizzes = QuizSession.objects.filter(
            user=user, is_completed=True
        ).order_by('-completed_at')[:10]
        recent_quiz_data = [
            {
                'id': qs.id,
                'category': qs.category,
                'score': qs.score,
                'total': qs.total,
                'percentage': qs.percentage,
                'xp_earned': qs.xp_earned,
                'time_taken': qs.time_taken,
                'completed_at': qs.completed_at,
            }
            for qs in recent_quizzes
        ]

        # ── 10. Recent daily challenge history (last 10) ──
        recent_challenges = UserChallengeResult.objects.filter(
            user=user
        ).select_related('challenge').order_by('-completed_at')[:10]
        recent_challenge_data = [
            {
                'date': cr.challenge.date,
                'score': cr.score,
                'total': cr.total,
                'xp_earned': cr.xp_earned,
                'fuel_earned': cr.fuel_earned,
                'time_taken': cr.time_taken,
                'completed_at': cr.completed_at,
            }
            for cr in recent_challenges
        ]

        # ── ASSEMBLE ──
        return Response({
            'user': user_data,
            'gamification': gamification_data,
            'leaderboard': {
                'rank': rank,
                'total_players': total_players,
            },
            'badges': badges_data,
            'daily_challenges': daily_challenge_data,
            'quiz': {
                'total_quizzes': quiz_overall['total'] or 0,
                'total_xp_earned': quiz_overall['total_xp'] or 0,
                'best_percentage': round(quiz_overall['best_pct'] or 0, 1),
                'categories': quiz_stats,
                'recent': recent_quiz_data,
            },
            'daily_challenge_history': recent_challenge_data,
            'market': {
                'inventory_count': inventory.count(),
                'wishlist_count': wishlist.count(),
                'inventory': inventory_data,
                'wishlist': wishlist_data,
            },
        })
