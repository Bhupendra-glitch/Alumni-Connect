# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser

# Custom User model (for Alumni, Students, Admins)
class User(AbstractUser):
    ROLE_CHOICES = (
        ('alumni', 'Alumni'),
        ('student', 'Student'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    phone = models.CharField(max_length=15, blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    batch = models.CharField(max_length=20, blank=True, null=True)
    department = models.CharField(max_length=50, blank=True, null=True)
    current_org = models.CharField(max_length=100, blank=True, null=True)
    designation = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"


class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateTimeField()
    location = models.CharField(max_length=200)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="events")

    def __str__(self):
        return self.title


class EventRegistration(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="registrations")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="event_registrations")
    registered_at = models.DateTimeField(auto_now_add=True)


class MentorshipRequest(models.Model):
    mentor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="mentorships_as_mentor")
    mentee = models.ForeignKey(User, on_delete=models.CASCADE, related_name="mentorships_as_mentee")
    message = models.TextField()
    status = models.CharField(max_length=20, choices=[('pending','Pending'),('accepted','Accepted'),('rejected','Rejected')], default='pending')
    requested_at = models.DateTimeField(auto_now_add=True)


class JobPosting(models.Model):
    posted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="job_posts")
    title = models.CharField(max_length=200)
    description = models.TextField()
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    posted_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} - {self.company}"
    

class FundraisingCampaign(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    goal_amount = models.DecimalField(max_digits=12, decimal_places=2)
    raised_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    start_date = models.DateField()
    end_date = models.DateField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

class Donation(models.Model):
    donor = models.ForeignKey(User, on_delete=models.CASCADE)
    campaign = models.ForeignKey(FundraisingCampaign, on_delete=models.CASCADE, related_name="donations")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    message = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.donor.username} - {self.amount}"