from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Event, EventRegistration, MentorshipRequest, JobPosting, FundraisingCampaign, Donation

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'batch', 'department', 'is_active')
    list_filter = ('role', 'department', 'is_active', 'is_staff')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('username',)
    
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('role', 'phone', 'linkedin', 'batch', 'department', 'current_org', 'designation')}),
    )

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'location', 'created_by')
    list_filter = ('date', 'created_by')
    search_fields = ('title', 'description', 'location')

@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = ('event', 'user', 'registered_at')
    list_filter = ('registered_at', 'event__date')

@admin.register(MentorshipRequest)
class MentorshipRequestAdmin(admin.ModelAdmin):
    list_display = ('mentor', 'mentee', 'status', 'requested_at')
    list_filter = ('status', 'requested_at')

@admin.register(JobPosting)
class JobPostingAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'posted_by', 'posted_at', 'deadline')
    list_filter = ('posted_at', 'deadline', 'company')

@admin.register(FundraisingCampaign)
class FundraisingCampaignAdmin(admin.ModelAdmin):
    list_display = ('title', 'goal_amount', 'raised_amount', 'start_date', 'end_date', 'created_by')
    list_filter = ('start_date', 'end_date', 'created_by')

@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ('donor', 'campaign', 'amount', 'date')
    list_filter = ('date', 'campaign')

