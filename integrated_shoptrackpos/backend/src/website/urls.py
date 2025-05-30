from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PageViewSet

router = DefaultRouter()
router.register(r"pages", PageViewSet, basename="page") # Use basename because lookup_field is changed

urlpatterns = [
    path("", include(router.urls)),
]

