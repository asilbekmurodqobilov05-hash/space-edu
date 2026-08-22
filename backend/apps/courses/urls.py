from rest_framework.routers import SimpleRouter

from . import views

router = SimpleRouter()

router.register('spheres',       views.SphereViewSet,      basename='sphere')
router.register('topics',        views.TopicViewSet,       basename='topic')
router.register('topic-lessons', views.TopicLessonViewSet, basename='topic-lesson')
router.register('problems',      views.ProblemViewSet,     basename='problem')

# `levels`, `units`, `lessons`, `sections`, `questions` and `sub-lessons` are
# gone with the Level branch — see docs/adr/0001-content-model.md.

urlpatterns = router.urls
