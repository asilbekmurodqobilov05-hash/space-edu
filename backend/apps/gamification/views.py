
from django.db.models import Avg, Count, Max, Sum
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .full_profile import FullProfileView
from django.db import transaction
from rest_framework.permissions import IsAuthenticated

from .models import Badge, UserBadge, UserGamificationProfile, RewardProduct, UserRewardPurchase
from .serializers import (
    BadgeSerializer,
    GamificationProfileSerializer,
    LeaderboardEntrySerializer,
    RewardProductSerializer,
    UserBadgeSerializer,
    UserRewardPurchaseSerializer,
)


class GamificationProfileView(generics.RetrieveAPIView):
    serializer_class = GamificationProfileSerializer

    def get_object(self):
        profile, _ = UserGamificationProfile.objects.get_or_create(user=self.request.user)
        return profile


class LeaderboardView(generics.ListAPIView):
    """XP-based global leaderboard."""
    serializer_class = LeaderboardEntrySerializer
    permission_classes = [AllowAny]
    pagination_class = None

    def get_queryset(self):
        return (
            UserGamificationProfile.objects
            .select_related('user')
            .order_by('-xp')[:100]
        )

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)

        # Include user's own rank if authenticated
        if request.user.is_authenticated:
            try:
                profile = request.user.gamification
                rank = UserGamificationProfile.objects.filter(xp__gt=profile.xp).count() + 1
                response.data = {
                    'leaderboard': response.data,
                    'my_rank': rank,
                    'my_xp': profile.xp,
                    'my_level': profile.level,
                    'total_players': UserGamificationProfile.objects.count(),
                }
            except Exception:
                response.data = {
                    'leaderboard': response.data,
                    'total_players': UserGamificationProfile.objects.count(),
                }
        else:
            response.data = {
                'leaderboard': response.data,
                'total_players': UserGamificationProfile.objects.count(),
            }

        return response


#
# REMOVED: GamificationGrantView (POST /gamification/grant/).
#
# It accepted arbitrary `xp` and `fuel` from the client with no check that the
# user had done anything to earn them — one request produced level 101 and
# enough currency to buy out the store. There is no safe way to validate this
# endpoint, because the client is not a trustworthy source for "how much did
# this person earn"; the whole shape is wrong.
#
# Rewards are now issued only by the server, at the point where it can see the
# work: LessonCompleteView, QuizSubmitView, SubmitChallengeView, StreakUpdateView
# and MissionClaimView. A client reports *what happened* ("finished lesson X",
# "answered question Y with Z") and the server decides what it is worth.
#


class UserBadgesView(generics.ListAPIView):
    serializer_class = UserBadgeSerializer
    pagination_class = None

    def get_queryset(self):
        return UserBadge.objects.filter(user=self.request.user).select_related('badge')


class AllBadgesView(generics.ListAPIView):
    """Endpoint to return ALL available badges"""
    serializer_class = BadgeSerializer
    pagination_class = None
    queryset = Badge.objects.all()


class StreakUpdateView(APIView):
    """POST /gamification/streak/ — claim today's streak and its bonus.

    The decision and the write happen inside one row lock; see
    `UserGamificationProfile.claim_daily_streak`.
    """

    def post(self, request):
        profile, _ = UserGamificationProfile.objects.get_or_create(user=request.user)
        streak, fuel_bonus = profile.claim_daily_streak()
        return Response({
            'streak': streak,
            'updated': bool(fuel_bonus),
            'fuel_bonus': fuel_bonus,
        })


class QuizLeaderboardView(APIView):
    """Leaderboard by quiz performance in a specific category."""
    permission_classes = [AllowAny]

    def get(self, request):
        from apps.challenges.models import QuizSession

        category = request.query_params.get('category')

        qs = QuizSession.objects.filter(is_completed=True, user__isnull=False)
        if category:
            qs = qs.filter(category=category)

        # Best score per user
        # Was Sum('percentage') / Count('id') labelled `best_pct`: that is a mean,
        # not a best, and on PostgreSQL integer division truncated it. Also stop
        # publishing usernames here — see LeaderboardEntrySerializer.
        leaders = (
            qs.values('user__id', 'user__username', 'user__astronaut_name')
            .annotate(
                avg_pct=Avg('percentage'),
                best_pct=Max('percentage'),
                total_quizzes=Count('id'),
                total_xp=Sum('xp_earned'),
            )
            .order_by('-avg_pct')[:50]
        )

        return Response({
            'category': category or 'all',
            'leaderboard': [
                {
                    'display_name': (entry['user__astronaut_name'] or '').strip()
                    or entry['user__username'],
                    'avg_percentage': round(entry['avg_pct'] or 0, 1),
                    'best_percentage': round(entry['best_pct'] or 0, 1),
                    'total_quizzes': entry['total_quizzes'],
                    'total_xp': entry['total_xp'] or 0,
                }
                for entry in leaders
            ],
        })


# ──────────────────────────────────────────────────────────────────────────────
#  REWARDS STORE
# ──────────────────────────────────────────────────────────────────────────────
class RewardProductListView(generics.ListAPIView):
    """Public: list all active reward products."""
    serializer_class = RewardProductSerializer
    permission_classes = [AllowAny]
    pagination_class = None

    def get_queryset(self):
        qs = RewardProduct.objects.filter(is_active=True)
        category = self.request.query_params.get('category')
        if category and category != 'all':
            qs = qs.filter(category=category)
        return qs


class UserRewardPurchaseListView(generics.ListAPIView):
    """List rewards purchased by the current user."""
    serializer_class = UserRewardPurchaseSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return UserRewardPurchase.objects.filter(user=self.request.user).select_related('product')


class RewardPurchaseView(APIView):
    """Purchase a reward product — deducts fuel from gamification profile."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        slug = request.data.get('slug')
        if not slug:
            return Response({'detail': 'Product slug is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = RewardProduct.objects.get(slug=slug, is_active=True)
        except RewardProduct.DoesNotExist:
            return Response({'detail': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

        if UserRewardPurchase.objects.filter(user=request.user, product=product).exists():
            return Response({'detail': 'You already own this reward.'}, status=status.HTTP_400_BAD_REQUEST)

        profile, _ = UserGamificationProfile.objects.get_or_create(user=request.user)

        # spend_fuel() re-reads the balance under a row lock and returns False if
        # it is short. Checking first and debiting afterwards let two concurrent
        # purchases of different products both pass on the same balance.
        with transaction.atomic():
            if not profile.spend_fuel(product.cost):
                return Response(
                    {'detail': f'Not enough coins. Need {product.cost}, have {profile.fuel}.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            purchase = UserRewardPurchase.objects.create(user=request.user, product=product)

        return Response({
            'purchase': UserRewardPurchaseSerializer(purchase).data,
            'fuel': profile.fuel,
        }, status=status.HTTP_201_CREATED)


def mission_progress(user, mission):
    """How far this user has actually got on this mission.

    The claim endpoint used to pay out without consulting this at all, so a
    mission reading "Complete 5 lessons" handed over its reward to somebody who
    had completed none.
    """
    from apps.market.models import UserInventory
    from apps.progress.models import UserLessonProgress

    if mission.mission_type == 'streak':
        profile, _ = UserGamificationProfile.objects.get_or_create(user=user)
        return profile.streak
    if mission.mission_type == 'lesson':
        return UserLessonProgress.objects.filter(user=user).count()
    if mission.mission_type == 'mastery':
        return UserLessonProgress.objects.filter(user=user, is_mastered=True).count()
    if mission.mission_type == 'inventory':
        return UserInventory.objects.filter(user=user).count()
    # 'custom' has no machine-checkable definition, so it cannot be self-claimed.
    return None


class MissionClaimView(APIView):
    """Claim a mission reward, once the mission has actually been completed."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        from django.utils import timezone

        from .models import Mission, UserMission

        mission_id = request.data.get('mission_id')
        if not mission_id:
            return Response({'detail': 'mission_id is required.'}, status=400)

        try:
            mission = Mission.objects.get(id=int(mission_id), is_active=True)
        except (Mission.DoesNotExist, TypeError, ValueError):
            return Response({'detail': 'Mission not found.'}, status=404)

        progress = mission_progress(request.user, mission)
        if progress is None:
            return Response(
                {'detail': 'This mission is awarded by a mentor, not self-claimed.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if progress < mission.target_value:
            return Response(
                {
                    'detail': 'Mission not completed yet.',
                    'progress': progress,
                    'target': mission.target_value,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        today = timezone.localdate()
        with transaction.atomic():
            user_mission, _ = UserMission.objects.select_for_update().get_or_create(
                user=request.user, mission=mission
            )
            if mission.is_daily:
                if user_mission.last_claimed_date == today:
                    return Response({'detail': 'Already claimed today.'}, status=400)
                user_mission.last_claimed_date = today
                user_mission.is_completed = True
            else:
                if user_mission.is_completed:
                    return Response({'detail': 'Already claimed.'}, status=400)
                user_mission.is_completed = True
            user_mission.save()

        profile, _ = UserGamificationProfile.objects.get_or_create(user=request.user)
        profile.add_xp(mission.reward_xp)
        profile.add_fuel(mission.reward_fuel)

        return Response({
            'success': True,
            'xp_earned': mission.reward_xp,
            'fuel_earned': mission.reward_fuel,
            'current_xp': profile.xp,
            'current_fuel': profile.fuel,
        })
