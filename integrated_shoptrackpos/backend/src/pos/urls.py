from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BusinessViewSet, TransactionViewSet, ComplaintViewSet

router = DefaultRouter()
router.register(r"businesses", BusinessViewSet)
router.register(r"transactions", TransactionViewSet)
router.register(r"complaints", ComplaintViewSet)

urlpatterns = [
    path("", include(router.urls)),
]

