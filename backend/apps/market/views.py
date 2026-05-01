from django.db import transaction
from django.db.models import Q
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.permissions import AdminWriteOrReadOnly

from .models import MarketItem, MarketCategory, UserInventory, Wishlist, ItemReview
from .serializers import (
    MarketItemSerializer, MarketItemWriteSerializer,
    MarketCategorySerializer,
    PurchaseSerializer, UserInventorySerializer,
    WishlistSerializer, WishlistWriteSerializer,
    ItemReviewSerializer, ItemReviewWriteSerializer,
)


# ──────────────────────────────────────────────────────────────────────────────
#  CATEGORIES
# ──────────────────────────────────────────────────────────────────────────────
class MarketCategoryViewSet(viewsets.ModelViewSet):
    queryset = MarketCategory.objects.all()
    serializer_class = MarketCategorySerializer
    permission_classes = [AdminWriteOrReadOnly]
    lookup_field = 'slug'


# ──────────────────────────────────────────────────────────────────────────────
#  MARKET ITEMS  (full filtering + sorting)
# ──────────────────────────────────────────────────────────────────────────────
class MarketItemViewSet(viewsets.ModelViewSet):
    permission_classes = [AdminWriteOrReadOnly]
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.request.method in ('POST', 'PUT', 'PATCH'):
            return MarketItemWriteSerializer
        return MarketItemSerializer

    def get_queryset(self):
        qs = MarketItem.objects.select_related('category').all()

        # Non-staff see only active items
        if not (self.request.user.is_authenticated and self.request.user.is_staff):
            qs = qs.filter(is_active=True)

        params = self.request.query_params

        # ── Filter: type ──
        item_type = params.get('type')
        if item_type:
            qs = qs.filter(item_type=item_type)

        # ── Filter: category ──
        category = params.get('category')
        if category:
            qs = qs.filter(category__slug=category)

        # ── Filter: price range ──
        min_price = params.get('min_price')
        if min_price:
            qs = qs.filter(price__gte=int(min_price))
        max_price = params.get('max_price')
        if max_price:
            qs = qs.filter(price__lte=int(max_price))

        # ── Filter: fuel range ──
        min_fuel = params.get('min_fuel')
        if min_fuel:
            qs = qs.filter(cost_fuel__gte=int(min_fuel))
        max_fuel = params.get('max_fuel')
        if max_fuel:
            qs = qs.filter(cost_fuel__lte=int(max_fuel))

        # ── Filter: flags ──
        if params.get('bestseller') == 'true':
            qs = qs.filter(is_bestseller=True)
        if params.get('new') == 'true':
            qs = qs.filter(is_new=True)
        if params.get('featured') == 'true':
            qs = qs.filter(is_featured=True)
        if params.get('limited') == 'true':
            qs = qs.filter(is_limited=True)
        if params.get('on_sale') == 'true':
            qs = qs.filter(discount_percent__gt=0)

        # ── Filter: rating ──
        min_rating = params.get('min_rating')
        if min_rating:
            qs = qs.filter(rating_avg__gte=float(min_rating))

        # ── Filter: tags (partial match) ──
        tag = params.get('tag')
        if tag:
            qs = qs.filter(tags__icontains=tag)

        # ── Search ──
        search = params.get('search')
        if search:
            qs = qs.filter(
                Q(title_en__icontains=search) |
                Q(title_uz__icontains=search) |
                Q(title_ru__icontains=search) |
                Q(description_en__icontains=search) |
                Q(tags__icontains=search)
            )

        # ── Sorting ──
        sort = params.get('sort', '-created_at')
        allowed_sorts = {
            'price': 'price', '-price': '-price',
            'fuel': 'cost_fuel', '-fuel': '-cost_fuel',
            'rating': '-rating_avg',
            'popular': '-sold_count',
            'newest': '-created_at',
            'discount': '-discount_percent',
            'name': 'title_en',
        }
        order = allowed_sorts.get(sort, '-created_at')
        qs = qs.order_by(order)

        return qs

    @action(detail=True, methods=['get'])
    def reviews(self, request, slug=None):
        item = self.get_object()
        reviews = item.reviews.all()
        return Response(ItemReviewSerializer(reviews, many=True).data)


# ──────────────────────────────────────────────────────────────────────────────
#  PURCHASE
# ──────────────────────────────────────────────────────────────────────────────
class PurchaseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PurchaseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            item = MarketItem.objects.get(slug=serializer.validated_data['item_slug'], is_active=True)
        except MarketItem.DoesNotExist:
            return Response({'detail': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not item.in_stock:
            return Response({'detail': 'Item is out of stock.'}, status=status.HTTP_400_BAD_REQUEST)

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
            item.sold_count += 1
            item.save(update_fields=['sold_count'])

        return Response(UserInventorySerializer(inventory).data, status=status.HTTP_201_CREATED)


# ──────────────────────────────────────────────────────────────────────────────
#  INVENTORY
# ──────────────────────────────────────────────────────────────────────────────
class InventoryView(generics.ListAPIView):
    serializer_class = UserInventorySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return UserInventory.objects.filter(user=self.request.user).select_related('item')


# ──────────────────────────────────────────────────────────────────────────────
#  WISHLIST
# ──────────────────────────────────────────────────────────────────────────────
class WishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = Wishlist.objects.filter(user=request.user).select_related('item')
        return Response(WishlistSerializer(items, many=True).data)

    def post(self, request):
        serializer = WishlistWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            item = MarketItem.objects.get(slug=serializer.validated_data['item_slug'], is_active=True)
        except MarketItem.DoesNotExist:
            return Response({'detail': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)

        obj, created = Wishlist.objects.get_or_create(user=request.user, item=item)
        if not created:
            obj.delete()
            return Response({'detail': 'Removed from wishlist.'}, status=status.HTTP_200_OK)

        return Response(WishlistSerializer(obj).data, status=status.HTTP_201_CREATED)


# ──────────────────────────────────────────────────────────────────────────────
#  REVIEWS
# ──────────────────────────────────────────────────────────────────────────────
class ReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        try:
            item = MarketItem.objects.get(slug=slug, is_active=True)
        except MarketItem.DoesNotExist:
            return Response({'detail': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Must own the item
        if not UserInventory.objects.filter(user=request.user, item=item).exists():
            return Response({'detail': 'You must own this item to review it.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = ItemReviewWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        review, created = ItemReview.objects.update_or_create(
            user=request.user, item=item,
            defaults=serializer.validated_data,
        )

        return Response(
            ItemReviewSerializer(review).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )
