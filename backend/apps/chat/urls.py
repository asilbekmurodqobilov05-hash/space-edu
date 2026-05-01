from django.urls import path

from . import views

urlpatterns = [
    # Community chat (existing)
    path('rooms/', views.RoomListView.as_view()),
    path('rooms/<slug:slug>/messages/', views.RoomMessagesView.as_view()),

    # Direct messages (new)
    path('dm/users/', views.UserSearchView.as_view()),
    path('dm/conversations/', views.ConversationListView.as_view()),
    path('dm/conversations/start/', views.ConversationStartView.as_view()),
    path('dm/conversations/<int:convo_id>/messages/', views.ConversationMessagesView.as_view()),
    path('dm/unread-count/', views.UnreadCountView.as_view()),
]
