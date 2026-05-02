from rest_framework.routers import SimpleRouter

from . import views

router = SimpleRouter()

# ── New sphere-based endpoints ──
router.register('spheres',       views.SphereViewSet,       basename='sphere')
router.register('topics',        views.TopicViewSet,        basename='topic')
router.register('topic-lessons', views.TopicLessonViewSet,  basename='topic-lesson')
router.register('sub-lessons',   views.SubLessonViewSet,    basename='sub-lesson')
router.register('problems',      views.ProblemViewSet,      basename='problem')

# ── Legacy endpoints ──
router.register('levels',    views.LevelViewSet,        basename='level')
router.register('units',     views.UnitViewSet,         basename='unit')
router.register('lessons',   views.LessonViewSet,       basename='lesson')
router.register('sections',  views.SectionViewSet,      basename='section')
router.register('questions', views.QuizQuestionViewSet,  basename='question')

urlpatterns = router.urls
