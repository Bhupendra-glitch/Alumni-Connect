import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People,
  Event,
  Work,
  AttachMoney,
  TrendingUp,
  PersonAdd,
  CalendarToday,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI, eventAPI, jobAPI, fundraisingAPI } from '../../services/api';
import { User, Event as EventType, JobPosting, FundraisingCampaign } from '../../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAlumni: 0,
    upcomingEvents: 0,
    activeJobs: 0,
    activeCampaigns: 0,
  });
  const [recentAlumni, setRecentAlumni] = useState<User[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventType[]>([]);
  const [recentJobs, setRecentJobs] = useState<JobPosting[]>([]);
  const [activeCampaigns, setActiveCampaigns] = useState<FundraisingCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [alumniData, eventsData, jobsData, campaignsData] = await Promise.all([
          userAPI.getAlumni(),
          eventAPI.getEvents(),
          jobAPI.getJobs(),
          fundraisingAPI.getCampaigns(),
        ]);

        setRecentAlumni(alumniData.slice(0, 5));
        setUpcomingEvents(eventsData.slice(0, 3));
        setRecentJobs(jobsData.slice(0, 3));
        setActiveCampaigns(campaignsData.slice(0, 3));

        setStats({
          totalAlumni: alumniData.length,
          upcomingEvents: eventsData.length,
          activeJobs: jobsData.length,
          activeCampaigns: campaignsData.length,
        });
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'alumni': return 'primary';
      case 'student': return 'secondary';
      case 'admin': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          {getGreeting()}, {user?.first_name}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to your Alumni Connect dashboard. Here's what's happening in your community.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.totalAlumni}
                  </Typography>
                  <Typography color="text.secondary">
                    Alumni Members
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <Event />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.upcomingEvents}
                  </Typography>
                  <Typography color="text.secondary">
                    Upcoming Events
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <Work />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.activeJobs}
                  </Typography>
                  <Typography color="text.secondary">
                    Active Jobs
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.activeCampaigns}
                  </Typography>
                  <Typography color="text.secondary">
                    Fundraising Campaigns
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Alumni */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" component="h2">
                  Recent Alumni
                </Typography>
                <Button size="small" startIcon={<PersonAdd />}>
                  View All
                </Button>
              </Box>
              <List>
                {recentAlumni.map((alumni) => (
                  <ListItem key={alumni.id} divider>
                    <ListItemAvatar>
                      <Avatar>
                        {alumni.first_name[0]}{alumni.last_name[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${alumni.first_name} ${alumni.last_name}`}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {alumni.designation} at {alumni.current_org}
                          </Typography>
                          <Chip
                            label={alumni.role}
                            size="small"
                            color={getRoleColor(alumni.role) as any}
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" component="h2">
                  Upcoming Events
                </Typography>
                <Button size="small" startIcon={<CalendarToday />}>
                  View All
                </Button>
              </Box>
              <List>
                {upcomingEvents.map((event) => (
                  <ListItem key={event.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        <Event />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={event.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(event.date).toLocaleDateString()} at {event.location}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {event.registrations_count} registrations
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Jobs */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" component="h2">
                  Recent Job Postings
                </Typography>
                <Button size="small" startIcon={<Work />}>
                  View All
                </Button>
              </Box>
              <List>
                {recentJobs.map((job) => (
                  <ListItem key={job.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'success.main' }}>
                        <Work />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={job.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {job.company} • {job.location}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Posted {new Date(job.posted_at).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Campaigns */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" component="h2">
                  Active Fundraising
                </Typography>
                <Button size="small" startIcon={<TrendingUp />}>
                  View All
                </Button>
              </Box>
              <List>
                {activeCampaigns.map((campaign) => (
                  <ListItem key={campaign.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'warning.main' }}>
                        <AttachMoney />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={campaign.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            ${campaign.raised_amount.toLocaleString()} raised of ${campaign.goal_amount.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {campaign.progress_percentage}% complete
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;

