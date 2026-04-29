from django.db import transaction
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import MarketItem, UserInventory
from .serializers import MarketItemSerializer, PurchaseSerializer, UserInventorySerializer


class MarketItemListView(generics.ListAPIView):
    serializer_class = MarketItemSerializer
    permission_classes = [AllowAny]
    queryset = MarketItem.objects.filter(is_active=True)
    pagination_class = None


class PurchaseView(APIView):
    def post(self, request):
        serializer = PurchaseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            item = MarketItem.objects.get(slug=serializer.validated_data['item_slug'], is_active=True)
        except MarketItem.DoesNotExist:
            return Response({'detail': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)

        if UserInventory.objects.filter(user=request.user, item=item).exists():
            return Response({'detail': 'You already own this item.'}, status=status.HTTP_400_BAD_REQUEST)

        profile = request.user.gamification
        if profile.fuel < item.cost_fuel:
            return Response(
                {'detail': f'Not enough fuel. Need {item.cost_fuel}, have {profile.fuel}.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            profile.spend_fuel(item.cost_fuel)
            inventory = UserInventory.objects.create(user=request.user, item=item)

        return Response(UserInventorySerializer(inventory).data, status=status.HTTP_201_CREATED)


class InventoryView(generics.ListAPIView):
    serializer_class = UserInventorySerializer
    pagination_class = None

    def get_queryset(self):
        return UserInventory.objects.filter(user=self.request.user).select_related('item')
