from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Business, Transaction, Complaint
from decimal import Decimal

CustomUser = get_user_model()

class POSModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        cls.owner = CustomUser.objects.create_user(username="testowner", email="owner@example.com", password="password123")
        cls.reporter = CustomUser.objects.create_user(username="testreporter", email="reporter@example.com", password="password123")
        cls.business = Business.objects.create(
            name="Test Cafe",
            owner=cls.owner,
            # Removed description field as it does not exist in the model
            address="123 Test St",
            contact_email="cafe@example.com"
        )

    def test_business_creation(self):
        self.assertEqual(self.business.name, "Test Cafe")
        self.assertEqual(self.business.owner, self.owner)
        self.assertTrue(self.business.is_active)

    def test_transaction_creation(self):
        transaction = Transaction.objects.create(
            business=self.business,
            amount=Decimal("25.50"),
            # transaction_type="SALE", # Removed as it's not in the model
            description="Coffee and cake"
        )
        self.assertEqual(transaction.business, self.business)
        self.assertEqual(transaction.amount, Decimal("25.50"))
        # self.assertEqual(transaction.transaction_type, "SALE") # Removed test for non-existent field

    def test_complaint_creation(self):
        complaint = Complaint.objects.create(
            business=self.business,
            reporter=self.reporter,
            subject="Cold Coffee",
            description="The coffee served was cold.",
            status="OPEN"
        )
        self.assertEqual(complaint.business, self.business)
        self.assertEqual(complaint.reporter, self.reporter)
        self.assertEqual(complaint.subject, "Cold Coffee")
        self.assertEqual(complaint.status, "OPEN")

# Add API tests later using APIClient

