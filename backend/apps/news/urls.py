from rest_framework.routers import SimpleRouter

from . import views

router = SimpleRouter()
router.register('', views.NewsArticleViewSet, basename='news')

urlpatterns = router.urls
