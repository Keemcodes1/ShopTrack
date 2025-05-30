from django.db import models
from django.conf import settings
from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Post(models.Model):
    STATUS_CHOICES = [
        ("DRAFT", "Draft"),
        ("PUBLISHED", "Published"),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="DRAFT")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="posts")
    tags = models.ManyToManyField(Tag, blank=True, related_name="posts")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        # Handle potential slug conflicts if needed
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ("-created_at",)

# Optional: Blog comments if needed, similar to TicketComment
# class BlogComment(models.Model):
#     post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
#     author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
#     comment = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)
#     is_approved = models.BooleanField(default=True) # Optional moderation
#
#     class Meta:
#         ordering = ("created_at",)
#
#     def __str__(self):
#         return f"Comment by {self.author} on Post \"{self.post.title}\""

