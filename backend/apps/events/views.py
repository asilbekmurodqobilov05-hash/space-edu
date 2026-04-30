from rest_framework import viewsets

from apps.permissions import AdminWriteOrReadOnly

from .models import SpaceEvent
from .serializers import SpaceEventSerializer, SpaceEventWriteSerializer


class SpaceEventViewSet(viewsets.ModelViewSet):
    permission_classes = [AdminWriteOrReadOnly]

    def get_queryset(self):
        qs = SpaceEvent.objects.all()
        event_type = self.request.query_params.get('type')
        if event_type:
            qs = qs.filter(event_type=event_type)
        year = self.request.query_params.get('year')
        if year:
            qs = qs.filter(event_date__year=year)
        featured = self.request.query_params.get('featured')
        if featured == 'true':
            qs = qs.filter(is_featured=True)
        historical = self.request.query_params.get('historical')
        if historical == 'true':
            qs = qs.filter(is_historical=True)
        return qs

    def get_serializer_class(self):
        if self.request.method in ('POST', 'PUT', 'PATCH'):
            return SpaceEventWriteSerializer
        return SpaceEventSerializer
