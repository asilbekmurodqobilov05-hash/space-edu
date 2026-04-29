from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('levels',    views.LevelViewSet,        basename='level')
router.register('units',     views.UnitViewSet,         basename='unit')
router.register('lessons',   views.LessonViewSet,       basename='lesson')
router.register('sections',  views.SectionViewSet,      basename='section')
router.register('questions', views.QuizQuestionViewSet, basename='question')

urlpatterns = router.urls
