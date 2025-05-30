from rest_framework import serializers
from .models import Ticket, TicketComment
from accounts.models import CustomUser # Ensure CustomUser is imported
from accounts.serializers import UserSerializer # Assuming UserSerializer exists
from pos.models import Business # Import Business model
from pos.serializers import BusinessSerializer # Assuming BusinessSerializer exists

class TicketCommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    author_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(), # Use CustomUser directly
        source='author', write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = TicketComment
        fields = ["id", "ticket", "author", "author_id", "comment", "created_at"]
        read_only_fields = ["id", "created_at", "author"]
        extra_kwargs = {
            "ticket": {"write_only": True} # Usually comment is created in context of a ticket
        }

    def create(self, validated_data):
        # Set author to the requesting user if not provided
        # Handle this logic in the view for clarity
        # if 'author' not in validated_data and self.context["request"].user.is_authenticated:
        #     validated_data['author'] = self.context["request"].user
        return super().create(validated_data)

class TicketSerializer(serializers.ModelSerializer):
    reporter = UserSerializer(read_only=True)
    assignee = UserSerializer(read_only=True, allow_null=True)
    related_business = BusinessSerializer(read_only=True, allow_null=True)
    comments = TicketCommentSerializer(many=True, read_only=True)

    reporter_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(), # Use CustomUser directly
        source='reporter', write_only=True, required=False, allow_null=True
    )
    assignee_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(), # Use CustomUser directly
        source='assignee', write_only=True, required=False, allow_null=True
    )
    related_business_id = serializers.PrimaryKeyRelatedField(
        queryset=Business.objects.all(), # Use Business directly
        source='related_business', write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Ticket
        fields = [
            "id", "subject", "description", "status", "priority",
            "reporter", "reporter_id",
            "assignee", "assignee_id",
            "related_business", "related_business_id",
            "created_at", "updated_at", "comments"
        ]
        read_only_fields = ["id", "created_at", "updated_at", "reporter", "assignee", "related_business", "comments"]

    def create(self, validated_data):
        # Set reporter to the requesting user if not provided
        # Handle this logic in the view for clarity
        # if 'reporter' not in validated_data and self.context["request"].user.is_authenticated:
        #     validated_data['reporter'] = self.context["request"].user
        return super().create(validated_data)

