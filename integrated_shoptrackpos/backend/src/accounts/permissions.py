from rest_framework import permissions

class IsStaffOrReadOnly(permissions.BasePermission):
    """
    Allows read access to anyone, but write access only to staff/admin users.
    """
    def has_permission(self, request, view):
        # Allow read-only methods (GET, HEAD, OPTIONS) to anyone
        if request.method in permissions.SAFE_METHODS:
            return True
        # Allow write methods only to staff users
        return request.user and request.user.is_staff

class IsOwnerOrAdminOrReadOnly(permissions.BasePermission):
    """
    Allows read access to anyone.
    Allows write access only to the object's owner or admin/staff users.
    Assumes the model instance has an `owner` or `author` or `reporter` attribute.
    """
    def has_object_permission(self, request, view, obj):
        # Allow read-only methods (GET, HEAD, OPTIONS) to anyone
        if request.method in permissions.SAFE_METHODS:
            return True

        # Check if the user is admin/staff
        if request.user and request.user.is_staff:
            return True

        # Check if the user is the owner/author/reporter of the object
        owner_attr = None
        if hasattr(obj, "owner"): # For Business model
            owner_attr = "owner"
        elif hasattr(obj, "author"): # For Blog Post, Website Page, Ticket Comment
            owner_attr = "author"
        elif hasattr(obj, "reporter"): # For Ticket, Complaint
            owner_attr = "reporter"
        
        # Allow write access if the user is the owner/author/reporter
        return owner_attr and getattr(obj, owner_attr) == request.user

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Allows read access to anyone, but write access only to admin users.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_superuser

# You might need more specific permissions, e.g., IsBusinessOwner for POS actions
# class IsBusinessOwner(permissions.BasePermission):
#     def has_object_permission(self, request, view, obj):
#         # Check if the request.user is the owner of the business related to the object
#         if isinstance(obj, Business):
#             return obj.owner == request.user
#         if hasattr(obj, "business"):
#             return obj.business.owner == request.user
#         return False

