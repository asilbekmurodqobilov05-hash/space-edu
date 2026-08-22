"""Admin panel routes.

The paths are unchanged from the hand-rolled version (ticket B4) — the frontend
dashboard builds them generically as `/admin-panel/<endpoint>/` and
`/admin-panel/<endpoint>/<id>/`, so renaming any prefix breaks a tab silently.
"""
from django.urls import path
from rest_framework.routers import SimpleRouter

from . import views

router = SimpleRouter(trailing_slash=True)
router.register('users',      views.UserViewSet,        basename='admin-user')
router.register('news',       views.NewsViewSet,        basename='admin-news')
router.register('events',     views.EventViewSet,       basename='admin-event')
router.register('questions',  views.QuestionViewSet,    basename='admin-question')
router.register('spheres',    views.SphereViewSet,      basename='admin-sphere')
router.register('topics',     views.TopicViewSet,       basename='admin-topic')
router.register('lessons',    views.TopicLessonViewSet, basename='admin-lesson')
router.register('market',     views.MarketItemViewSet,  basename='admin-market')
router.register('chat-rooms', views.ChatRoomViewSet,    basename='admin-chatroom')
router.register('missions',   views.MissionViewSet,     basename='admin-mission')

urlpatterns = [
    path('dashboard/', views.DashboardView.as_view()),
] + router.urls
