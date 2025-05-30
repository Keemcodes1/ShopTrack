from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        # Include fields relevant for the API, exclude sensitive ones like password by default
        fields = ["id", "username", "email", "first_name", "last_name", "is_staff", "is_active", "date_joined"]
        # Add extra_kwargs if needed, e.g., to make email required
        # extra_kwargs = {
        #     'email': {'required': True, 'allow_blank': False}
        # }

