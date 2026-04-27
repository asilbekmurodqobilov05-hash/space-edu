from django.urls import path
from .views import PlayerProfileView, LeaderboardView

urlpatterns = [
    path("profile/", PlayerProfileView.as_view(), name="gamification-profile"),
    path("leaderboard/", LeaderboardView.as_view(), name="gamification-leaderboard"),
]
