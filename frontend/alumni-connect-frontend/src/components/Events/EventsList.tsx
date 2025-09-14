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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import {
  Search,
  Event,
  LocationOn,
  CalendarToday,
  People,
  Add,
  Edit,
  Delete,
  PersonAdd,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { eventAPI } from '../../services/api';
import { Event as EventType, EventRegistration } from '../../types';
import EventForm from './EventForm';

const EventsList: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState<EventType[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false);
  const [eventFormOpen, setEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter === 'upcoming') {
      filtered = filtered.filter((event) => new Date(event.date) > new Date());
    } else if (statusFilter === 'past') {
      filtered = filtered.filter((event) => new Date(event.date) <= new Date());
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, statusFilter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventAPI.getEvents();
      setEvents(data);
    } catch (err) {
      setError('Failed to load events');
      console.error('Events error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setEventFormOpen(true);
  };

  const handleEditEvent = (event: EventType) => {
    setEditingEvent(event);
    setEventFormOpen(true);
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventAPI.deleteEvent(eventId);
        fetchEvents();
      } catch (err) {
        setError('Failed to delete event');
      }
    }
  };

  const handleRegisterForEvent = async (eventId: number) => {
    try {
      await eventAPI.registerForEvent(eventId);
      fetchEvents();
    } catch (err) {
      setError('Failed to register for event');
    }
  };

  const handleViewEventDetails = async (event: EventType) => {
    setSelectedEvent(event);
    setEventDetailsOpen(true);
    try {
      const registrations = await eventAPI.getUserEventRegistrations();
      setRegistrations(registrations.filter(reg => reg.event.id === event.id));
    } catch (err) {
      console.error('Failed to load registrations:', err);
    }
  };

  const handleCloseEventForm = () => {
    setEventFormOpen(false);
    setEditingEvent(null);
    fetchEvents();
  };

  const isEventUpcoming = (event: EventType) => new Date(event.date) > new Date();
  const isUserRegistered = (event: EventType) => {
    return registrations.some(reg => reg.event.id === event.id);
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
            Events
          </Typography>
          {isAuthenticated && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateEvent}
            >
              Create Event
            </Button>
          )}
        </Box>
        <Typography variant="body1" color="text.secondary">
          Discover and join upcoming alumni events
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
                placeholder="Search events..."
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
                  <MenuItem value="all">All Events</MenuItem>
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="past">Past</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <Grid container spacing={3}>
        {filteredEvents.map((event) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={event.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <Event />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="h2">
                      {event.title}
                    </Typography>
                    <Chip
                      label={isEventUpcoming(event) ? 'Upcoming' : 'Past'}
                      color={isEventUpcoming(event) ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {event.description.length > 100
                    ? `${event.description.substring(0, 100)}...`
                    : event.description}
                </Typography>

                <List dense>
                  <ListItem disablePadding>
                    <ListItemAvatar sx={{ minWidth: 32 }}>
                      <CalendarToday fontSize="small" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={new Date(event.date).toLocaleDateString()}
                      secondary={new Date(event.date).toLocaleTimeString()}
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemAvatar sx={{ minWidth: 32 }}>
                      <LocationOn fontSize="small" />
                    </ListItemAvatar>
                    <ListItemText primary={event.location} />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemAvatar sx={{ minWidth: 32 }}>
                      <People fontSize="small" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${event.registrations_count} registrations`}
                    />
                  </ListItem>
                </List>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => handleViewEventDetails(event)}
                >
                  View Details
                </Button>
                {isAuthenticated && isEventUpcoming(event) && (
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<PersonAdd />}
                    onClick={() => handleRegisterForEvent(event.id)}
                    disabled={isUserRegistered(event)}
                  >
                    {isUserRegistered(event) ? 'Registered' : 'Register'}
                  </Button>
                )}
                {user?.role === 'admin' && (
                  <>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleEditEvent(event)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredEvents.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No events found matching your criteria
          </Typography>
        </Box>
      )}

      {/* Event Details Dialog */}
      <Dialog open={eventDetailsOpen} onClose={() => setEventDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedEvent?.title}
        </DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Box>
              <Typography variant="body1" paragraph>
                {selectedEvent.description}
              </Typography>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <CalendarToday />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Date & Time"
                    secondary={`${new Date(selectedEvent.date).toLocaleDateString()} at ${new Date(selectedEvent.date).toLocaleTimeString()}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <LocationOn />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Location"
                    secondary={selectedEvent.location}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <People />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Registrations"
                    secondary={`${selectedEvent.registrations_count} people registered`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <PersonAdd />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Created by"
                    secondary={`${selectedEvent.created_by.first_name} ${selectedEvent.created_by.last_name}`}
                  />
                </ListItem>
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEventDetailsOpen(false)}>Close</Button>
          {isAuthenticated && selectedEvent && isEventUpcoming(selectedEvent) && (
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => handleRegisterForEvent(selectedEvent.id)}
              disabled={isUserRegistered(selectedEvent)}
            >
              {isUserRegistered(selectedEvent) ? 'Registered' : 'Register'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Event Form Dialog */}
      <EventForm
        open={eventFormOpen}
        onClose={handleCloseEventForm}
        event={editingEvent}
      />
    </Container>
  );
};

export default EventsList;

