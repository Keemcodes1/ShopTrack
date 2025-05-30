from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Category, Tag, Post

CustomUser = get_user_model()

class BlogModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.author = CustomUser.objects.create_user(username="blogauthor", email="blogauthor@example.com", password="password123", is_staff=True)
        cls.category = Category.objects.create(name="Tech News", slug="tech-news")
        cls.tag1 = Tag.objects.create(name="Django", slug="django")
        cls.tag2 = Tag.objects.create(name="Python", slug="python")

    def test_category_creation(self):
        self.assertEqual(self.category.name, "Tech News")
        self.assertEqual(self.category.slug, "tech-news")

    def test_tag_creation(self):
        self.assertEqual(self.tag1.name, "Django")
        self.assertEqual(self.tag1.slug, "django")

    def test_post_creation(self):
        post = Post.objects.create(
            title="New Django Release",
            slug="new-django-release",
            author=self.author,
            content="Django 5.3 has been released!",
            category=self.category,
            status="PUBLISHED"
        )
        post.tags.add(self.tag1, self.tag2)

        self.assertEqual(post.title, "New Django Release")
        self.assertEqual(post.author, self.author)
        self.assertEqual(post.category, self.category)
        self.assertEqual(post.status, "PUBLISHED")
        self.assertEqual(post.tags.count(), 2)
        self.assertIn(self.tag1, post.tags.all())
        self.assertIn(self.tag2, post.tags.all())

    def test_post_draft_status(self):
        post = Post.objects.create(
            title="Draft Post",
            slug="draft-post",
            author=self.author,
            content="This is just a draft.",
            category=self.category,
            status="DRAFT" # Explicitly set to DRAFT
        )
        self.assertEqual(post.status, "DRAFT")

# Add API tests later using APIClient

