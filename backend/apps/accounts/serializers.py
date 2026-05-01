from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, min_length=8, style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True, style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'date_of_birth', 'password', 'password2')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'date_of_birth': {'required': True},
        }

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('This email is already registered.')
        return value.lower()

    def validate_date_of_birth(self, value):
        from datetime import date
        if value >= date.today():
            raise serializers.ValidationError('Date of birth must be in the past.')
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        from django.core.exceptions import ValidationError as DjangoValidationError
        try:
            validate_password(attrs['password'])
        except DjangoValidationError as e:
            raise serializers.ValidationError({'password': list(e.messages)})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        email = validated_data['email']
        # Auto-generate username from email (before the @)
        base = email.split('@')[0]
        username = base
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f'{base}{counter}'
            counter += 1
        validated_data['username'] = username
        user = User.objects.create_user(**validated_data)

        # Auto-create related profiles
        from apps.gamification.models import UserGamificationProfile
        UserGamificationProfile.objects.get_or_create(user=user)
        try:
            from apps.challenges.models import UserStreak
            UserStreak.objects.get_or_create(user=user)
        except Exception:
            pass

        return user


class UserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'username', 'first_name', 'last_name', 'email',
            'date_of_birth', 'avatar_url', 'astronaut_name', 'bio', 'language', 'date_joined',
            'is_staff',
        )
        read_only_fields = fields

    def get_avatar_url(self, obj):
        if not obj.avatar:
            return None
        try:
            url = obj.avatar.url
        except (ValueError, OSError, AttributeError):
            return None
        request = self.context.get('request')
        if request:
            try:
                return request.build_absolute_uri(url)
            except Exception:
                return url
        return url


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('avatar', 'astronaut_name', 'bio', 'selected_spaceship', 'language')

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if instance.avatar and request:
            data['avatar'] = request.build_absolute_uri(instance.avatar.url)
        return data
