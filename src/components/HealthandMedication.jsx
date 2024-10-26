/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  AlertCircle,
  Plus,
  Edit,
  Trash,
  X,
} from 'lucide-react';

const HealthAndMedication = () => {
  const [medications, setMedications] = useState([
    { id: 1, name: 'Prenatal Vitamins', dosage: '1 tablet', frequency: 'Daily', time: '09:00', notes: 'Take with food' },
    { id: 2, name: 'Iron Supplement', dosage: '1 tablet', frequency: 'Daily', time: '20:00', notes: 'Take on empty stomach' }
  ]);

  const [symptoms, setSymptoms] = useState([
    { id: 1, type: 'Cramps', severity: 'Moderate', time: '14:00', notes: 'Lower abdomen' },
    { id: 2, type: 'Headache', severity: 'Mild', time: '16:00', notes: 'Front of head' }
  ]);

  const [showAddMed, setShowAddMed] = useState(false);
  const [showAddSymptom, setShowAddSymptom] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [editingSymptom, setEditingSymptom] = useState(null);

  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: '',
    time: '',
    notes: ''
  });

  const [newSymptom, setNewSymptom] = useState({
    type: '',
    severity: '',
    time: '',
    notes: ''
  });

  const severityColors = {
    Mild: 'success',
    Moderate: 'warning',
    Severe: 'error'
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleAddMed = () => {
    if (editingMed) {
      setMedications(medications.map(med => med.id === editingMed.id ? { ...newMed, id: editingMed.id } : med));
      setEditingMed(null);
    } else {
      setMedications([...medications, { ...newMed, id: Date.now() }]);
    }
    setNewMed({
      name: '',
      dosage: '',
      frequency: '',
      time: '',
      notes: ''
    });
    setShowAddMed(false);
  };

  const handleAddSymptom = () => {
    if (editingSymptom) {
      setSymptoms(symptoms.map(symptom => symptom.id === editingSymptom.id ? { ...newSymptom, id: editingSymptom.id } : symptom));
      setEditingSymptom(null);
    } else {
      setSymptoms([...symptoms, { ...newSymptom, id: Date.now() }]);
    }
    setNewSymptom({
      type: '',
      severity: '',
      time: '',
      notes: ''
    });
    setShowAddSymptom(false);
  };

  const handleEditMed = (med) => {
    setNewMed(med);
    setEditingMed(med);
    setShowAddMed(true);
  };

  const handleEditSymptom = (symptom) => {
    setNewSymptom(symptom);
    setEditingSymptom(symptom);
    setShowAddSymptom(true);
  };

  const handleDeleteMed = (id) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const handleDeleteSymptom = (id) => {
    setSymptoms(symptoms.filter(symptom => symptom.id !== id));
  };

  const getNextMedication = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    let nextMed = null;
    let minDiff = Infinity;

    medications.forEach(med => {
      const [medHour, medMinute] = med.time.split(':').map(Number);
      const medTime = medHour * 60 + medMinute;
      const diff = medTime - currentTime;

      if (diff > 0 && diff < minDiff) {
        minDiff = diff;
        nextMed = med;
      }
    });

    return nextMed;
  };

  const nextMedication = getNextMedication();

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      {/* Reminder Card */}
      <Fade in={true} timeout={1000}>
        <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: 2, boxShadow: theme.shadows[4] }}>
          <AlertCircle size={24} style={{ marginRight: theme.spacing(1) }} />
          <Typography variant="body1">Next medication: {nextMedication ? `${nextMedication.name} in ${Math.floor(nextMedication.time.split(':')[0] - new Date().getHours())} hour(s)` : 'No upcoming medications'}</Typography>
        </Paper>
      </Fade>

      {/* Medications Section */}
      <Fade in={true} timeout={1000}>
        <Paper sx={{ p: 2, mt: 2, borderRadius: 2, boxShadow: theme.shadows[4] }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" sx={{ color: theme.palette.secondary.main }}>Medications & Supplements</Typography>
            <IconButton color="primary" onClick={() => setShowAddMed(true)}>
              <Plus size={20} />
            </IconButton>
          </Box>
          <List>
            {medications.map(med => (
              <Slide key={med.id} direction="up" in={true} timeout={500}>
                <ListItem sx={{ py: 2, '&:hover': { bgcolor: 'action.hover' } }}>
                  <ListItemText
                    primary={med.name}
                    secondary={
                      <>
                        <Typography variant="body2" color="textSecondary">
                          {med.dosage} • {med.frequency} at {med.time}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {med.notes}
                        </Typography>
                      </>
                    }
                  />
                  <Box>
                    <IconButton size="small" onClick={() => handleEditMed(med)}>
                      <Edit size={16} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteMed(med.id)}>
                      <Trash size={16} />
                    </IconButton>
                  </Box>
                </ListItem>
              </Slide>
            ))}
          </List>
        </Paper>
      </Fade>


      {/* Add New Medication Dialog */}
      <Dialog open={showAddMed} onClose={() => setShowAddMed(false)} fullScreen={fullScreen}>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{editingMed ? 'Edit Medication' : 'Add New Medication'}</Typography>
            <IconButton onClick={() => setShowAddMed(false)}>
              <X size={20} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Medication Name"
            value={newMed.name}
            onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Dosage"
            value={newMed.dosage}
            onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
            fullWidth
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Frequency</InputLabel>
            <Select
              value={newMed.frequency}
              onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
              label="Frequency"
            >
              <MenuItem value="Daily">Daily</MenuItem>
              <MenuItem value="Weekly">Weekly</MenuItem>
              <MenuItem value="Monthly">Monthly</MenuItem>
              <MenuItem value="As Needed">As Needed</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Time"
            type="time"
            value={newMed.time}
            onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="Notes"
            value={newMed.notes}
            onChange={(e) => setNewMed({ ...newMed, notes: e.target.value })}
            fullWidth
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddMed(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddMed} color="primary">
            {editingMed ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add New Symptom Dialog */}
      <Dialog open={showAddSymptom} onClose={() => setShowAddSymptom(false)} fullScreen={fullScreen}>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{editingSymptom ? 'Edit Symptom' : 'Add New Symptom'}</Typography>
            <IconButton onClick={() => setShowAddSymptom(false)}>
              <X size={20} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Symptom Type"
            value={newSymptom.type}
            onChange={(e) => setNewSymptom({ ...newSymptom, type: e.target.value })}
            fullWidth
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Severity</InputLabel>
            <Select
              value={newSymptom.severity}
              onChange={(e) => setNewSymptom({ ...newSymptom, severity: e.target.value })}
              label="Severity"
            >
              <MenuItem value="Mild">Mild</MenuItem>
              <MenuItem value="Moderate">Moderate</MenuItem>
              <MenuItem value="Severe">Severe</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Time"
            type="time"
            value={newSymptom.time}
            onChange={(e) => setNewSymptom({ ...newSymptom, time: e.target.value })}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="Notes"
            value={newSymptom.notes}
            onChange={(e) => setNewSymptom({ ...newSymptom, notes: e.target.value })}
            fullWidth
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddSymptom(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddSymptom} color="primary">
            {editingSymptom ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HealthAndMedication;