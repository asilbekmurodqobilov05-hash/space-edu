from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('', views.NewsArticleViewSet, basename='news')

urlpatterns = router.urls
