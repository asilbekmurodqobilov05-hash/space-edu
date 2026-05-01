from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.DashboardView.as_view()),
    path('users/', views.UsersView.as_view()),
    path('users/<int:pk>/', views.UserDetailView.as_view()),
    path('news/', views.NewsListView.as_view()),
    path('news/<int:pk>/', views.NewsDetailView.as_view()),
    path('events/', views.EventsListView.as_view()),
    path('events/<int:pk>/', views.EventDetailView.as_view()),
    path('questions/', views.QuestionsListView.as_view()),
    path('questions/<int:pk>/', views.QuestionDetailView.as_view()),
    path('spheres/', views.SpheresListView.as_view()),
    path('spheres/<int:pk>/', views.SphereDetailView.as_view()),
    path('topics/', views.TopicListView.as_view()),
    path('topics/<int:pk>/', views.TopicDetailView.as_view()),
    path('lessons/', views.TopicLessonListView.as_view()),
    path('lessons/<int:pk>/', views.TopicLessonDetailView.as_view()),
    path('market/', views.MarketItemListView.as_view()),
    path('market/<int:pk>/', views.MarketItemDetailView.as_view()),
    path('chat-rooms/', views.ChatRoomsView.as_view()),
    path('missions/', views.MissionsListView.as_view()),
    path('missions/<int:pk>/', views.MissionDetailView.as_view()),
]
