from django.test import TestCase
from django.contrib.auth import get_user_model

CustomUser = get_user_model()

class UserModelTest(TestCase):

    def test_create_user(self):
        user = CustomUser.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpassword123",
            first_name="Test",
            last_name="User"
        )
        self.assertEqual(user.username, "testuser")
        self.assertEqual(user.email, "test@example.com")
        self.assertTrue(user.check_password("testpassword123"))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.is_active)

    def test_create_superuser(self):
        admin_user = CustomUser.objects.create_superuser(
            username="superadmin",
            email="admin@example.com",
            password="adminpassword123"
        )
        self.assertEqual(admin_user.username, "superadmin")
        self.assertEqual(admin_user.email, "admin@example.com")
        self.assertTrue(admin_user.check_password("adminpassword123"))
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)
        self.assertTrue(admin_user.is_active)

# Add API tests later using APIClient

