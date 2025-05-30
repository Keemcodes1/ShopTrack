from rest_framework import viewsets, status, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
# Import necessary permissions
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from accounts.permissions import IsStaffOrReadOnly, IsOwnerOrAdminOrReadOnly # Import custom permissions

from .models import Ticket, TicketComment
from .serializers import TicketSerializer, TicketCommentSerializer
from django.db.models import Q # For complex lookups

class TicketViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing Support Tickets.
    - Authenticated users can create tickets.
    - Staff/Admin can manage all tickets.
    - Reporter can view/update their own tickets.
    - Assignee can view/update assigned tickets.
    """
    queryset = Ticket.objects.all().select_related("reporter", "assignee", "related_business").prefetch_related("comments").order_by("-updated_at")
    serializer_class = TicketSerializer
    # Permissions applied per-action using get_permissions
    filterset_fields = ["status", "priority", "assignee", "reporter", "related_business"]
    search_fields = ["subject", "description"]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Ticket.objects.none() # No tickets for anonymous users
        if user.is_staff:
            return Ticket.objects.all().select_related("reporter", "assignee", "related_business").prefetch_related("comments").order_by("-updated_at")
        # Regular users see tickets they reported or are assigned to them
        return Ticket.objects.filter(Q(reporter=user) | Q(assignee=user)).select_related("reporter", "assignee", "related_business").prefetch_related("comments").order_by("-updated_at")

    def get_permissions(self):
        if self.action == "create":
            # Any authenticated user can create a ticket
            self.permission_classes = [IsAuthenticated]
        elif self.action in ["update", "partial_update", "destroy"]:
            # Only reporter or staff/admin can modify/delete
            self.permission_classes = [IsOwnerOrAdminOrReadOnly]
        elif self.action in ["assign", "update_status"]:
            # Only staff/admin can assign or update status via these actions
            self.permission_classes = [IsAdminUser] # Or IsStaffUser if defined
        else: # list, retrieve, comments_list_create (permissions handled within action)
            self.permission_classes = [IsAuthenticated] # Base permission for viewing
        return super().get_permissions()

    def perform_create(self, serializer):
        # Automatically set the reporter to the current user on creation
        serializer.save(reporter=self.request.user)

    @action(detail=True, methods=["post"], permission_classes=[IsAdminUser]) # Only Staff/Admin can assign
    def assign(self, request, pk=None):
        ticket = self.get_object() # get_object handles 404
        assignee_id = request.data.get("assignee_id")
        if assignee_id is None:
             return Response({"error": "assignee_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            from accounts.models import CustomUser
            # Ensure assignee is a staff member potentially?
            assignee = CustomUser.objects.get(pk=assignee_id, is_staff=True) 
            ticket.assignee = assignee
            ticket.save()
            # Log activity (consider adding activity log creation here)
            return Response(TicketSerializer(ticket, context={"request": request}).data)
        except CustomUser.DoesNotExist:
            return Response({"error": "Assignee (staff) not found"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=["post"], permission_classes=[IsAdminUser]) # Only Staff/Admin can force status change
    def update_status(self, request, pk=None):
        ticket = self.get_object()
        new_status = request.data.get("status")
        if new_status and new_status in [choice[0] for choice in Ticket.STATUS_CHOICES]:
            ticket.status = new_status
            ticket.save()
            # Log activity
            return Response(TicketSerializer(ticket, context={"request": request}).data)
        return Response({"error": "Invalid or missing status provided"}, status=status.HTTP_400_BAD_REQUEST)

    # Nested route for comments related to a specific ticket
    @action(detail=True, methods=["get", "post"], url_path="comments", serializer_class=TicketCommentSerializer)
    def comments_list_create(self, request, pk=None):
        ticket = self.get_object() # Ensures user has permission to view ticket first based on get_queryset
        if request.method == "GET":
            comments = ticket.comments.all().select_related("author").order_by("created_at")
            serializer = TicketCommentSerializer(comments, many=True, context={"request": request})
            return Response(serializer.data)
        elif request.method == "POST":
            if not request.user.is_authenticated:
                 return Response({"error": "Authentication required to comment."}, status=status.HTTP_401_UNAUTHORIZED)
            serializer = TicketCommentSerializer(data=request.data, context={"request": request})
            if serializer.is_valid():
                serializer.save(ticket=ticket, author=request.user)
                # Log activity
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TicketCommentViewSet(mixins.RetrieveModelMixin,
                           mixins.UpdateModelMixin,
                           mixins.DestroyModelMixin,
                           viewsets.GenericViewSet):
    """
    API endpoint for managing individual Ticket Comments (Retrieve, Update, Delete).
    - Author or Staff/Admin can manage the comment.
    - Authenticated users can view.
    """
    queryset = TicketComment.objects.all().select_related("author", "ticket")
    serializer_class = TicketCommentSerializer
    permission_classes = [IsOwnerOrAdminOrReadOnly] # Apply custom permission

    # Ensure user can only interact with comments on tickets they have access to?
    # This is implicitly handled if the URL is nested under /tickets/{ticket_pk}/comments/{comment_pk}/
    # If accessed directly via /comments/{comment_pk}/, add checks:
    # def check_object_permissions(self, request, obj):
    #     super().check_object_permissions(request, obj)
    #     # Check if user has permission to view the parent ticket
    #     ticket = obj.ticket
    #     if not request.user.is_staff and ticket.reporter != request.user and ticket.assignee != request.user:
    #         self.permission_denied(request, message="Cannot access comments for this ticket.")

