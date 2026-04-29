from datetime import date

from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import UserBadge, UserGamificationProfile
from .serializers import (
    GamificationProfileSerializer,
    LeaderboardEntrySerializer,
    UserBadgeSerializer,
)


class GamificationProfileView(generics.RetrieveAPIView):
    serializer_class = GamificationProfileSerializer

    def get_object(self):
        return self.request.user.gamification


class LeaderboardView(generics.ListAPIView):
    serializer_class = LeaderboardEntrySerializer
    permission_classes = [AllowAny]
    pagination_class = None

    def get_queryset(self):
        return (
            UserGamificationProfile.objects
            .select_related('user')
            .order_by('-xp')[:100]
        )


class UserBadgesView(generics.ListAPIView):
    serializer_class = UserBadgeSerializer
    pagination_class = None

    def get_queryset(self):
        return UserBadge.objects.filter(user=self.request.user).select_related('badge')


class StreakUpdateView(APIView):
    def post(self, request):
        profile = request.user.gamification
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
