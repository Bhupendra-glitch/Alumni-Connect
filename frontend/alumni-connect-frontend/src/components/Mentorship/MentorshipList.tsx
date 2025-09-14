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
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Search,
  School,
  Person,
  Message,
  Add,
  CheckCircle,
  Cancel,
  Pending,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { mentorshipAPI, userAPI } from '../../services/api';
import { MentorshipRequest, User } from '../../types';

const MentorshipList: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<MentorshipRequest[]>([]);
  const [alumni, setAlumni] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<MentorshipRequest | null>(null);
  const [requestDetailsOpen, setRequestDetailsOpen] = useState(false);
  const [newRequestOpen, setNewRequestOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = mentorshipRequests;

    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.mentor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.mentor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.mentee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.mentee.last_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  }, [mentorshipRequests, searchTerm, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [requestsData, alumniData] = await Promise.all([
        mentorshipAPI.getMentorshipRequests(),
        userAPI.getAlumni(),
      ]);
      setMentorshipRequests(requestsData);
      setAlumni(alumniData);
    } catch (err) {
      setError('Failed to load mentorship data');
      console.error('Mentorship error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespondToRequest = async (requestId: number, action: 'accept' | 'reject') => {
    try {
      await mentorshipAPI.respondToMentorshipRequest(requestId, action);
      fetchData();
    } catch (err) {
      setError('Failed to respond to mentorship request');
    }
  };

  const handleViewRequestDetails = (request: MentorshipRequest) => {
    setSelectedRequest(request);
    setRequestDetailsOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle />;
      case 'rejected': return <Cancel />;
      case 'pending': return <Pending />;
      default: return <Pending />;
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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Mentorship Program
          </Typography>
          {isAuthenticated && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setNewRequestOpen(true)}
            >
              Request Mentorship
            </Button>
          )}
        </Box>
        <Typography variant="body1" color="text.secondary">
          Connect with experienced alumni for guidance and support
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                placeholder="Search mentorship requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Requests</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="accepted">Accepted</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Mentorship Requests Grid */}
      <Grid container spacing={3}>
        {filteredRequests.map((request) => (
          <Grid size={{ xs: 12, md: 6 }} key={request.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <School />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="h2">
                      {request.mentor.first_name} {request.mentor.last_name}
                    </Typography>
                    <Chip
                      label={request.status}
                      color={getStatusColor(request.status) as any}
                      size="small"
                      icon={getStatusIcon(request.status)}
                    />
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {request.message.length > 100
                    ? `${request.message.substring(0, 100)}...`
                    : request.message}
                </Typography>

                <List dense>
                  <ListItem disablePadding>
                    <ListItemAvatar sx={{ minWidth: 32 }}>
                      <Person fontSize="small" />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Mentee"
                      secondary={`${request.mentee.first_name} ${request.mentee.last_name}`}
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemAvatar sx={{ minWidth: 32 }}>
                      <Message fontSize="small" />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Requested"
                      secondary={new Date(request.requested_at).toLocaleDateString()}
                    />
                  </ListItem>
                </List>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => handleViewRequestDetails(request)}
                >
                  View Details
                </Button>
                {user?.id === request.mentor.id && request.status === 'pending' && (
                  <>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={() => handleRespondToRequest(request.id, 'accept')}
                    >
                      Accept
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      startIcon={<Cancel />}
                      onClick={() => handleRespondToRequest(request.id, 'reject')}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredRequests.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No mentorship requests found matching your criteria
          </Typography>
        </Box>
      )}

      {/* Request Details Dialog */}
      <Dialog open={requestDetailsOpen} onClose={() => setRequestDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Mentorship Request Details
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedRequest.mentor.first_name} {selectedRequest.mentor.last_name}
              </Typography>
              <Typography variant="body1" paragraph>
                {selectedRequest.message}
              </Typography>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Person />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Mentee"
                    secondary={`${selectedRequest.mentee.first_name} ${selectedRequest.mentee.last_name}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Message />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Requested on"
                    secondary={new Date(selectedRequest.requested_at).toLocaleDateString()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    {getStatusIcon(selectedRequest.status)}
                  </ListItemAvatar>
                  <ListItemText
                    primary="Status"
                    secondary={selectedRequest.status}
                  />
                </ListItem>
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRequestDetailsOpen(false)}>Close</Button>
          {user?.id === selectedRequest?.mentor.id && selectedRequest?.status === 'pending' && (
            <>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => handleRespondToRequest(selectedRequest.id, 'accept')}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<Cancel />}
                onClick={() => handleRespondToRequest(selectedRequest.id, 'reject')}
              >
                Reject
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* New Request Dialog */}
      <Dialog open={newRequestOpen} onClose={() => setNewRequestOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Request Mentorship
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Mentorship request form will be implemented soon!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewRequestOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MentorshipList;

