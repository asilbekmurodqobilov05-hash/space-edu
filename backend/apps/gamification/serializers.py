from rest_framework import serializers
from .models import PlayerProfile, Badge


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ("badge_id", "name", "description", "icon", "unlocked_at")


class PlayerProfileSerializer(serializers.ModelSerializer):
    level = serializers.IntegerField(read_only=True)
    badges = BadgeSerializer(many=True, read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    astronaut_name = serializers.CharField(source="user.astronaut_name", read_only=True)

    class Meta:
        model = PlayerProfile
        fields = ("xp", "level", "fuel", "streak", "career_track", "badges", "username", "astronaut_name")
        read_only_fields = ("xp", "level")


class LeaderboardEntrySerializer(serializers.ModelSerializer):
    level = serializers.IntegerField(read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    astronaut_name = serializers.CharField(source="user.astronaut_name", read_only=True)

    class Meta:
        model = PlayerProfile
        fields = ("username", "astronaut_name", "xp", "level", "streak")


class GamificationSyncSerializer(serializers.Serializer):
    xp = serializers.IntegerField(min_value=0)
    fuel = serializers.IntegerField(min_value=0)
    streak = serializers.IntegerField(min_value=0)
    career_track = serializers.CharField(allow_blank=True, required=False)
    badges = BadgeSerializer(many=True, required=False)
