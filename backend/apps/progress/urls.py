from django.urls import path

from . import views

urlpatterns = [
    path('', views.UserProgressView.as_view()),
    path('lessons/<slug:lesson_slug>/complete/', views.LessonCompleteView.as_view()),
    path('topics/<slug:topic_slug>/', views.TopicProgressView.as_view()),
    path('topics/<slug:topic_slug>/enroll/', views.TopicEnrollView.as_view()),
]
