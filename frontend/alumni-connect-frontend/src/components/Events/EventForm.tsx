import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { eventAPI } from '../../services/api';
import { Event as EventType } from '../../types';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  date: yup.string().required('Date is required'),
  location: yup.string().required('Location is required'),
});

interface EventFormProps {
  open: boolean;
  onClose: () => void;
  event?: EventType | null;
}

const EventForm: React.FC<EventFormProps> = ({ open, onClose, event }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: event?.title || '',
      description: event?.description || '',
      date: event?.date ? new Date(event.date).toISOString().slice(0, 16) : '',
      location: event?.location || '',
    },
  });

  React.useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        description: event.description,
        date: new Date(event.date).toISOString().slice(0, 16),
        location: event.location,
      });
    } else {
      reset({
        title: '',
        description: '',
        date: '',
        location: '',
      });
    }
  }, [event, reset]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError('');

    try {
      if (event) {
        await eventAPI.updateEvent(event.id, data);
      } else {
        await eventAPI.createEvent(data);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      reset();
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {event ? 'Edit Event' : 'Create New Event'}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            {...register('title')}
            fullWidth
            label="Event Title"
            margin="normal"
            error={!!errors.title}
            helperText={errors.title?.message}
            disabled={loading}
          />

          <TextField
            {...register('description')}
            fullWidth
            label="Description"
            multiline
            rows={4}
            margin="normal"
            error={!!errors.description}
            helperText={errors.description?.message}
            disabled={loading}
          />

          <TextField
            {...register('date')}
            fullWidth
            label="Date & Time"
            type="datetime-local"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            error={!!errors.date}
            helperText={errors.date?.message}
            disabled={loading}
          />

          <TextField
            {...register('location')}
            fullWidth
            label="Location"
            margin="normal"
            error={!!errors.location}
            helperText={errors.location?.message}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : (event ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default EventForm;

