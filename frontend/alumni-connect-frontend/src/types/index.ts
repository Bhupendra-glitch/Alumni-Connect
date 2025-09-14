export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'alumni' | 'student' | 'admin';
  phone?: string;
  linkedin?: string;
  batch?: string;
  department?: string;
  current_org?: string;
  designation?: string;
  date_joined: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  created_by: User;
  registrations_count: number;
}

export interface EventRegistration {
  id: number;
  event: Event;
  user: User;
  registered_at: string;
}

export interface MentorshipRequest {
  id: number;
  mentor: User;
  mentee: User;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  requested_at: string;
}

export interface JobPosting {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  posted_by: User;
  posted_at: string;
  deadline?: string;
}

export interface FundraisingCampaign {
  id: number;
  title: string;
  description: string;
  goal_amount: number;
  raised_amount: number;
  start_date: string;
  end_date: string;
  created_by: User;
  donations_count: number;
  progress_percentage: number;
}

export interface Donation {
  id: number;
  donor: User;
  campaign: FundraisingCampaign;
  amount: number;
  date: string;
  message?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  role: 'alumni' | 'student' | 'admin';
  phone?: string;
  linkedin?: string;
  batch?: string;
  department?: string;
  current_org?: string;
  designation?: string;
}
