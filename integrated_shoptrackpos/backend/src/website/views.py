from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, AllowAny # Adjust permissions
from .models import Page
from .serializers import PageSerializer

class PageViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing static Website Pages.
    Allows lookup by slug.
    """
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    lookup_field = "slug"

    def get_queryset(self):
        # Only show published pages to non-admins
        if not self.request.user.is_staff:
            return Page.objects.filter(is_published=True)
        return Page.objects.all()

    def get_permissions(self):
        # Allow anyone to retrieve published pages (list and retrieve by slug)
        if self.action in ["list", "retrieve"]:
            permission_classes = [AllowAny]
        # Require admin permissions for creating, updating, deleting pages
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

