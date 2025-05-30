from rest_framework import serializers
from .models import Category, Tag, Post
from accounts.models import CustomUser # Import CustomUser
from accounts.serializers import UserSerializer # Assuming UserSerializer exists

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]
        lookup_field = "slug"
        extra_kwargs = {
            "url": {"lookup_field": "slug"}
        }

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name", "slug"]
        lookup_field = "slug"
        extra_kwargs = {
            "url": {"lookup_field": "slug"}
        }

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    author_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(), # Use CustomUser directly
        source='author', write_only=True, required=False, allow_null=True
    )
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, required=False, allow_null=True
    )
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), source='tags', write_only=True, many=True, required=False
    )

    class Meta:
        model = Post
        fields = [
            "id", "title", "slug", "author", "author_id", "content",
            "created_at", "updated_at", "published_at", "status",
            "category", "category_id", "tags", "tag_ids"
        ]
        read_only_fields = ["id", "created_at", "updated_at", "published_at", "author", "category", "tags"]
        lookup_field = "slug"
        extra_kwargs = {
            "url": {"lookup_field": "slug"}
        }

    def create(self, validated_data):
        # Set author to the requesting user if not provided
        # Handle this in the view for clarity
        # if 'author' not in validated_data and self.context["request"].user.is_authenticated:
        #     validated_data['author'] = self.context["request"].user
        # Handle tags separately if needed (DRF handles M2M with PrimaryKeyRelatedField)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Handle tags update if needed
        return super().update(instance, validated_data)

