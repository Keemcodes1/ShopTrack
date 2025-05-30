from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, TicketCommentViewSet

router = DefaultRouter()
router.register(r"tickets", TicketViewSet)
# Comments are handled via nested route in TicketViewSet and direct access for RUD
router.register(r"ticket-comments", TicketCommentViewSet)

urlpatterns = [
    path("", include(router.urls)),
]

