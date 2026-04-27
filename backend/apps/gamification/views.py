from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PlayerProfile, Badge
from .serializers import PlayerProfileSerializer, LeaderboardEntrySerializer, GamificationSyncSerializer


class PlayerProfileView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        profile, _ = PlayerProfile.objects.get_or_create(user=request.user)
        return Response(PlayerProfileSerializer(profile).data)

    def post(self, request):
        serializer = GamificationSyncSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        profile, _ = PlayerProfile.objects.get_or_create(user=request.user)
        profile.xp = max(profile.xp, data["xp"])
        profile.fuel = data.get("fuel", profile.fuel)
        profile.streak = data.get("streak", profile.streak)
        profile.career_track = data.get("career_track", profile.career_track)
        profile.save()

        for badge_data in data.get("badges", []):
            Badge.objects.get_or_create(
                player=profile,
                badge_id=badge_data["badge_id"],
                defaults={
                    "name": badge_data["name"],
                    "description": badge_data["description"],
                    "icon": badge_data["icon"],
                },
            )

        return Response(PlayerProfileSerializer(profile).data, status=status.HTTP_200_OK)


class LeaderboardView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        top = PlayerProfile.objects.select_related("user").order_by("-xp")[:50]
        return Response(LeaderboardEntrySerializer(top, many=True).data)
