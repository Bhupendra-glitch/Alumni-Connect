from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/logout/', views.logout, name='logout'),
    
    # Users
    path('users/', views.UserListCreateView.as_view(), name='user-list'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
    path('alumni/', views.alumni_list, name='alumni-list'),
    
    # Events
    path('events/', views.EventListCreateView.as_view(), name='event-list'),
    path('events/<int:pk>/', views.EventDetailView.as_view(), name='event-detail'),
    path('events/<int:event_id>/register/', views.register_for_event, name='register-event'),
    path('user/event-registrations/', views.user_event_registrations, name='user-event-registrations'),
    
    # Mentorship
    path('mentorship-requests/', views.MentorshipRequestListCreateView.as_view(), name='mentorship-request-list'),
    path('mentorship-requests/<int:request_id>/<str:action>/', views.respond_to_mentorship_request, name='respond-mentorship'),
    
    # Job Postings
    path('jobs/', views.JobPostingListCreateView.as_view(), name='job-list'),
    path('jobs/<int:pk>/', views.JobPostingDetailView.as_view(), name='job-detail'),
    
    # Fundraising
    path('campaigns/', views.FundraisingCampaignListCreateView.as_view(), name='campaign-list'),
    path('campaigns/<int:pk>/', views.FundraisingCampaignDetailView.as_view(), name='campaign-detail'),
    path('campaigns/<int:campaign_id>/donate/', views.make_donation, name='make-donation'),
    path('campaigns/<int:campaign_id>/donations/', views.campaign_donations, name='campaign-donations'),
]

