from django.urls import path
from .views import DashboardStatsAPIView, SalesOverviewAPIView

urlpatterns = [
    path("dashboard-stats/", DashboardStatsAPIView.as_view(), name="dashboard_stats"),
    path("sales-overview/", SalesOverviewAPIView.as_view(), name="sales_overview"),
    # Add more report/analytics endpoints here as needed
]

