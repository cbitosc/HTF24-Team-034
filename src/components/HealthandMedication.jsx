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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  NotificationsActive as AlertIcon,
} from '@mui/icons-material';

const HealthTracker = () => {
  const [medications, setMedications] = useState([
    // { id: 1, name: 'Prenatal Vitamins', dosage: '1 tablet', frequency: 'Daily', time: '09:00', notes: 'Take with food', completed: false },
    // { id: 2, name: 'Iron Supplement', dosage: '1 tablet', frequency: 'Daily', time: '20:00', notes: 'Take on empty stomach', completed: false }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [currentMed, setCurrentMed] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'Daily',
    time: '',
    notes: ''
  });

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
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Reminder Banner */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <AlertIcon />
          <Typography>
            {getNextMedication() 
              ? `Next: ${getNextMedication().name} at ${getNextMedication().time}`
              : 'No upcoming medications'}
          </Typography>
        </Box>
      </Paper>

      {/* Medications List */}
      <Paper sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Medications & Supplements</Typography>
          <IconButton color="primary" onClick={() => handleOpenDialog()}>
            <AddIcon />
          </IconButton>
        </Box>

        <List>
          {medications.map((med) => (
            <ListItem
              key={med.id}
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                opacity: med.completed ? 0.6 : 1
              }}
              secondaryAction={
                <Box>
                  <IconButton size="small" onClick={() => handleOpenDialog(med)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(med.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <Button
                    size="small"
                    onClick={() => toggleComplete(med.id)}
                    sx={{ ml: 1 }}
                  >
                    {med.completed ? "Undo" : "Complete"}
                  </Button>
                </Box>
              }
            >
              <ListItemText
                primary={<Chip label={med.name} color="primary" />}
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {`${med.dosage} • ${med.frequency} at ${med.time}${med.notes ? ` • ${med.notes}` : ''}`}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {currentMed ? 'Edit Medication' : 'Add New Medication'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Medication Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Dosage"
              value={formData.dosage}
              onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Frequency</InputLabel>
              <Select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                label="Frequency"
              >
                <MenuItem value="Daily">Daily</MenuItem>
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
            />
            <TextField
              label="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {currentMed ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HealthTracker;