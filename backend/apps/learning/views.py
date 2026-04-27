from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import LessonProgress, UnitEnrollment
from .serializers import LessonProgressSerializer, UnitEnrollmentSerializer, ProgressSyncSerializer


class ProgressSyncView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        lessons = LessonProgress.objects.filter(user=request.user)
        enrollments = UnitEnrollment.objects.filter(user=request.user)
        return Response({
            "lesson_progress": LessonProgressSerializer(lessons, many=True).data,
            "enrollments": UnitEnrollmentSerializer(enrollments, many=True).data,
        })

    def post(self, request):
        serializer = ProgressSyncSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        for unit_id in data["enrolled_units"]:
            UnitEnrollment.objects.get_or_create(user=request.user, unit_id=unit_id)

        for lesson_id in data["completed_lessons"]:
            score = data["lesson_scores"].get(lesson_id, 0)
            LessonProgress.objects.update_or_create(
                user=request.user,
                lesson_id=lesson_id,
                defaults={
                    "score": score,
                    "completed": True,
                    "mastered": score >= 80,
                },
            )

        return Response({"status": "synced"}, status=status.HTTP_200_OK)
