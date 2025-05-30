from rest_framework import viewsets
# Import necessary permissions
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser 
from accounts.permissions import IsStaffOrReadOnly, IsOwnerOrAdminOrReadOnly # Import custom permissions

from .models import Business, Transaction, Complaint
from .serializers import BusinessSerializer, TransactionSerializer, ComplaintSerializer

class BusinessViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing Businesses.
    Staff can manage all businesses. Authenticated users can view.
    """
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer
    # Staff can manage, others can read
    permission_classes = [IsStaffOrReadOnly]

    # Optional: Filter queryset based on user, e.g., only show businesses owned by the user
    # def get_queryset(self):
    #     user = self.request.user
    #     if user.is_staff:
    #         return Business.objects.all()
    #     # Allow authenticated users to see their own business if applicable
    #     # return Business.objects.filter(Q(owner=user) | Q(is_active=True)) # Example logic
    #     return Business.objects.filter(owner=user)

class TransactionViewSet(viewsets.ReadOnlyModelViewSet): # Changed to ReadOnly to prevent direct modification via API for now
    """
    API endpoint for viewing Transactions.
    Creation might happen implicitly through POS actions, not direct API calls.
    Deletion/Modification should likely be restricted to Admins or specific logic.
    """
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    # Allow authenticated users to view, but restrict modification severely
    permission_classes = [IsAdminUser] # Only Admins can view/manage all transactions directly for now

    # Optional: Filter transactions based on business or user
    # def get_queryset(self):
    #     user = self.request.user
    #     queryset = Transaction.objects.all()
    #     if not user.is_staff:
    #         # Filter for transactions related to businesses owned by the user
    #         user_businesses = Business.objects.filter(owner=user).values_list("id", flat=True)
    #         queryset = queryset.filter(business_id__in=user_businesses)
    #     # Further filter by business ID if provided in query params
    #     business_id = self.request.query_params.get("business_id")
    #     if business_id:
    #         queryset = queryset.filter(business_id=business_id)
    #     return queryset

class ComplaintViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing Complaints.
    Reporter or Staff can manage.
    """
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    # Reporter can create/view/update their own, Staff can manage all
    permission_classes = [IsOwnerOrAdminOrReadOnly]

    # Optional: Filter complaints based on business or reporter
    # def get_queryset(self):
    #     user = self.request.user
    #     queryset = Complaint.objects.all()
    #     if not user.is_staff:
    #         # Allow users to see only their reported complaints or complaints about their business
    #         user_businesses = Business.objects.filter(owner=user).values_list("id", flat=True)
    #         queryset = queryset.filter(Q(reporter=user) | Q(business_id__in=user_businesses))
    #     # Filter by business ID if provided
    #     business_id = self.request.query_params.get("business_id")
    #     if business_id:
    #         queryset = queryset.filter(business_id=business_id)
    #     return queryset

    def perform_create(self, serializer):
        # Automatically set the reporter to the current user on creation
        if self.request.user.is_authenticated:
            serializer.save(reporter=self.request.user)
        else:
            # Handle anonymous complaint creation if allowed, otherwise rely on permission class
            serializer.save()

