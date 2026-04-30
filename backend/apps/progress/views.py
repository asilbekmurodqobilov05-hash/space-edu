from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.courses.models import Lesson, Unit
from apps.gamification.services import check_and_award_badges

from .models import UserLessonProgress, UserUnitEnrollment
from .serializers import LessonCompleteSerializer, LessonProgressSerializer, UnitEnrollmentSerializer


class UserProgressView(APIView):
    def get(self, request):
        lessons = UserLessonProgress.objects.filter(user=request.user).select_related('lesson')
        enrollments = UserUnitEnrollment.objects.filter(user=request.user).select_related('unit')
        return Response({
            'lessons': LessonProgressSerializer(lessons, many=True).data,
            'enrollments': UnitEnrollmentSerializer(enrollments, many=True).data,
        })


class LessonCompleteView(APIView):
    def post(self, request, lesson_slug):
        serializer = LessonCompleteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        score = serializer.validated_data['score']

        try:
            lesson = Lesson.objects.select_related('unit').get(slug=lesson_slug)
        except Lesson.DoesNotExist:
            return Response({'detail': 'Lesson not found.'}, status=status.HTTP_404_NOT_FOUND)

        progress, created = UserLessonProgress.objects.get_or_create(
            user=request.user,
            lesson=lesson,
            defaults={'score': score, 'attempts': 1, 'is_mastered': score >= 70},
        )
        if not created:
            progress.attempts += 1
            if score > progress.score:
                progress.score = score
                progress.is_mastered = progress.score >= 70
            progress.save()

        profile = request.user.gamification
        xp_earned = lesson.xp_reward if created else 0
        fuel_earned = 0

        if xp_earned:
            old_level = profile.level
            profile.add_xp(xp_earned)
            new_level = profile.level
        else:
            old_level = new_level = profile.level

        unit = lesson.unit
        completed_count = UserLessonProgress.objects.filter(user=request.user, lesson__unit=unit).count()
        if completed_count >= unit.lessons.count():
            enrollment, _ = UserUnitEnrollment.objects.get_or_create(user=request.user, unit=unit)
            if not enrollment.completed_at:
                enrollment.completed_at = timezone.now()
                enrollment.save(update_fields=['completed_at'])
                fuel_earned = unit.fuel_reward
                profile.add_fuel(fuel_earned)

        total_lessons = UserLessonProgress.objects.filter(user=request.user).count()
        new_badges = check_and_award_badges(request.user, profile, total_lessons)

        return Response({
            'xp_earned': xp_earned,
            'fuel_earned': fuel_earned,
            'new_level': new_level,
            'leveled_up': new_level > old_level,
            'new_badges': new_badges,
            'is_mastered': progress.is_mastered,
            'score': progress.score,
        })


class UnitProgressView(APIView):
    def get(self, request, unit_slug):
        try:
            unit = Unit.objects.prefetch_related('lessons').get(slug=unit_slug)
        except Unit.DoesNotExist:
            return Response({'detail': 'Unit not found.'}, status=status.HTTP_404_NOT_FOUND)

        lessons_progress = UserLessonProgress.objects.filter(
            user=request.user, lesson__unit=unit
        ).select_related('lesson')
        enrollment = UserUnitEnrollment.objects.filter(user=request.user, unit=unit).first()

        return Response({
            'unit_slug': unit_slug,
            'total_lessons': unit.lessons.count(),
            'completed_lessons': lessons_progress.count(),
            'is_enrolled': enrollment is not None,
            'completed_at': enrollment.completed_at if enrollment else None,
            'lessons': LessonProgressSerializer(lessons_progress, many=True).data,
        })


class UnitEnrollView(APIView):
    def post(self, request, unit_slug):
        try:
            unit = Unit.objects.get(slug=unit_slug)
        except Unit.DoesNotExist:
            return Response({'detail': 'Unit not found.'}, status=status.HTTP_404_NOT_FOUND)

        enrollment, created = UserUnitEnrollment.objects.get_or_create(user=request.user, unit=unit)
        return Response(
            UnitEnrollmentSerializer(enrollment).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )
