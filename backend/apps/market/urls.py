from django.urls import path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('items', views.MarketItemViewSet, basename='market-item')

urlpatterns = router.urls + [
    path('purchase/', views.PurchaseView.as_view()),
    path('inventory/', views.InventoryView.as_view()),
]
