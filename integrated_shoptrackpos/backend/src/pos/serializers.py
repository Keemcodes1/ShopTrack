from rest_framework import serializers
from .models import Business, Transaction, Complaint
from accounts.models import CustomUser # Moved import to the top
from accounts.serializers import UserSerializer # Assuming UserSerializer exists

class BusinessSerializer(serializers.ModelSerializer):
    # Optionally include related owner details
    # owner = UserSerializer(read_only=True)
    owner_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(), # Use CustomUser directly
        source='owner', write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Business
        fields = ["id", "name", "owner_id", "address", "contact_email", "contact_phone", "onboarding_date", "is_active"]
        read_only_fields = ["onboarding_date"]

    def create(self, validated_data):
        # Set owner to the requesting user if not provided
        # Note: CurrentUserDefault requires context, simpler to handle in view or set explicitly
        # if 'owner' not in validated_data and self.context["request"].user.is_authenticated:
        #     validated_data['owner'] = self.context["request"].user
        return super().create(validated_data)

class TransactionSerializer(serializers.ModelSerializer):
    # Optionally include related business details
    # business = BusinessSerializer(read_only=True)
    business_id = serializers.PrimaryKeyRelatedField(queryset=Business.objects.all(), source='business')

    class Meta:
        model = Transaction
        fields = ["id", "business_id", "timestamp", "amount", "description"]
        read_only_fields = ["timestamp"]

class ComplaintSerializer(serializers.ModelSerializer):
    # Optionally include related business and reporter details
    # business = BusinessSerializer(read_only=True)
    # reporter = UserSerializer(read_only=True)
    business_id = serializers.PrimaryKeyRelatedField(queryset=Business.objects.all(), source='business')
    reporter_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(), # Use CustomUser directly
        source='reporter', write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Complaint
        fields = ["id", "business_id", "reporter_id", "subject", "description", "status", "created_at", "updated_at"]
        read_only_fields = ["created_at", "updated_at"]

    def create(self, validated_data):
        # Set reporter to the requesting user if not provided
        # Note: CurrentUserDefault requires context, simpler to handle in view or set explicitly
        # if 'reporter' not in validated_data and self.context["request"].user.is_authenticated:
        #     validated_data['reporter'] = self.context["request"].user
        return super().create(validated_data)

# CustomUser import moved to the top

