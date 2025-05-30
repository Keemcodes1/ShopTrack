from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Ticket, TicketComment
from pos.models import Business # Assuming tickets can relate to a business

CustomUser = get_user_model()

class TicketModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.reporter = CustomUser.objects.create_user(username="reporter_user", email="reporter@example.com", password="password123")
        cls.assignee = CustomUser.objects.create_user(username="staff_user", email="staff@example.com", password="password123", is_staff=True)
        cls.owner = CustomUser.objects.create_user(username="owner_user", email="owner@example.com", password="password123")
        cls.business = Business.objects.create(name="Test Biz", owner=cls.owner)

        cls.ticket = Ticket.objects.create(
            reporter=cls.reporter,
            subject="System Issue",
            description="The POS system is lagging during peak hours.",
            priority="HIGH",
            related_business=cls.business
        )

    def test_ticket_creation(self):
        self.assertEqual(self.ticket.reporter, self.reporter)
        self.assertEqual(self.ticket.subject, "System Issue")
        self.assertEqual(self.ticket.priority, "HIGH")
        self.assertEqual(self.ticket.status, "OPEN") # Default status
        self.assertEqual(self.ticket.related_business, self.business)
        self.assertIsNone(self.ticket.assignee)

    def test_ticket_assignment(self):
        self.ticket.assignee = self.assignee
        self.ticket.save()
        self.assertEqual(self.ticket.assignee, self.assignee)

    def test_ticket_status_change(self):
        self.ticket.status = "IN_PROGRESS"
        self.ticket.save()
        self.assertEqual(self.ticket.status, "IN_PROGRESS")

    def test_ticket_comment_creation(self):
        comment = TicketComment.objects.create(
            ticket=self.ticket,
            author=self.assignee,
            comment="I am looking into this issue."
        )
        self.assertEqual(comment.ticket, self.ticket)
        self.assertEqual(comment.author, self.assignee)
        self.assertEqual(comment.comment, "I am looking into this issue.")
        self.assertEqual(self.ticket.comments.count(), 1)

# Add API tests later using APIClient

