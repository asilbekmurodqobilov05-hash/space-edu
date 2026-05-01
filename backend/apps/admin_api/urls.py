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
    path('chat-rooms/', views.ChatRoomsView.as_view()),
]
