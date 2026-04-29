from django.db import transaction
from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.permissions import AdminWriteOrReadOnly

from .models import MarketItem, UserInventory
from .serializers import MarketItemSerializer, PurchaseSerializer, UserInventorySerializer


class MarketItemViewSet(viewsets.ModelViewSet):
    serializer_class = MarketItemSerializer
    permission_classes = [AdminWriteOrReadOnly]
    lookup_field = 'slug'

    def get_queryset(self):
        qs = MarketItem.objects.all()
        # Non-staff see only active items
        if not (self.request.user.is_authenticated and self.request.user.is_staff):
            qs = qs.filter(is_active=True)
        item_type = self.request.query_params.get('type')
        if item_type:
            qs = qs.filter(item_type=item_type)
        return qs


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
