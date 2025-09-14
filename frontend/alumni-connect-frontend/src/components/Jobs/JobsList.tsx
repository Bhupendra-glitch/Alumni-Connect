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
} from '@mui/material';
import {
  Search,
  Work,
  LocationOn,
  CalendarToday,
  Person,
  Add,
  Edit,
  Delete,
  Send as Apply,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { jobAPI } from '../../services/api';
import { JobPosting } from '../../types';

const JobsList: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [jobDetailsOpen, setJobDetailsOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await jobAPI.getJobs();
      setJobs(data);
    } catch (err) {
      setError('Failed to load job postings');
      console.error('Jobs error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await jobAPI.deleteJob(jobId);
        fetchJobs();
      } catch (err) {
        setError('Failed to delete job posting');
      }
    }
  };

  const handleViewJobDetails = (job: JobPosting) => {
    setSelectedJob(job);
    setJobDetailsOpen(true);
  };

  const handleApply = (job: JobPosting) => {
    // TODO: Implement job application functionality
    alert('Job application functionality will be implemented soon!');
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
            Job Opportunities
          </Typography>
          {isAuthenticated && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => alert('Job creation form will be implemented soon!')}
            >
              Post a Job
            </Button>
          )}
        </Box>
        <Typography variant="body1" color="text.secondary">
          Discover career opportunities posted by alumni
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search jobs by title, company, or location..."
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
        </CardContent>
      </Card>

      {/* Jobs Grid */}
      <Grid container spacing={3}>
        {filteredJobs.map((job) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={job.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <Work />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="h2">
                      {job.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {job.company}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {job.description.length > 100
                    ? `${job.description.substring(0, 100)}...`
                    : job.description}
                </Typography>

                <List dense>
                  <ListItem disablePadding>
                    <ListItemAvatar sx={{ minWidth: 32 }}>
                      <LocationOn fontSize="small" />
                    </ListItemAvatar>
                    <ListItemText primary={job.location} />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemAvatar sx={{ minWidth: 32 }}>
                      <Person fontSize="small" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`Posted by ${job.posted_by.first_name} ${job.posted_by.last_name}`}
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemAvatar sx={{ minWidth: 32 }}>
                      <CalendarToday fontSize="small" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={new Date(job.posted_at).toLocaleDateString()}
                    />
                  </ListItem>
                </List>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => handleViewJobDetails(job)}
                >
                  View Details
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<Apply />}
                  onClick={() => handleApply(job)}
                >
                  Apply
                </Button>
                {user?.role === 'admin' && (
                  <>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => alert('Edit functionality coming soon!')}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleDeleteJob(job.id)}
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

      {filteredJobs.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No job postings found matching your criteria
          </Typography>
        </Box>
      )}

      {/* Job Details Dialog */}
      <Dialog open={jobDetailsOpen} onClose={() => setJobDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedJob?.title}
        </DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedJob.company}
              </Typography>
              <Typography variant="body1" paragraph>
                {selectedJob.description}
              </Typography>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <LocationOn />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Location"
                    secondary={selectedJob.location}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Person />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Posted by"
                    secondary={`${selectedJob.posted_by.first_name} ${selectedJob.posted_by.last_name}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <CalendarToday />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Posted on"
                    secondary={new Date(selectedJob.posted_at).toLocaleDateString()}
                  />
                </ListItem>
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJobDetailsOpen(false)}>Close</Button>
          <Button
            variant="contained"
            startIcon={<Apply />}
            onClick={() => selectedJob && handleApply(selectedJob)}
          >
            Apply Now
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default JobsList;

