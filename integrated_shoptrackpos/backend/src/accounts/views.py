from rest_framework import viewsets
from .models import CustomUser
from .serializers import UserSerializer
from rest_framework.permissions import IsAdminUser # Import IsAdminUser

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    Only Admin users can perform create, update, delete operations.
    Authenticated users might be able to view their own profile (requires customization).
    """
    queryset = CustomUser.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    # Apply IsAdminUser permission: Only admins can manage user accounts.
    permission_classes = [IsAdminUser]

    # Optional: Allow users to view/edit their own profile
    # def get_permissions(self):
    #     if self.action == "retrieve" or self.action == "update" or self.action == "partial_update":
    #         # Allow admin or the user themselves
    #         return [permissions.IsAuthenticated()]
    #     return [permissions.IsAdminUser()]
    # 
    # def get_object(self):
    #     obj = super().get_object()
    #     if self.action == "retrieve" or self.action == "update" or self.action == "partial_update":
    #         if self.request.user.is_staff or obj == self.request.user:
    #             return obj
    #         else:
    #             raise PermissionDenied("You do not have permission to access this user.")
    #     return obj

