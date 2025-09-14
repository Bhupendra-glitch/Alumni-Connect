import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  People,
  Event,
  Work,
  School,
  AttachMoney,
  Message,
  TrendingUp,
  Security,
  Speed,
  Support,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <People />,
      title: 'Alumni Directory',
      description: 'Connect with fellow alumni from your institution',
    },
    {
      icon: <Event />,
      title: 'Events & Networking',
      description: 'Join events and build meaningful professional relationships',
    },
    {
      icon: <Work />,
      title: 'Job Opportunities',
      description: 'Discover career opportunities posted by alumni',
    },
    {
      icon: <School />,
      title: 'Mentorship Program',
      description: 'Get mentored by experienced alumni or mentor others',
    },
    {
      icon: <AttachMoney />,
      title: 'Fundraising',
      description: 'Support institutional initiatives and causes',
    },
    {
      icon: <Message />,
      title: 'Direct Messaging',
      description: 'Communicate directly with alumni and students',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Active Alumni' },
    { number: '500+', label: 'Events Hosted' },
    { number: '2,000+', label: 'Jobs Posted' },
    { number: '95%', label: 'Success Rate' },
  ];

  return (
    <Box>
      <Header />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h2" component="h1" gutterBottom>
                Connect. Grow. Succeed.
              </Typography>
              <Typography variant="h5" paragraph>
                The ultimate platform for alumni networking, mentorship, and professional development.
              </Typography>
              <Typography variant="body1" paragraph>
                Join thousands of alumni who are already building meaningful connections, 
                sharing opportunities, and supporting each other's growth.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ bgcolor: 'white', color: 'primary.main' }}
                  onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ color: 'white', borderColor: 'white' }}
                  onClick={() => navigate('/alumni')}
                >
                  Browse Alumni
                </Button>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 400,
                }}
              >
                <Avatar
                  sx={{
                    width: 300,
                    height: 300,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    fontSize: '4rem',
                  }}
                >
                  <People sx={{ fontSize: '4rem' }} />
                </Avatar>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid size={{ xs: 6, md: 3 }} key={index}>
                <Box textAlign="center">
                  <Typography variant="h3" component="div" color="primary" gutterBottom>
                    {stat.number}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" component="h2" gutterBottom>
              Everything You Need to Stay Connected
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Our comprehensive platform provides all the tools you need for successful alumni networking
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                  <CardContent>
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: 'primary.main',
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h3" component="h2" gutterBottom>
                Why Choose Alumni Connect?
              </Typography>
              <Typography variant="body1" paragraph>
                We understand the challenges of maintaining meaningful connections after graduation. 
                That's why we've built a platform specifically designed for alumni communities.
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Security color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Secure & Private"
                    secondary="Your data is protected with enterprise-grade security"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Speed color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Easy to Use"
                    secondary="Intuitive interface designed for all skill levels"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Support color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="24/7 Support"
                    secondary="Our team is here to help you succeed"
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 400,
                }}
              >
                <Avatar
                  sx={{
                    width: 300,
                    height: 300,
                    bgcolor: 'primary.main',
                    fontSize: '4rem',
                  }}
                >
                  <TrendingUp sx={{ fontSize: '4rem' }} />
                </Avatar>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Typography variant="h3" component="h2" gutterBottom>
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" paragraph>
              Join thousands of alumni who are already building meaningful connections
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                sx={{ bgcolor: 'white', color: 'primary.main' }}
                onClick={() => navigate('/register')}
              >
                Create Your Account
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{ color: 'white', borderColor: 'white' }}
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default HomePage;

