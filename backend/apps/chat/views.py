from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ChatMessage, ChatRoom
from .serializers import ChatMessageSerializer, ChatRoomSerializer, PostMessageSerializer


class RoomListView(generics.ListAPIView):
    serializer_class = ChatRoomSerializer
    permission_classes = [AllowAny]
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
