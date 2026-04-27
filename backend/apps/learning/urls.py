from django.urls import path
from .views import ProgressSyncView

urlpatterns = [
    path("progress/", ProgressSyncView.as_view(), name="learning-progress-sync"),
]
