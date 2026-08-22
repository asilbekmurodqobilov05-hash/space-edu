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
    """Public leaderboard row.

    Deliberately minimal. This is served to anonymous callers on a platform for
    10-18 year-olds, and it used to return first_name, last_name and a link to
    the child's photo in a public R2 bucket — the full legal name and face of the
    top 100 users, scrapable with one unauthenticated request.

    Only a display handle is exposed. `astronaut_name` is the nickname the user
    chose; `username` is derived from their e-mail local part, so it is the
    fallback rather than the first choice.
    """

    display_name = serializers.SerializerMethodField()

    class Meta:
        model = UserGamificationProfile
        fields = ('display_name', 'xp', 'level')

    def get_display_name(self, obj):
        return (obj.user.astronaut_name or '').strip() or obj.user.username


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
