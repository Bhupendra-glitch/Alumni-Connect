import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const schema = yup.object({
  username: yup.string().required('Username is required').min(3, 'Username must be at least 3 characters'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  password_confirm: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Password confirmation is required'),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  role: yup.string().oneOf(['alumni', 'student', 'admin']).required('Role is required'),
  phone: yup.string(),
  linkedin: yup.string().url('Invalid LinkedIn URL'),
  batch: yup.string(),
  department: yup.string(),
  current_org: yup.string(),
  designation: yup.string(),
});

const RegisterForm: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role: 'student',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError('');
    
    try {
      await registerUser(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        px: 2,
        py: 4,
      }}
    >
      <Card sx={{ maxWidth: 600, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Join Alumni Connect
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" paragraph>
            Create your account to connect with fellow alumni
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  {...register('first_name')}
                  fullWidth
                  label="First Name"
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                  disabled={loading}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  {...register('last_name')}
                  fullWidth
                  label="Last Name"
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                  disabled={loading}
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  {...register('username')}
                  fullWidth
                  label="Username"
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  disabled={loading}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  {...register('email')}
                  fullWidth
                  label="Email"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={loading}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  {...register('password')}
                  fullWidth
                  label="Password"
                  type="password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={loading}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  {...register('password_confirm')}
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  error={!!errors.password_confirm}
                  helperText={errors.password_confirm?.message}
                  disabled={loading}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth error={!!errors.role}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    {...register('role')}
                    label="Role"
                    disabled={loading}
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="alumni">Alumni</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  {...register('phone')}
                  fullWidth
                  label="Phone"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  disabled={loading}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  {...register('linkedin')}
                  fullWidth
                  label="LinkedIn Profile"
                  error={!!errors.linkedin}
                  helperText={errors.linkedin?.message}
                  disabled={loading}
                />
              </Grid>

              {selectedRole === 'alumni' && (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...register('batch')}
                      fullWidth
                      label="Graduation Year"
                      error={!!errors.batch}
                      helperText={errors.batch?.message}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...register('department')}
                      fullWidth
                      label="Department"
                      error={!!errors.department}
                      helperText={errors.department?.message}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...register('current_org')}
                      fullWidth
                      label="Current Organization"
                      error={!!errors.current_org}
                      helperText={errors.current_org?.message}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...register('designation')}
                      fullWidth
                      label="Designation"
                      error={!!errors.designation}
                      helperText={errors.designation?.message}
                      disabled={loading}
                    />
                  </Grid>
                </>
              )}

              {selectedRole === 'student' && (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...register('batch')}
                      fullWidth
                      label="Expected Graduation Year"
                      error={!!errors.batch}
                      helperText={errors.batch?.message}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...register('department')}
                      fullWidth
                      label="Department"
                      error={!!errors.department}
                      helperText={errors.department?.message}
                      disabled={loading}
                    />
                  </Grid>
                </>
              )}
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>

            <Box textAlign="center">
              <Typography variant="body2">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login">
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterForm;

