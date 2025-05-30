from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser # Reports usually require admin/staff access
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum, Count, Q
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth, TruncYear

from pos.models import Transaction, Business
from accounts.models import CustomUser
from tickets.models import Ticket

# Helper function to get start date based on period
def get_start_date(period):
    now = timezone.now()
    if period == "week":
        start_date = now - timedelta(days=now.weekday())
    elif period == "month":
        start_date = now.replace(day=1)
    elif period == "year":
        start_date = now.replace(month=1, day=1)
    else: # Default to month
        start_date = now.replace(day=1)
    return start_date.replace(hour=0, minute=0, second=0, microsecond=0)

# Function to get sales data with actual aggregation
def get_sales_data(period):
    now = timezone.now()
    queryset = Transaction.objects.all()
    
    if period == "week":
        start_of_week = now - timedelta(days=now.weekday())
        end_of_week = start_of_week + timedelta(days=7)
        queryset = queryset.filter(timestamp__gte=start_of_week, timestamp__lt=end_of_week)
        trunc_func = TruncDay("timestamp")
        date_format = "%a" # Format as day abbreviation (Mon, Tue, etc.)
        labels = [(start_of_week + timedelta(days=i)).strftime(date_format) for i in range(7)]
    elif period == "month":
        start_of_year = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
        queryset = queryset.filter(timestamp__gte=start_of_year)
        trunc_func = TruncMonth("timestamp")
        date_format = "%b" # Format as month abbreviation (Jan, Feb, etc.)
        labels = [(start_of_year + timedelta(days=31*i)).strftime(date_format) for i in range(now.month)] # Approximate labels
    elif period == "year":
        # Aggregate by month for the current year
        start_of_year = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
        queryset = queryset.filter(timestamp__gte=start_of_year)
        trunc_func = TruncMonth("timestamp")
        date_format = "%Y-%m" # Format as YYYY-MM
        labels = [(start_of_year + timedelta(days=31*i)).strftime(date_format) for i in range(now.month)] # Approximate labels
    else:
        # Default to month view for current year
        start_of_year = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
        queryset = queryset.filter(timestamp__gte=start_of_year)
        trunc_func = TruncMonth("timestamp")
        date_format = "%b"
        labels = [(start_of_year + timedelta(days=31*i)).strftime(date_format) for i in range(now.month)]

    sales_by_period = queryset.annotate(period_group=trunc_func)\
                              .values("period_group")\
                              .annotate(total=Sum("amount"))\
                              .order_by("period_group")

    # Create a dictionary for quick lookup
    sales_dict = {item["period_group"].strftime(date_format): item["total"] for item in sales_by_period}
    
    # Ensure all labels have a value (0 if no sales)
    data = [sales_dict.get(label, 0) for label in labels]
    
    # Adjust labels for week/year if needed based on actual data points
    if period == "week" or period == "year":
        actual_labels = [item["period_group"].strftime(date_format) for item in sales_by_period]
        # Rebuild labels and data based on actual results if they differ significantly
        # For simplicity, we use the pre-generated labels for now
        pass 

    return {"labels": labels, "data": data}

class DashboardStatsAPIView(APIView):
    """
    Provides key statistics for the main dashboard overview.
    """
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        now = timezone.now()

        # Total Sales
        this_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        # Calculate the first day of the previous month
        last_month_end = this_month_start - timedelta(microseconds=1)
        last_month_start = last_month_end.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        total_sales_this_month = Transaction.objects.filter(timestamp__gte=this_month_start).aggregate(Sum("amount"))["amount__sum"] or 0
        total_sales_last_month = Transaction.objects.filter(timestamp__gte=last_month_start, timestamp__lt=this_month_start).aggregate(Sum("amount"))["amount__sum"] or 0
        sales_percentage_change = ((total_sales_this_month - total_sales_last_month) / total_sales_last_month * 100) if total_sales_last_month else (100 if total_sales_this_month > 0 else 0)

        # Active Users (Consider users active in the last 30 days, or simply is_active=True)
        thirty_days_ago = now - timedelta(days=30)
        # active_users_total = CustomUser.objects.filter(last_login__gte=thirty_days_ago).count() # Example: Active if logged in recently
        active_users_total = CustomUser.objects.filter(is_active=True).count() # Simpler: Count all active accounts
        
        one_week_ago = now - timedelta(days=7)
        new_users_this_week = CustomUser.objects.filter(date_joined__gte=one_week_ago).count()

        # Open Tickets
        open_tickets_count = Ticket.objects.filter(status="OPEN").count()
        high_priority_tickets_count = Ticket.objects.filter(status="OPEN", priority="HIGH").count()

        # POS Transactions
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        total_transactions = Transaction.objects.count()
        today_transactions = Transaction.objects.filter(timestamp__gte=today_start).count()

        # --- Prepare Response ---
        data = {
            "total_sales": {
                "value": total_sales_this_month,
                "change_percent": round(sales_percentage_change, 2)
            },
            "active_users": {
                "value": active_users_total,
                "new_this_week": new_users_this_week
            },
            "open_tickets": {
                "value": open_tickets_count,
                "high_priority": high_priority_tickets_count
            },
            "pos_transactions": {
                "value": total_transactions,
                "today": today_transactions
            }
        }
        return Response(data)

class SalesOverviewAPIView(APIView):
    """
    Provides data for the Sales Overview graph.
    Accepts a \'period\' query parameter (week, month, year).
    """
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        period = request.query_params.get("period", "month").lower()
        if period not in ["week", "month", "year"]:
            period = "month"
        
        sales_data = get_sales_data(period) # Use actual aggregation function
        return Response(sales_data)

# Note: Recent Activities are likely handled by the ActivityLogViewSet endpoint already created.

