from django.urls import path

from . import views

urlpatterns = [
    path('items/', views.MarketItemListView.as_view()),
    path('purchase/', views.PurchaseView.as_view()),
    path('inventory/', views.InventoryView.as_view()),
]
