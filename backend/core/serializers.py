from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Event, EventRegistration, MentorshipRequest, JobPosting, FundraisingCampaign, Donation

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'linkedin', 'batch', 'department', 'current_org', 'designation', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'role', 'phone', 'linkedin', 'batch', 'department', 'current_org', 'designation']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Must include username and password')

class EventSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    registrations_count = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'date', 'location', 'created_by', 'registrations_count']
        read_only_fields = ['id', 'created_by']

    def get_registrations_count(self, obj):
        return obj.registrations.count()

class EventRegistrationSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = EventRegistration
        fields = ['id', 'event', 'user', 'registered_at']
        read_only_fields = ['id', 'registered_at']

class MentorshipRequestSerializer(serializers.ModelSerializer):
    mentor = UserSerializer(read_only=True)
    mentee = UserSerializer(read_only=True)

    class Meta:
        model = MentorshipRequest
        fields = ['id', 'mentor', 'mentee', 'message', 'status', 'requested_at']
        read_only_fields = ['id', 'requested_at']

class JobPostingSerializer(serializers.ModelSerializer):
    posted_by = UserSerializer(read_only=True)

    class Meta:
        model = JobPosting
        fields = ['id', 'title', 'description', 'company', 'location', 'posted_by', 'posted_at', 'deadline']
        read_only_fields = ['id', 'posted_by', 'posted_at']

class FundraisingCampaignSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    donations_count = serializers.SerializerMethodField()
    progress_percentage = serializers.SerializerMethodField()

    class Meta:
        model = FundraisingCampaign
        fields = ['id', 'title', 'description', 'goal_amount', 'raised_amount', 'start_date', 'end_date', 'created_by', 'donations_count', 'progress_percentage']
        read_only_fields = ['id', 'created_by', 'raised_amount']

    def get_donations_count(self, obj):
        return obj.donations.count()

    def get_progress_percentage(self, obj):
        if obj.goal_amount > 0:
            return round((obj.raised_amount / obj.goal_amount) * 100, 2)
        return 0

class DonationSerializer(serializers.ModelSerializer):
    donor = UserSerializer(read_only=True)
    campaign = FundraisingCampaignSerializer(read_only=True)

    class Meta:
        model = Donation
        fields = ['id', 'donor', 'campaign', 'amount', 'date', 'message']
        read_only_fields = ['id', 'donor', 'date']

