from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Page

CustomUser = get_user_model()

class WebsiteModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.author = CustomUser.objects.create_user(username="webauthor", email="webauthor@example.com", password="password123", is_staff=True)

    def test_page_creation(self):
        page = Page.objects.create(
            title="About Us",
            slug="about-us",
            content="This is the about page content.",
            author=self.author,
            is_published=True
        )
        self.assertEqual(page.title, "About Us")
        self.assertEqual(page.slug, "about-us")
        self.assertEqual(page.author, self.author)
        self.assertTrue(page.is_published)

    def test_page_unpublished(self):
        page = Page.objects.create(
            title="Draft Page",
            slug="draft-page",
            content="This is a draft.",
            author=self.author,
            is_published=False
        )
        self.assertEqual(page.title, "Draft Page")
        self.assertFalse(page.is_published)

# Add API tests later using APIClient

