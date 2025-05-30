from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class ActivityLog(models.Model):
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    verb = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    # Generic relation to link to the object the action was performed on (optional)
    content_type = models.ForeignKey(ContentType, on_delete=models.SET_NULL, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey("content_type", "object_id")
    # Store additional details as JSON
    details = models.JSONField(null=True, blank=True)

    class Meta:
        ordering = ("-timestamp",)

    def __str__(self):
        if self.content_object:
            return f"{self.actor} {self.verb} {self.content_object}"
        return f"{self.actor} {self.verb}"

