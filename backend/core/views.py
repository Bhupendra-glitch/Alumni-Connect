from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.db.models import Q
from .models import User, Event, EventRegistration, MentorshipRequest, JobPosting, FundraisingCampaign, Donation
from .serializers import (
    UserSerializer, UserRegistrationSerializer, LoginSerializer,
    EventSerializer, EventRegistrationSerializer, MentorshipRequestSerializer,
    JobPostingSerializer, FundraisingCampaignSerializer, DonationSerializer
)

# Authentication Views
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout(request):
    try:
        request.user.auth_token.delete()
        return Response({'message': 'Successfully logged out'})
    except:
        return Response({'error': 'Error logging out'}, status=status.HTTP_400_BAD_REQUEST)

# User Views
class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def alumni_list(request):
    alumni = User.objects.filter(role='alumni')
    serializer = UserSerializer(alumni, many=True)
    return Response(serializer.data)

# Event Views
class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def register_for_event(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
        registration, created = EventRegistration.objects.get_or_create(
            event=event,
            user=request.user
        )
        if created:
            return Response({'message': 'Successfully registered for event'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Already registered for this event'}, status=status.HTTP_400_BAD_REQUEST)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_event_registrations(request):
    registrations = EventRegistration.objects.filter(user=request.user)
    serializer = EventRegistrationSerializer(registrations, many=True)
    return Response(serializer.data)

# Mentorship Views
class MentorshipRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = MentorshipRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MentorshipRequest.objects.filter(
            Q(mentor=self.request.user) | Q(mentee=self.request.user)
        )

    def perform_create(self, serializer):
        serializer.save(mentee=self.request.user)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def respond_to_mentorship_request(request, request_id, action):
    try:
        mentorship_request = MentorshipRequest.objects.get(id=request_id, mentor=request.user)
        if action in ['accept', 'reject']:
            mentorship_request.status = 'accepted' if action == 'accept' else 'rejected'
            mentorship_request.save()
            return Response({'message': f'Mentorship request {action}ed'})
        else:
            return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
    except MentorshipRequest.DoesNotExist:
        return Response({'error': 'Mentorship request not found'}, status=status.HTTP_404_NOT_FOUND)

# Job Posting Views
class JobPostingListCreateView(generics.ListCreateAPIView):
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)

class JobPostingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer
    permission_classes = [permissions.IsAuthenticated]

# Fundraising Views
class FundraisingCampaignListCreateView(generics.ListCreateAPIView):
    queryset = FundraisingCampaign.objects.all()
    serializer_class = FundraisingCampaignSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class FundraisingCampaignDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FundraisingCampaign.objects.all()
    serializer_class = FundraisingCampaignSerializer
    permission_classes = [permissions.IsAuthenticated]

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def make_donation(request, campaign_id):
    try:
        campaign = FundraisingCampaign.objects.get(id=campaign_id)
        amount = request.data.get('amount')
        message = request.data.get('message', '')
        
        if not amount or float(amount) <= 0:
            return Response({'error': 'Invalid donation amount'}, status=status.HTTP_400_BAD_REQUEST)
        
        donation = Donation.objects.create(
            donor=request.user,
            campaign=campaign,
            amount=amount,
            message=message
        )
        
        # Update campaign raised amount
        campaign.raised_amount += float(amount)
        campaign.save()
        
        serializer = DonationSerializer(donation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except FundraisingCampaign.DoesNotExist:
        return Response({'error': 'Campaign not found'}, status=status.HTTP_404_NOT_FOUND)
    except ValueError:
        return Response({'error': 'Invalid amount format'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def campaign_donations(request, campaign_id):
    try:
        campaign = FundraisingCampaign.objects.get(id=campaign_id)
        donations = Donation.objects.filter(campaign=campaign)
        serializer = DonationSerializer(donations, many=True)
        return Response(serializer.data)
    except FundraisingCampaign.DoesNotExist:
        return Response({'error': 'Campaign not found'}, status=status.HTTP_404_NOT_FOUND)

