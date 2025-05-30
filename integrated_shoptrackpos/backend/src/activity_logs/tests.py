from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import ActivityLog

CustomUser = get_user_model()

class ActivityLogModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.user = CustomUser.objects.create_user(username="testlogger", email="logger@example.com", password="password123")

    def test_activity_log_creation(self):
        log = ActivityLog.objects.create(
            actor=self.user, # Changed from user to actor
            verb="USER_LOGIN", # Changed from action_type to verb
            details={"message": "User logged in successfully."} # Changed from details string to JSON field
        )
        self.assertEqual(log.actor, self.user)
        self.assertEqual(log.verb, "USER_LOGIN")
        self.assertEqual(log.details, {"message": "User logged in successfully."}) # Check JSON details
        self.assertIsNotNone(log.timestamp)

# Add API tests later using APIClient

