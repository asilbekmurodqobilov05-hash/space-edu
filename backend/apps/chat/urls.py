from django.urls import path

from . import views

urlpatterns = [
    path('rooms/', views.RoomListView.as_view()),
    path('rooms/<slug:slug>/messages/', views.RoomMessagesView.as_view()),
]
