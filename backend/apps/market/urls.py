from django.urls import path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('items',      views.MarketItemViewSet,     basename='market-item')
router.register('categories', views.MarketCategoryViewSet, basename='market-category')

urlpatterns = router.urls + [
    path('purchase/',               views.PurchaseView.as_view()),
    path('inventory/',              views.InventoryView.as_view()),
    path('wishlist/',               views.WishlistView.as_view()),
    path('items/<slug:slug>/review/', views.ReviewView.as_view()),
]
