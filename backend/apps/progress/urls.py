from django.urls import path

from . import views

urlpatterns = [
    path('', views.UserProgressView.as_view()),
    path('lessons/<slug:lesson_slug>/complete/', views.LessonCompleteView.as_view()),
    path('units/<slug:unit_slug>/', views.UnitProgressView.as_view()),
    path('units/<slug:unit_slug>/enroll/', views.UnitEnrollView.as_view()),
]
