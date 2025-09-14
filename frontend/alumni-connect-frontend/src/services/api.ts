import axios from 'axios';
import { 
  User, 
  Event, 
  EventRegistration, 
  MentorshipRequest, 
  JobPosting, 
  FundraisingCampaign, 
  Donation,
  AuthResponse,
  LoginData,
  RegisterData
} from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data: RegisterData): Promise<AuthResponse> =>
    api.post('/auth/register/', data).then(res => res.data),
  
  login: (data: LoginData): Promise<AuthResponse> =>
    api.post('/auth/login/', data).then(res => res.data),
  
  logout: (): Promise<void> =>
    api.post('/auth/logout/').then(res => res.data),
};

// User API
export const userAPI = {
  getUsers: (): Promise<User[]> =>
    api.get('/users/').then(res => res.data),
  
  getUser: (id: number): Promise<User> =>
    api.get(`/users/${id}/`).then(res => res.data),
  
  updateUser: (id: number, data: Partial<User>): Promise<User> =>
    api.patch(`/users/${id}/`, data).then(res => res.data),
  
  getAlumni: (): Promise<User[]> =>
    api.get('/alumni/').then(res => res.data),
};

// Event API
export const eventAPI = {
  getEvents: (): Promise<Event[]> =>
    api.get('/events/').then(res => res.data),
  
  getEvent: (id: number): Promise<Event> =>
    api.get(`/events/${id}/`).then(res => res.data),
  
  createEvent: (data: Omit<Event, 'id' | 'created_by' | 'registrations_count'>): Promise<Event> =>
    api.post('/events/', data).then(res => res.data),
  
  updateEvent: (id: number, data: Partial<Event>): Promise<Event> =>
    api.patch(`/events/${id}/`, data).then(res => res.data),
  
  deleteEvent: (id: number): Promise<void> =>
    api.delete(`/events/${id}/`).then(res => res.data),
  
  registerForEvent: (eventId: number): Promise<{ message: string }> =>
    api.post(`/events/${eventId}/register/`).then(res => res.data),
  
  getUserEventRegistrations: (): Promise<EventRegistration[]> =>
    api.get('/user/event-registrations/').then(res => res.data),
};

// Mentorship API
export const mentorshipAPI = {
  getMentorshipRequests: (): Promise<MentorshipRequest[]> =>
    api.get('/mentorship-requests/').then(res => res.data),
  
  createMentorshipRequest: (data: Omit<MentorshipRequest, 'id' | 'mentee' | 'requested_at'>): Promise<MentorshipRequest> =>
    api.post('/mentorship-requests/', data).then(res => res.data),
  
  respondToMentorshipRequest: (requestId: number, action: 'accept' | 'reject'): Promise<{ message: string }> =>
    api.post(`/mentorship-requests/${requestId}/${action}/`).then(res => res.data),
};

// Job API
export const jobAPI = {
  getJobs: (): Promise<JobPosting[]> =>
    api.get('/jobs/').then(res => res.data),
  
  getJob: (id: number): Promise<JobPosting> =>
    api.get(`/jobs/${id}/`).then(res => res.data),
  
  createJob: (data: Omit<JobPosting, 'id' | 'posted_by' | 'posted_at'>): Promise<JobPosting> =>
    api.post('/jobs/', data).then(res => res.data),
  
  updateJob: (id: number, data: Partial<JobPosting>): Promise<JobPosting> =>
    api.patch(`/jobs/${id}/`, data).then(res => res.data),
  
  deleteJob: (id: number): Promise<void> =>
    api.delete(`/jobs/${id}/`).then(res => res.data),
};

// Fundraising API
export const fundraisingAPI = {
  getCampaigns: (): Promise<FundraisingCampaign[]> =>
    api.get('/campaigns/').then(res => res.data),
  
  getCampaign: (id: number): Promise<FundraisingCampaign> =>
    api.get(`/campaigns/${id}/`).then(res => res.data),
  
  createCampaign: (data: Omit<FundraisingCampaign, 'id' | 'created_by' | 'raised_amount' | 'donations_count' | 'progress_percentage'>): Promise<FundraisingCampaign> =>
    api.post('/campaigns/', data).then(res => res.data),
  
  updateCampaign: (id: number, data: Partial<FundraisingCampaign>): Promise<FundraisingCampaign> =>
    api.patch(`/campaigns/${id}/`, data).then(res => res.data),
  
  deleteCampaign: (id: number): Promise<void> =>
    api.delete(`/campaigns/${id}/`).then(res => res.data),
  
  makeDonation: (campaignId: number, amount: number, message?: string): Promise<Donation> =>
    api.post(`/campaigns/${campaignId}/donate/`, { amount, message }).then(res => res.data),
  
  getCampaignDonations: (campaignId: number): Promise<Donation[]> =>
    api.get(`/campaigns/${campaignId}/donations/`).then(res => res.data),
};

export default api;
