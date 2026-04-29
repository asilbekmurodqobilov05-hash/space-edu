from rest_framework import viewsets

from apps.permissions import AdminWriteOrReadOnly

from .models import NewsArticle
from .serializers import NewsArticleSerializer, NewsArticleWriteSerializer


class NewsArticleViewSet(viewsets.ModelViewSet):
    permission_classes = [AdminWriteOrReadOnly]

    def get_queryset(self):
        qs = NewsArticle.objects.all()
        if not (self.request.user.is_authenticated and self.request.user.is_staff):
            qs = qs.filter(is_published=True)
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category__iexact=category)
        return qs

    def get_serializer_class(self):
        if self.request.method in ('POST', 'PUT', 'PATCH'):
            return NewsArticleWriteSerializer
        return NewsArticleSerializer
