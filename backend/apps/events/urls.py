from rest_framework.routers import SimpleRouter

from . import views

router = SimpleRouter()
router.register('', views.SpaceEventViewSet, basename='event')

urlpatterns = router.urls
