from django.db import models
from django.conf import settings

class Business(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='owned_businesses')
    address = models.TextField(blank=True, null=True)
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=20, blank=True, null=True)
    onboarding_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Transaction(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='transactions')
    timestamp = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    # Add more fields as needed, e.g., payment_method, status, customer_info

    def __str__(self):
        return f'Transaction {self.id} for {self.business.name} - {self.amount}'

class Complaint(models.Model):
    STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('IN_PROGRESS', 'In Progress'),
        ('RESOLVED', 'Resolved'),
        ('CLOSED', 'Closed'),
    ]
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='complaints')
    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='reported_complaints')
    subject = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPEN')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Complaint {self.id} regarding {self.business.name} - {self.subject}'

# Consider adding an OnboardingProcess model if the process is complex
# class OnboardingProcess(models.Model):
#     business = models.OneToOneField(Business, on_delete=models.CASCADE)
#     start_date = models.DateTimeField(auto_now_add=True)
#     completion_date = models.DateTimeField(null=True, blank=True)
#     status = models.CharField(max_length=50) # e.g., 'Pending', 'Documents Submitted', 'Approved'
#     assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

