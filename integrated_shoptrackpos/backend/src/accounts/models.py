from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # Add additional fields here if needed, e.g., role, phone_number
    # Example: role = models.CharField(max_length=50, blank=True, null=True)
    # For now, we'll stick to the default fields provided by AbstractUser
    # plus any specific fields required later.

    def __str__(self):
        return self.username

