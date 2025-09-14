import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  People,
  Event,
  Work,
  AttachMoney,
  TrendingUp,
  AdminPanelSettings,
  PersonAdd,
  EventNote,
  WorkOutline,
  Money,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI, eventAPI, jobAPI, fundraisingAPI } from '../../services/api';
import { User, Event as EventType, JobPosting, FundraisingCampaign } from '../../types';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAlumni: 0,
    totalStudents: 0,
    totalEvents: 0,
    totalJobs: 0,
    totalCampaigns: 0,
    totalDonations: 0,
  });
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentEvents, setRecentEvents] = useState<EventType[]>([]);
  const [recentJobs, setRecentJobs] = useState<JobPosting[]>([]);
  const [recentCampaigns, setRecentCampaigns] = useState<FundraisingCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (user?.role !== 'admin') {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
      return;
    }

    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersData, alumniData, eventsData, jobsData, campaignsData] = await Promise.all([
        userAPI.getUsers(),
        userAPI.getAlumni(),
        eventAPI.getEvents(),
        jobAPI.getJobs(),
        fundraisingAPI.getCampaigns(),
      ]);

      const students = usersData.filter(user => user.role === 'student');
      const alumni = usersData.filter(user => user.role === 'alumni');

      setRecentUsers(usersData.slice(0, 5));
      setRecentEvents(eventsData.slice(0, 5));
      setRecentJobs(jobsData.slice(0, 5));
      setRecentCampaigns(campaignsData.slice(0, 5));

      setStats({
        totalUsers: usersData.length,
        totalAlumni: alumni.length,
        totalStudents: students.length,
        totalEvents: eventsData.length,
        totalJobs: jobsData.length,
        totalCampaigns: campaignsData.length,
        totalDonations: campaignsData.reduce((sum, campaign) => sum + campaign.donations_count, 0),
      });
    } catch (err) {
      setError('Failed to load admin data');
      console.error('Admin dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'alumni': return 'primary';
      case 'student': return 'secondary';
      case 'admin': return 'error';
      default: return 'default';
    }
  };

  if (user?.role !== 'admin') {
    return (
      <Container maxWidth="lg">
        <Box textAlign="center" py={8}>
          <AdminPanelSettings sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" color="text.secondary">
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Admin privileges required to access this page.
          </Typography>
        </Box>
      </Container>
    );
  }

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
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and monitor the Alumni Connect platform
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
                    {stats.totalUsers}
                  </Typography>
                  <Typography color="text.secondary">
                    Total Users
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
                  <PersonAdd />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.totalAlumni}
                  </Typography>
                  <Typography color="text.secondary">
                    Alumni
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
                  <EventNote />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.totalEvents}
                  </Typography>
                  <Typography color="text.secondary">
                    Events
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
                  <Money />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.totalDonations}
                  </Typography>
                  <Typography color="text.secondary">
                    Donations
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Users */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Recent Users
              </Typography>
              <List>
                {recentUsers.map((user) => (
                  <ListItem key={user.id} divider>
                    <ListItemAvatar>
                      <Avatar>
                        {user.first_name[0]}{user.last_name[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${user.first_name} ${user.last_name}`}
                      secondary={user.email}
                    />
                    <Chip
                      label={user.role}
                      size="small"
                      color={getRoleColor(user.role) as any}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Events */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Recent Events
              </Typography>
              <List>
                {recentEvents.map((event) => (
                  <ListItem key={event.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        <EventNote />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={event.title}
                      secondary={`${event.registrations_count} registrations`}
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
              <Typography variant="h6" component="h2" gutterBottom>
                Recent Job Postings
              </Typography>
              <List>
                {recentJobs.map((job) => (
                  <ListItem key={job.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'success.main' }}>
                        <WorkOutline />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={job.title}
                      secondary={job.company}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Campaigns */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Recent Fundraising Campaigns
              </Typography>
              <List>
                {recentCampaigns.map((campaign) => (
                  <ListItem key={campaign.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'warning.main' }}>
                        <AttachMoney />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={campaign.title}
                      secondary={`$${campaign.raised_amount.toLocaleString()} raised`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<PersonAdd />}
              onClick={() => alert('User management coming soon!')}
            >
              Manage Users
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<EventNote />}
              onClick={() => alert('Event management coming soon!')}
            >
              Manage Events
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<WorkOutline />}
              onClick={() => alert('Job management coming soon!')}
            >
              Manage Jobs
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Money />}
              onClick={() => alert('Campaign management coming soon!')}
            >
              Manage Campaigns
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminDashboard;

