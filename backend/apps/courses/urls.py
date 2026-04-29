from django.urls import path

from . import views

urlpatterns = [
    path('levels/', views.LevelListView.as_view()),
    path('levels/<slug:level_slug>/units/', views.UnitsByLevelView.as_view()),
    path('units/<slug:slug>/', views.UnitDetailView.as_view()),
    path('lessons/<slug:slug>/', views.LessonDetailView.as_view()),
]
