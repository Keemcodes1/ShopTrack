from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    
    # JWT Token Endpoints
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),

    # App API URLs
    path("api/accounts/", include("accounts.urls")),
    path("api/pos/", include("pos.urls")),
    path("api/activity_logs/", include("activity_logs.urls")),
    path("api/tickets/", include("tickets.urls")),
    path("api/website/", include("website.urls")),
    path("api/blog/", include("blog.urls")),
    path("api/reports/", include("reports.urls")),

    # Include DRF browsable API urls (optional, useful for development)
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    
    # Serve frontend - catch all other routes
    re_path(r"^.*$", TemplateView.as_view(template_name="index.html")),
]

# Serve media and static files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

