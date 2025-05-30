from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, AllowAny # Adjust permissions
from .models import Category, Tag, Post
from .serializers import CategorySerializer, TagSerializer, PostSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing Blog Categories.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class TagViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing Blog Tags.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class PostViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing Blog Posts.
    """
    queryset = Post.objects.all().select_related("author", "category").prefetch_related("tags")
    serializer_class = PostSerializer
    lookup_field = "slug"
    filterset_fields = ["category__slug", "tags__slug", "status", "author"]
    search_fields = ["title", "content"]

    def get_queryset(self):
        queryset = super().get_queryset()
        # Only show published posts to non-admins/non-authors
        user = self.request.user
        if not user.is_staff:
            queryset = queryset.filter(status="PUBLISHED")
        # Add filtering by category or tag slugs if needed via query params
        return queryset

    def get_permissions(self):
        # Allow anyone to retrieve published posts
        if self.action in ["list", "retrieve"]:
            permission_classes = [AllowAny]
        # Require authenticated user (author) or admin for other actions
        # More granular permissions (e.g., IsOwnerOrAdmin) can be added
        else:
            permission_classes = [IsAdminUser] # Or IsAuthenticated for authors to edit their own
        return [permission() for permission in permission_classes]

    # Optional: Override perform_create to set author automatically
    # def perform_create(self, serializer):
    #     if self.request.user.is_authenticated:
    #         serializer.save(author=self.request.user)
    #     else:
    #         # Handle anonymous post creation if allowed, or raise error
    #         serializer.save() # Or raise PermissionDenied

