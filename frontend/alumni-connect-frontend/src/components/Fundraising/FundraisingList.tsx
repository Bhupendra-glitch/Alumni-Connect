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
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import {
  Search,
  AttachMoney,
  TrendingUp,
  Person,
  CalendarToday,
  Add,
  Edit,
  Delete,
  AttachMoney as Donate,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { fundraisingAPI } from '../../services/api';
import { FundraisingCampaign, Donation } from '../../types';

const FundraisingList: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [campaigns, setCampaigns] = useState<FundraisingCampaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<FundraisingCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<FundraisingCampaign | null>(null);
  const [campaignDetailsOpen, setCampaignDetailsOpen] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    let filtered = campaigns;

    if (searchTerm) {
      filtered = filtered.filter(
        (campaign) =>
          campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCampaigns(filtered);
  }, [campaigns, searchTerm]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const data = await fundraisingAPI.getCampaigns();
      setCampaigns(data);
    } catch (err) {
      setError('Failed to load fundraising campaigns');
      console.error('Fundraising error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCampaign = async (campaignId: number) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await fundraisingAPI.deleteCampaign(campaignId);
        fetchCampaigns();
      } catch (err) {
        setError('Failed to delete campaign');
      }
    }
  };

  const handleViewCampaignDetails = async (campaign: FundraisingCampaign) => {
    setSelectedCampaign(campaign);
    setCampaignDetailsOpen(true);
    try {
      const donationsData = await fundraisingAPI.getCampaignDonations(campaign.id);
      setDonations(donationsData);
    } catch (err) {
      console.error('Failed to load donations:', err);
    }
  };

  const handleDonate = (campaign: FundraisingCampaign) => {
    // TODO: Implement donation functionality
    alert('Donation functionality will be implemented soon!');
  };

  const isCampaignActive = (campaign: FundraisingCampaign) => {
    const now = new Date();
    const startDate = new Date(campaign.start_date);
    const endDate = new Date(campaign.end_date);
    return now >= startDate && now <= endDate;
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
            Fundraising Campaigns
          </Typography>
          {isAuthenticated && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => alert('Campaign creation form will be implemented soon!')}
            >
              Create Campaign
            </Button>
          )}
        </Box>
        <Typography variant="body1" color="text.secondary">
          Support institutional initiatives and causes
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
            placeholder="Search campaigns..."
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

      {/* Campaigns Grid */}
      <Grid container spacing={3}>
        {filteredCampaigns.map((campaign) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={campaign.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                    <AttachMoney />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="h2">
                      {campaign.title}
                    </Typography>
                    <Chip
                      label={isCampaignActive(campaign) ? 'Active' : 'Ended'}
                      color={isCampaignActive(campaign) ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {campaign.description.length > 100
                    ? `${campaign.description.substring(0, 100)}...`
                    : campaign.description}
                </Typography>

                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Progress
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {campaign.progress_percentage}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={campaign.progress_percentage}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <List dense>
                  <ListItem disablePadding>
                    <ListItemAvatar sx={{ minWidth: 32 }}>
                      <TrendingUp fontSize="small" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`$${campaign.raised_amount.toLocaleString()} raised`}
                      secondary={`Goal: $${campaign.goal_amount.toLocaleString()}`}
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemAvatar sx={{ minWidth: 32 }}>
                      <Person fontSize="small" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${campaign.donations_count} donations`}
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemAvatar sx={{ minWidth: 32 }}>
                      <CalendarToday fontSize="small" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`Ends ${new Date(campaign.end_date).toLocaleDateString()}`}
                    />
                  </ListItem>
                </List>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => handleViewCampaignDetails(campaign)}
                >
                  View Details
                </Button>
                {isCampaignActive(campaign) && (
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<Donate />}
                    onClick={() => handleDonate(campaign)}
                  >
                    Donate
                  </Button>
                )}
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
                      onClick={() => handleDeleteCampaign(campaign.id)}
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

      {filteredCampaigns.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No fundraising campaigns found matching your criteria
          </Typography>
        </Box>
      )}

      {/* Campaign Details Dialog */}
      <Dialog open={campaignDetailsOpen} onClose={() => setCampaignDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedCampaign?.title}
        </DialogTitle>
        <DialogContent>
          {selectedCampaign && (
            <Box>
              <Typography variant="body1" paragraph>
                {selectedCampaign.description}
              </Typography>
              
              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Progress
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedCampaign.progress_percentage}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={selectedCampaign.progress_percentage}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <List>
                <ListItem>
                  <ListItemAvatar>
                    <TrendingUp />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Amount Raised"
                    secondary={`$${selectedCampaign.raised_amount.toLocaleString()} of $${selectedCampaign.goal_amount.toLocaleString()}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Person />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Donations"
                    secondary={`${selectedCampaign.donations_count} donations received`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <CalendarToday />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Campaign Period"
                    secondary={`${new Date(selectedCampaign.start_date).toLocaleDateString()} - ${new Date(selectedCampaign.end_date).toLocaleDateString()}`}
                  />
                </ListItem>
              </List>

              {donations.length > 0 && (
                <Box mt={3}>
                  <Typography variant="h6" gutterBottom>
                    Recent Donations
                  </Typography>
                  <List>
                    {donations.slice(0, 5).map((donation) => (
                      <ListItem key={donation.id}>
                        <ListItemAvatar>
                          <Avatar>
                            {donation.donor.first_name[0]}{donation.donor.last_name[0]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`$${donation.amount.toLocaleString()}`}
                          secondary={`${donation.donor.first_name} ${donation.donor.last_name} - ${new Date(donation.date).toLocaleDateString()}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCampaignDetailsOpen(false)}>Close</Button>
          {selectedCampaign && isCampaignActive(selectedCampaign) && (
            <Button
              variant="contained"
              startIcon={<Donate />}
              onClick={() => handleDonate(selectedCampaign)}
            >
              Donate Now
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FundraisingList;

