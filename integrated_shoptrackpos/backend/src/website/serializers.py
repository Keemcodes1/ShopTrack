from rest_framework import serializers
from .models import Page
from accounts.models import CustomUser # Import CustomUser
from accounts.serializers import UserSerializer # Assuming UserSerializer exists

class PageSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    author_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(), # Use CustomUser directly
        source='author', write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Page
        fields = ["id", "title", "slug", "content", "author", "author_id", "created_at", "updated_at", "is_published"]
        read_only_fields = ["id", "created_at", "updated_at", "author"]
        lookup_field = "slug" # Allow lookup by slug
        extra_kwargs = {
            "url": {"lookup_field": "slug"}
        }

    def create(self, validated_data):
        # Set author to the requesting user if not provided
        # Handle this in the view for clarity
        # if 'author' not in validated_data and self.context["request"].user.is_authenticated:
        #     validated_data['author'] = self.context["request"].user
        return super().create(validated_data)

