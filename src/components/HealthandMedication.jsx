/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Stack,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  NotificationsActive as AlertIcon,
  AccessTime as TimeIcon,
  Event as EventIcon,
} from '@mui/icons-material';

const periodTrackingTheme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Green
      light: '#C8E6C9', // Light Green
      contrastText: '#FFFFFF', // White
    },
    secondary: {
      main: '#388E3C', // Dark Green
      light: '#66BB6A', // Medium Green
      contrastText: '#FFFFFF', // White
    },
    background: {
      default: '#E8F5E9', // Very Light Green
      paper: '#FFFFFF', // White
    },
    text: {
      primary: '#333333', // Dark Gray
      secondary: '#757575', // Medium Gray
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

const HealthTracker = () => {
  const [medications, setMedications] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentMed, setCurrentMed] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'Daily',
    time: '',
    notes: ''
  });

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const resetForm = () => {
    setFormData({
      name: '',
      dosage: '',
      frequency: 'Daily',
      time: '',
      notes: ''
    });
    setCurrentMed(null);
  };

  const handleOpenDialog = (med = null) => {
    if (med) {
      setFormData(med);
      setCurrentMed(med);
    } else {
      resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
  };

  const handleSave = () => {
    if (!formData.name || !formData.dosage || !formData.time) return;

    if (currentMed) {
      setMedications(medications.map(med =>
        med.id === currentMed.id ? { ...formData, id: currentMed.id } : med
      ));
    } else {
      setMedications([...medications, { ...formData, id: Date.now(), completed: false }]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const toggleComplete = (id) => {
    setMedications(medications.map(med =>
      med.id === id ? { ...med, completed: !med.completed } : med
    ));
  };

  const getNextMedication = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    return medications
      .filter(med => !med.completed)
      .reduce((next, med) => {
        const [hours, minutes] = med.time.split(':');
        const medMinutes = parseInt(hours) * 60 + parseInt(minutes);
        const diff = medMinutes - currentMinutes;
        
        if (diff > 0 && (!next || diff < next.diff)) {
          return { med, diff };
        }
        return next;
      }, null)?.med;
  };

  return (
    <ThemeProvider theme={periodTrackingTheme}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Enhanced Reminder Banner */}
        <Fade in={true} timeout={1000}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 3, 
              mb: 3, 
              bgcolor: periodTrackingTheme.palette.primary.light,
              color: periodTrackingTheme.palette.primary.contrastText,
              borderRadius: 2,
              transform: 'translateY(0)',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
              }
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <AlertIcon fontSize="large" />
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {getNextMedication() 
                  ? `Next Medication: ${getNextMedication().name} at ${getNextMedication().time}`
                  : 'No upcoming medications'}
              </Typography>
            </Box>
          </Paper>
        </Fade>

        {/* Enhanced Medications List */}
        <Fade in={true} timeout={1000}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 3, 
              borderRadius: 2,
              bgcolor: periodTrackingTheme.palette.background.paper
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: periodTrackingTheme.palette.primary.main }}>
                Medications & Supplements
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ borderRadius: 28 }}
              >
                Add New
              </Button>
            </Box>

            <List sx={{ width: '100%' }}>
              {medications.map((med) => (
                <Slide key={med.id} direction="up" in={true} timeout={500}>
                  <ListItem
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      bgcolor: med.completed ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                      '&:hover': { 
                        bgcolor: 'rgba(0, 0, 0, 0.08)',
                        transition: 'background-color 0.3s ease'
                      }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Chip 
                            label={med.name}
                            color="primary"
                            sx={{ fontWeight: 500 }}
                          />
                          <Chip
                            icon={<TimeIcon />}
                            label={med.time}
                            variant="outlined"
                            size="small"
                          />
                          <Chip
                            icon={<EventIcon />}
                            label={med.frequency}
                            variant="outlined"
                            size="small"
                          />
                        </Stack>
                      }
                      secondary={
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            mt: 1,
                            color: periodTrackingTheme.palette.text.secondary,
                            textDecoration: med.completed ? 'line-through' : 'none'
                          }}
                        >
                          {`${med.dosage}${med.notes ? ` • ${med.notes}` : ''}`}
                        </Typography>
                      }
                    />
                    <Stack direction="row" spacing={1}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog(med)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDelete(med.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => toggleComplete(med.id)}
                        sx={{ ml: 1 }}
                      >
                        {med.completed ? "Undo" : "Complete"}
                      </Button>
                    </Stack>
                  </ListItem>
                </Slide>
              ))}
              {medications.length === 0 && (
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ textAlign: 'center', py: 4 }}
                >
                  No medications added yet. Click the &quot;Add New&quot; button to get started.
                </Typography>
              )}
            </List>
          </Paper>
        </Fade>

        {/* Enhanced Add/Edit Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog} 
          fullScreen={fullScreen}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            pb: 2
          }}>
            <Typography variant="h6" component="div">
              {currentMed ? 'Edit Medication' : 'Add New Medication'}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Stack spacing={3} sx={{ width: '100%' }}>
              <TextField
                label="Medication Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                required
                variant="outlined"
              />
              <TextField
                label="Dosage"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                fullWidth
                required
                variant="outlined"
                placeholder="e.g., 1 tablet, 5ml, etc."
              />
              <FormControl fullWidth variant="outlined">
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  label="Frequency"
                >
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Twice Daily">Twice Daily</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="As Needed">As Needed</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
              <TextField
                label="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder="Add any special instructions or notes here"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
            <Button onClick={handleCloseDialog} color="inherit">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              variant="contained" 
              color="primary"
              disabled={!formData.name || !formData.dosage || !formData.time}
            >
              {currentMed ? 'Save Changes' : 'Add Medication'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default HealthTracker;