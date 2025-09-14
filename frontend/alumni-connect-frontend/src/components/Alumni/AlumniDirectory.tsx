import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  ListItemIcon,
} from '@mui/material';
import {
  Search,
  Person,
  Work,
  School,
  Email,
  Phone,
  LinkedIn,
  Message,
} from '@mui/icons-material';
import { userAPI } from '../../services/api';
import { User } from '../../types';

const AlumniDirectory: React.FC = () => {
  const [alumni, setAlumni] = useState<User[]>([]);
  const [filteredAlumni, setFilteredAlumni] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState<User | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setLoading(true);
        const data = await userAPI.getAlumni();
        setAlumni(data);
        setFilteredAlumni(data);
      } catch (err) {
        setError('Failed to load alumni directory');
        console.error('Alumni directory error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  useEffect(() => {
    let filtered = alumni;

    if (searchTerm) {
      filtered = filtered.filter(
        (alumni) =>
          `${alumni.first_name} ${alumni.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alumni.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alumni.current_org?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alumni.designation?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (departmentFilter) {
      filtered = filtered.filter((alumni) => alumni.department === departmentFilter);
    }

    if (batchFilter) {
      filtered = filtered.filter((alumni) => alumni.batch === batchFilter);
    }

    setFilteredAlumni(filtered);
  }, [alumni, searchTerm, departmentFilter, batchFilter]);

  const handleViewProfile = (alumni: User) => {
    setSelectedAlumni(alumni);
    setProfileOpen(true);
  };

  const handleCloseProfile = () => {
    setProfileOpen(false);
    setSelectedAlumni(null);
  };

  const getDepartments = () => {
    const departments = Array.from(new Set(alumni.map((alumni) => alumni.department).filter(Boolean)));
    return departments.sort();
  };

  const getBatches = () => {
    const batches = Array.from(new Set(alumni.map((alumni) => alumni.batch).filter(Boolean)));
    return batches.sort((a, b) => (b || '').localeCompare(a || ''));
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
          Alumni Directory
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Connect with fellow alumni from your institution
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
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="Search by name, department, company, or designation..."
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
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  label="Department"
                >
                  <MenuItem value="">All Departments</MenuItem>
                  {getDepartments().map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Batch</InputLabel>
                <Select
                  value={batchFilter}
                  onChange={(e) => setBatchFilter(e.target.value)}
                  label="Batch"
                >
                  <MenuItem value="">All Batches</MenuItem>
                  {getBatches().map((batch) => (
                    <MenuItem key={batch} value={batch}>
                      {batch}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Alumni Grid */}
      <Grid container spacing={3}>
        {filteredAlumni.map((alumni) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={alumni.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}>
                    {alumni.first_name[0]}{alumni.last_name[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="h2">
                      {alumni.first_name} {alumni.last_name}
                    </Typography>
                    <Chip
                      label={alumni.role}
                      size="small"
                      color={getRoleColor(alumni.role) as any}
                    />
                  </Box>
                </Box>

                {alumni.designation && alumni.current_org && (
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {alumni.designation} at {alumni.current_org}
                  </Typography>
                )}

                <List dense>
                  {alumni.department && (
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <School fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={alumni.department}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  )}
                  {alumni.batch && (
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Person fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Batch ${alumni.batch}`}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<Message />}
                  onClick={() => handleViewProfile(alumni)}
                >
                  View Profile
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredAlumni.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No alumni found matching your criteria
          </Typography>
        </Box>
      )}

      {/* Profile Dialog */}
      <Dialog open={profileOpen} onClose={handleCloseProfile} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedAlumni && `${selectedAlumni.first_name} ${selectedAlumni.last_name}`}
        </DialogTitle>
        <DialogContent>
          {selectedAlumni && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box textAlign="center">
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      mb: 2,
                      bgcolor: 'primary.main',
                      fontSize: '2rem',
                    }}
                  >
                    {selectedAlumni.first_name[0]}{selectedAlumni.last_name[0]}
                  </Avatar>
                  <Chip
                    label={selectedAlumni.role}
                    color={getRoleColor(selectedAlumni.role) as any}
                    sx={{ mb: 2 }}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <List>
                  {selectedAlumni.email && (
                    <ListItem>
                      <ListItemIcon>
                        <Email />
                      </ListItemIcon>
                      <ListItemText primary={selectedAlumni.email} />
                    </ListItem>
                  )}
                  {selectedAlumni.phone && (
                    <ListItem>
                      <ListItemIcon>
                        <Phone />
                      </ListItemIcon>
                      <ListItemText primary={selectedAlumni.phone} />
                    </ListItem>
                  )}
                  {selectedAlumni.linkedin && (
                    <ListItem>
                      <ListItemIcon>
                        <LinkedIn />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Button
                            href={selectedAlumni.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                          >
                            View LinkedIn Profile
                          </Button>
                        }
                      />
                    </ListItem>
                  )}
                  {selectedAlumni.department && (
                    <ListItem>
                      <ListItemIcon>
                        <School />
                      </ListItemIcon>
                      <ListItemText primary={selectedAlumni.department} />
                    </ListItem>
                  )}
                  {selectedAlumni.batch && (
                    <ListItem>
                      <ListItemIcon>
                        <Person />
                      </ListItemIcon>
                      <ListItemText primary={`Batch ${selectedAlumni.batch}`} />
                    </ListItem>
                  )}
                  {selectedAlumni.current_org && (
                    <ListItem>
                      <ListItemIcon>
                        <Work />
                      </ListItemIcon>
                      <ListItemText
                        primary={selectedAlumni.designation}
                        secondary={selectedAlumni.current_org}
                      />
                    </ListItem>
                  )}
                </List>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProfile}>Close</Button>
          <Button variant="contained" startIcon={<Message />}>
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AlumniDirectory;

