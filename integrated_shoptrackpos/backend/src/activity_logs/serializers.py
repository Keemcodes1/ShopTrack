from rest_framework import serializers
from .models import ActivityLog
from accounts.serializers import UserSerializer # Assuming UserSerializer exists
from django.contrib.contenttypes.models import ContentType

class ContentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentType
        fields = ["app_label", "model"]

class ActivityLogSerializer(serializers.ModelSerializer):
    actor = UserSerializer(read_only=True)
    # Represent the generic foreign key target in a readable way
    target = serializers.SerializerMethodField()
    content_type = ContentTypeSerializer(read_only=True)

    class Meta:
        model = ActivityLog
        fields = ["id", "actor", "verb", "timestamp", "content_type", "object_id", "target", "details"]
        read_only_fields = ["id", "actor", "verb", "timestamp", "content_type", "object_id", "target", "details"]

    def get_target(self, obj):
        if obj.content_object:
            # Return a simple string representation or a link to the object
            return str(obj.content_object)
        return None

