from datetime import date

from django.db.models import Count, Sum
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


class GamificationGrantView(APIView):
    """Endpoint for frontend minigames and quizzes to grant XP and fuel to the user.
    Also supports spending fuel (negative values) for the rewards store."""
    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Not authenticated'}, status=401)
        
        xp = int(request.data.get('xp', 0))
        fuel = int(request.data.get('fuel', 0))
        
        profile, _ = UserGamificationProfile.objects.get_or_create(user=request.user)
        
        if xp > 0:
            profile.add_xp(xp)
        if fuel > 0:
            profile.add_fuel(fuel)
        elif fuel < 0:
            # Spending fuel (e.g. rewards store purchase)
            cost = abs(fuel)
            if profile.fuel < cost:
                return Response(
                    {'detail': f'Not enough coins. Need {cost}, have {profile.fuel}.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            profile.spend_fuel(cost)
            
        return Response({
            'xp': profile.xp,
            'level': profile.level,
            'fuel': profile.fuel,
        })


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
    def post(self, request):
        profile, _ = UserGamificationProfile.objects.get_or_create(user=request.user)
        today = date.today()

        if profile.last_play_date == today:
            return Response({'streak': profile.streak, 'updated': False})

        if profile.last_play_date and (today - profile.last_play_date).days == 1:
            profile.streak += 1
        else:
            profile.streak = 1

        profile.last_play_date = today
        profile.save(update_fields=['streak', 'last_play_date'])
        profile.add_fuel(10)

        return Response({'streak': profile.streak, 'updated': True, 'fuel_bonus': 10})


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
        leaders = (
            qs.values('user__username')
            .annotate(
                best_pct=Sum('percentage') / Count('id'),
                total_quizzes=Count('id'),
                total_xp=Sum('xp_earned'),
            )
            .order_by('-best_pct')[:50]
        )

        return Response({
            'category': category or 'all',
            'leaderboard': [
                {
                    'username': entry['user__username'],
                    'avg_percentage': round(entry['best_pct'], 1),
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
        if profile.fuel < product.cost:
            return Response(
                {'detail': f'Not enough coins. Need {product.cost}, have {profile.fuel}.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            profile.spend_fuel(product.cost)
            purchase = UserRewardPurchase.objects.create(user=request.user, product=product)

        return Response({
            'purchase': UserRewardPurchaseSerializer(purchase).data,
            'fuel': profile.fuel,
        }, status=status.HTTP_201_CREATED)
