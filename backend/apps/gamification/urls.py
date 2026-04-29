from django.urls import path

from . import views

urlpatterns = [
    path('profile/', views.GamificationProfileView.as_view()),
    path('leaderboard/', views.LeaderboardView.as_view()),
    path('badges/', views.UserBadgesView.as_view()),
    path('streak/', views.StreakUpdateView.as_view()),
]
