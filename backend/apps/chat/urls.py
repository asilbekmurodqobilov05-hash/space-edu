from django.urls import path

from . import views

urlpatterns = [
    path('settings/', views.ChatSettingsView.as_view()),

    # Community chat
    path('rooms/', views.RoomListView.as_view()),
    path('rooms/<slug:slug>/messages/', views.RoomMessagesView.as_view()),
    path('rooms/<slug:slug>/messages/<int:message_id>/', views.RoomMessageDeleteView.as_view()),

    # Moderation
    path('blocks/', views.BlockListCreateView.as_view()),
    path('blocks/<int:user_id>/', views.BlockDeleteView.as_view()),
    path('reports/', views.ReportCreateView.as_view()),
    path('reports/queue/', views.ReportQueueView.as_view()),
    path('reports/<int:report_id>/resolve/', views.ReportResolveView.as_view()),

    # Direct messages — every one of these is refused while DM_ENABLED is off.
    path('dm/users/', views.UserSearchView.as_view()),
    path('dm/conversations/', views.ConversationListView.as_view()),
    path('dm/conversations/start/', views.ConversationStartView.as_view()),
    path('dm/conversations/<int:convo_id>/messages/', views.ConversationMessagesView.as_view()),
    path('dm/conversations/<int:convo_id>/accept/', views.ConversationAcceptView.as_view()),
    path('dm/conversations/<int:convo_id>/decline/', views.ConversationDeclineView.as_view()),
    path('dm/messages/<int:message_id>/', views.DirectMessageDeleteView.as_view()),
    path('dm/unread-count/', views.UnreadCountView.as_view()),
]
