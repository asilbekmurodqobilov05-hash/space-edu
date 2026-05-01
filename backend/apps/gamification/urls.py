from django.urls import path

from . import views
from .full_profile import FullProfileView

urlpatterns = [
    path('profile/',       views.GamificationProfileView.as_view()),
    path('profile/full/',  FullProfileView.as_view()),
    path('grant/',         views.GamificationGrantView.as_view()),
    path('leaderboard/',   views.LeaderboardView.as_view()),
    path('leaderboard/quiz/', views.QuizLeaderboardView.as_view()),
    path('badges/',        views.UserBadgesView.as_view()),
    path('badges/all/',    views.AllBadgesView.as_view()),
    path('streak/',        views.StreakUpdateView.as_view()),
    # Rewards Store
    path('rewards/',           views.RewardProductListView.as_view()),
    path('rewards/purchases/', views.UserRewardPurchaseListView.as_view()),
    path('rewards/buy/',       views.RewardPurchaseView.as_view()),
    
    # Missions
    path('missions/claim/',    views.MissionClaimView.as_view()),
]
