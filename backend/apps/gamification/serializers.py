from rest_framework import serializers

from .models import Badge, UserBadge, UserGamificationProfile, RewardProduct, UserRewardPurchase, Mission, UserMission


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = (
            'slug', 'title_en', 'title_uz', 'title_ru',
            'description_en', 'description_uz', 'description_ru',
            'icon', 'rarity', 'condition_type', 'condition_value',
        )


class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer()

    class Meta:
        model = UserBadge
        fields = ('badge', 'earned_at')


class GamificationProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGamificationProfile
        fields = ('xp', 'level', 'fuel', 'streak', 'last_play_date', 'skills')
        read_only_fields = fields


class LeaderboardEntrySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = UserGamificationProfile
        fields = ('username', 'first_name', 'last_name', 'avatar_url', 'xp', 'level')

    def get_avatar_url(self, obj):
        if not obj.user.avatar:
            return None
        request = self.context.get('request')
        return request.build_absolute_uri(obj.user.avatar.url) if request else obj.user.avatar.url


class RewardProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = RewardProduct
        fields = (
            'id', 'slug', 'title_en', 'title_uz', 'title_ru',
            'description_en', 'description_uz', 'description_ru',
            'icon', 'tier', 'category', 'cost', 'features',
            'is_active', 'order',
        )


class UserRewardPurchaseSerializer(serializers.ModelSerializer):
    product = RewardProductSerializer()

    class Meta:
        model = UserRewardPurchase
        fields = ('id', 'product', 'purchased_at')


class MissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mission
        fields = (
            'id', 'slug', 'title_en', 'title_uz', 'title_ru',
            'description_en', 'description_uz', 'description_ru',
            'mission_type', 'target_value', 'reward_xp', 'reward_fuel',
            'is_active', 'is_daily', 'order',
        )

class UserMissionSerializer(serializers.ModelSerializer):
    mission = MissionSerializer()

    class Meta:
        model = UserMission
        fields = ('id', 'mission', 'is_completed', 'last_claimed_date', 'completed_at')
