from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/',         include('apps.accounts.urls')),
    path('api/v1/gamification/', include('apps.gamification.urls')),
    path('api/v1/courses/',      include('apps.courses.urls')),
    path('api/v1/progress/',     include('apps.progress.urls')),
    path('api/v1/market/',       include('apps.market.urls')),
    path('api/v1/chat/',         include('apps.chat.urls')),
    path('api/v1/news/',         include('apps.news.urls')),
    path('api/v1/events/',       include('apps.events.urls')),
    path('api/v1/challenges/',   include('apps.challenges.urls')),
    path('api/v1/admin-panel/',  include('apps.admin_api.urls')),
    path('api/v1/ai/',           include('apps.ai.urls')),
] + static(settings.MEDIA_URL, document_root=getattr(settings, 'MEDIA_ROOT', ''))
