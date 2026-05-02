from django.urls import path
from rest_framework.routers import SimpleRouter
from . import views

router = SimpleRouter()
router.register('questions', views.ChallengeQuestionViewSet, basename='challenge-question')

urlpatterns = router.urls + [
    # ── Daily Challenge ──
    path('today/',       views.TodayChallengeView.as_view()),
    path('submit/',      views.SubmitChallengeView.as_view()),
    path('history/',     views.MyChallengeHistoryView.as_view()),
    path('leaderboard/', views.DailyLeaderboardView.as_view()),

    # ── Quiz / Test ──
    path('quiz/start/',                     views.QuizStartView.as_view()),
    path('quiz/<int:session_id>/submit/',   views.QuizSubmitView.as_view()),
    path('quiz/<int:session_id>/result/',   views.QuizResultView.as_view()),
    path('quiz/history/',                   views.QuizHistoryView.as_view()),
    path('quiz/stats/',                     views.QuizCategoryStatsView.as_view()),
    path('quiz/<str:category>/questions/',  views.QuizQuestionsPublicView.as_view()),
]
