from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAdminUser # Activity logs are usually admin-only
from .models import ActivityLog
from .serializers import ActivityLogSerializer

class ActivityLogViewSet(mixins.ListModelMixin,
                         mixins.RetrieveModelMixin,
                         viewsets.GenericViewSet):
    """
    API endpoint that allows activity logs to be viewed.
    This is typically a read-only endpoint for auditing purposes.
    """
    queryset = ActivityLog.objects.all().select_related("actor", "content_type").prefetch_related("content_object")
    serializer_class = ActivityLogSerializer
    permission_classes = [IsAdminUser] # Only admins can view activity logs
    filterset_fields = ["actor", "verb", "content_type", "object_id"] # Add filtering capabilities
    search_fields = ["verb", "actor__username", "details"] # Add search capabilities

