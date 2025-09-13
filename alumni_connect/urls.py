from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from core.views import UserViewSet, EventViewSet, JobPostingViewSet, MentorshipRequestViewSet, FundraisingCampaignViewSet, DonationViewSet


router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'events', EventViewSet)
router.register(r'jobs', JobPostingViewSet)
router.register(r'mentorships', MentorshipRequestViewSet)
router.register(r'campaigns', FundraisingCampaignViewSet)
router.register(r'donations', DonationViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  # All APIs under /api/
]
