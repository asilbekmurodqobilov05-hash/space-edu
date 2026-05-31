from django.db.models import Q, Max
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import User
from .models import ChatMessage, ChatRoom, Conversation, DirectMessage
from .serializers import (
    ChatMessageSerializer, ChatRoomSerializer, PostMessageSerializer,
    ConversationSerializer, DirectMessageSerializer, UserMiniSerializer,
)


# ══════════════════════════════════════════════════════════════════
# Community Chat (existing)
# ══════════════════════════════════════════════════════════════════

class RoomListView(generics.ListAPIView):
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]
    queryset = ChatRoom.objects.all()
    pagination_class = None


class RoomMessagesView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, slug):
        try:
            room = ChatRoom.objects.get(slug=slug)
        except ChatRoom.DoesNotExist:
            return Response({'detail': 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)

        messages = (
            ChatMessage.objects.filter(room=room)
            .select_related('user')
            .order_by('-created_at')[:50]
        )
        data = ChatMessageSerializer(
            reversed(list(messages)), many=True, context={'request': request}
        ).data
        return Response(data)

    def post(self, request, slug):
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            room = ChatRoom.objects.get(slug=slug)
        except ChatRoom.DoesNotExist:
            return Response({'detail': 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PostMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        message = ChatMessage.objects.create(
            room=room,
            user=request.user,
            content=serializer.validated_data['content'],
        )
        return Response(
            ChatMessageSerializer(message, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )


# ══════════════════════════════════════════════════════════════════
# Direct Messages (new)
# ══════════════════════════════════════════════════════════════════

class UserSearchView(APIView):
    """GET /chat/dm/users/?q=<search>  — search users to start a DM."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        q = request.query_params.get('q', '').strip()
        if len(q) < 2:
            return Response([])
        users = (
            User.objects.filter(
                Q(username__icontains=q) |
                Q(first_name__icontains=q) |
                Q(last_name__icontains=q)
            )
            .exclude(id=request.user.id)
            .order_by('username')[:20]
        )
        return Response(UserMiniSerializer(users, many=True, context={'request': request}).data)


class ConversationListView(APIView):
    """GET /chat/dm/conversations/  — list of all DM conversations for current user."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        convos = (
            Conversation.objects
            .filter(participants=request.user)
            .annotate(last_msg_time=Max('messages__created_at'))
            .order_by('-last_msg_time', '-updated_at')
        )
        return Response(
            ConversationSerializer(convos, many=True, context={'request': request}).data
        )


class ConversationStartView(APIView):
    """POST /chat/dm/conversations/start/  { user_id: <int> }
    Get or create a 1-to-1 conversation with another user."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        other_id = request.data.get('user_id')
        if not other_id:
            return Response({'detail': 'user_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            other = User.objects.get(id=other_id)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if other.id == request.user.id:
            return Response({'detail': 'Cannot message yourself.'}, status=status.HTTP_400_BAD_REQUEST)

        # Find existing conversation between these two users
        existing = (
            Conversation.objects
            .filter(participants=request.user)
            .filter(participants=other)
        )
        if existing.exists():
            convo = existing.first()
        else:
            convo = Conversation.objects.create()
            convo.participants.add(request.user, other)

        return Response(
            ConversationSerializer(convo, context={'request': request}).data,
            status=status.HTTP_200_OK,
        )


class ConversationMessagesView(APIView):
    """GET/POST /chat/dm/conversations/<id>/messages/"""
    permission_classes = [IsAuthenticated]

    def _get_convo(self, request, convo_id):
        try:
            convo = Conversation.objects.get(id=convo_id, participants=request.user)
        except Conversation.DoesNotExist:
            return None
        return convo

    def get(self, request, convo_id):
        convo = self._get_convo(request, convo_id)
        if not convo:
            return Response({'detail': 'Conversation not found.'}, status=status.HTTP_404_NOT_FOUND)

        messages = (
            convo.messages
            .select_related('sender')
            .order_by('-created_at')[:100]
        )
        # Mark incoming messages as read
        convo.messages.filter(is_read=False).exclude(sender=request.user).update(is_read=True)

        data = DirectMessageSerializer(
            reversed(list(messages)), many=True, context={'request': request}
        ).data
        return Response(data)

    def post(self, request, convo_id):
        convo = self._get_convo(request, convo_id)
        if not convo:
            return Response({'detail': 'Conversation not found.'}, status=status.HTTP_404_NOT_FOUND)

        content = (request.data.get('content') or '').strip()
        if not content:
            return Response({'detail': 'Content is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if len(content) > 2000:
            return Response({'detail': 'Message too long.'}, status=status.HTTP_400_BAD_REQUEST)

        msg = DirectMessage.objects.create(
            conversation=convo,
            sender=request.user,
            content=content,
        )
        # Touch updated_at on conversation
        convo.save(update_fields=['updated_at'])

        return Response(
            DirectMessageSerializer(msg, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )


class UnreadCountView(APIView):
    """GET /chat/dm/unread-count/  — total unread DMs for current user."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count = DirectMessage.objects.filter(
            conversation__participants=request.user,
            is_read=False,
        ).exclude(sender=request.user).count()
        return Response({'unread_count': count})
