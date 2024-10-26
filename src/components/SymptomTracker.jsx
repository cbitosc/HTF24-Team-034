/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { db, auth } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  orderBy,
  serverTimestamp,
  doc,
  deleteDoc
} from 'firebase/firestore';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Chip,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  Slider as MuiSlider,
  Button as MuiButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  AddCircleOutline,
  DeleteOutline,
  Save as SaveIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const DEFAULT_SYMPTOMS = [
  "Cramps",
  "Headache",
  "Fatigue",
  "Bloating",
  "Breast Tenderness",
  "Mood Swings",
  "Acne",
  "Back Pain",
  "Nausea"
];

const DEFAULT_MOODS = [
  "Happy",
  "Calm",
  "Irritable",
  "Anxious",
  "Sad",
  "Energetic",
  "Tired",
  "Stressed"
];

// Custom theme colors
const themeColors = {
  primary: '#ec4899', // Pink
  secondary: '#fde7f3', // Light pink
  hover: '#be185d', // Darker pink
};

const SymptomTracker = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptom, setSelectedSymptom] = useState("");
  const [intensity, setIntensity] = useState([3]);
  const [mood, setMood] = useState("");
  const [notes, setNotes] = useState("");
  const [historicalData, setHistoricalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [availableSymptoms, setAvailableSymptoms] = useState(DEFAULT_SYMPTOMS);
  const [availableMoods, setAvailableMoods] = useState(DEFAULT_MOODS);
  const [customSymptomDialog, setCustomSymptomDialog] = useState(false);
  const [customMoodDialog, setCustomMoodDialog] = useState(false);
  const [newCustomSymptom, setNewCustomSymptom] = useState("");
  const [newCustomMood, setNewCustomMood] = useState("");

  useEffect(() => {
    fetchSymptomHistory();
  }, []);

  const fetchSymptomHistory = async () => {
    try {
      if (!auth.currentUser) {
        console.log('No user logged in');
        setIsLoading(false);
        return;
      }

      const userId = auth.currentUser.uid;
      const q = query(
        collection(db, 'symptomLogs'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().timestamp ? format(doc.data().timestamp.toDate(), 'MMM dd') : 'No date'
      }));

      setHistoricalData(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching symptom history:', error);
      setIsLoading(false);
    }
  };

  const handleAddSymptom = () => {
    if (selectedSymptom && !symptoms.find(s => s.name === selectedSymptom)) {
      setSymptoms([...symptoms, { 
        name: selectedSymptom, 
        intensity: intensity[0] 
      }]);
      setSelectedSymptom("");
      setIntensity([3]);
      setOpenDialog(false);
    }
  };

  const handleAddCustomSymptom = () => {
    if (newCustomSymptom && !availableSymptoms.includes(newCustomSymptom)) {
      setAvailableSymptoms([...availableSymptoms, newCustomSymptom]);
      setSelectedSymptom(newCustomSymptom);
      setNewCustomSymptom("");
      setCustomSymptomDialog(false);
    }
  };

  const handleAddCustomMood = () => {
    if (newCustomMood && !availableMoods.includes(newCustomMood)) {
      setAvailableMoods([...availableMoods, newCustomMood]);
      setMood(newCustomMood);
      setNewCustomMood("");
      setCustomMoodDialog(false);
    }
  };

  const handleRemoveSymptom = (symptomName) => {
    setSymptoms(symptoms.filter(s => s.name !== symptomName));
  };

  const handleDeleteClick = (entry) => {
    setEntryToDelete(entry);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!entryToDelete) return;

    try {
      const docRef = doc(db, 'symptomLogs', entryToDelete.id);
      await deleteDoc(docRef);
      
      setHistoricalData(prevData => 
        prevData.filter(entry => entry.id !== entryToDelete.id)
      );
      
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleSave = async () => {
    if (!auth.currentUser) {
      console.log('No user logged in');
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      await addDoc(collection(db, 'symptomLogs'), {
        userId,
        symptoms,
        mood,
        notes,
        timestamp: serverTimestamp()
      });

      setSymptoms([]);
      setMood("");
      setNotes("");
      
      await fetchSymptomHistory();
    } catch (error) {
      console.error('Error saving symptoms:', error);
    }
  };

  const getChartData = () => {
    return historicalData.slice(0, 7).reverse();
  };

  const buttonStyle = {
    backgroundColor: themeColors.primary,
    color: 'white',
    '&:hover': {
      backgroundColor: themeColors.hover,
    }
  };

  const outlinedButtonStyle = {
    borderColor: themeColors.primary,
    color: themeColors.primary,
    '&:hover': {
      borderColor: themeColors.hover,
      backgroundColor: themeColors.secondary,
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Track Today&apos;s Symptoms</Typography>
        
        {/* Symptom Selection Row */}
        <Grid container spacing={2} alignItems="center" mb={2}>
          <Grid item xs={9}>
            <FormControl fullWidth>
              <InputLabel>Select Symptom</InputLabel>
              <MuiSelect
                value={selectedSymptom}
                onChange={(e) => setSelectedSymptom(e.target.value)}
                label="Select Symptom"
              >
                {availableSymptoms.map(symptom => (
                  <MenuItem key={symptom} value={symptom}>
                    {symptom}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <MuiButton
              variant="outlined"
              onClick={() => setCustomSymptomDialog(true)}
              startIcon={<AddIcon />}
              fullWidth
              sx={outlinedButtonStyle}
            >
              Add New
            </MuiButton>
          </Grid>
        </Grid>

        

        {/* Mood Selection Row */}
        <Grid container spacing={2} alignItems="center" mb={3}>
          <Grid item xs={9}>
            <FormControl fullWidth>
              <InputLabel>Select Mood</InputLabel>
              <MuiSelect
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                label="Select Mood"
              >
                {availableMoods.map(m => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <MuiButton
              variant="outlined"
              onClick={() => setCustomMoodDialog(true)}
              startIcon={<AddIcon />}
              fullWidth
              sx={outlinedButtonStyle}
            >
              Add New
            </MuiButton>
          </Grid>
        </Grid>

        {/* Intensity and Add Symptom Row */}
        <Grid container spacing={2} alignItems="center" mb={3}>
          <Grid item xs={9}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Intensity: {intensity}
            </Typography>
            <MuiSlider
              value={intensity}
              onChange={(e, newValue) => setIntensity(newValue)}
              max={5}
              min={1}
              step={1}
              valueLabelDisplay="auto"
              sx={{
                color: themeColors.primary,
                '& .MuiSlider-thumb': {
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: `0px 0px 0px 8px ${themeColors.secondary}`,
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <MuiButton
              variant="contained"
              startIcon={<AddCircleOutline />}
              onClick={handleAddSymptom}
              fullWidth
              sx={buttonStyle}
            >
              Add Symptom
            </MuiButton>
          </Grid>
        </Grid>

        {/* Selected Symptoms */}
        <Box mb={3}>
          {symptoms.map((symptom) => (
            <Chip
              key={symptom.name}
              label={`${symptom.name} (${symptom.intensity}/5)`}
              onDelete={() => handleRemoveSymptom(symptom.name)}
              deleteIcon={<DeleteOutline />}
              sx={{ 
                mr: 1, 
                mb: 1,
                backgroundColor: themeColors.secondary,
                color: themeColors.primary,
                '& .MuiChip-deleteIcon': {
                  color: themeColors.primary,
                }
              }}
            />
          ))}
        </Box>

        {/* Notes */}
        <TextField
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about how you're feeling..."
          multiline
          rows={3}
          fullWidth
          variant="outlined"
          sx={{ mb: 3 }}
        />

        <MuiButton
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={symptoms.length === 0}
          fullWidth
          sx={buttonStyle}
        >
          Save Entry
        </MuiButton>
      </Paper>

      {/* Historical Data Visualization */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>Symptom History</Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="symptoms.length" 
                stroke={themeColors.primary}
                name="Number of Symptoms"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* Recent History */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>Recent Entries</Typography>
        <Box>
          {historicalData.slice(0, 5).map((entry) => (
            <Box 
              key={entry.id}
              sx={{ 
                borderBottom: '1px solid #e0e0e0', 
                pb: 2, 
                mb: 2,
                '&:last-child': {
                  borderBottom: 'none',
                  mb: 0,
                  pb: 0
                }
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 1 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1">{entry.date}</Typography>
                  <Typography variant="body2" color="textSecondary">{entry.mood}</Typography>
                </Box>
                <IconButton 
                  onClick={() => handleDeleteClick(entry)}
                  size="small"
                  sx={{ 
                    color: themeColors.primary,
                    '&:hover': {
                      backgroundColor: themeColors.secondary
                    }
                  }}
                >
                  <DeleteOutline />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                {entry.symptoms.map((symptom, idx) => (
                  <Chip
                    key={idx}
                    label={`${symptom.name} (${symptom.intensity}/5)`}
                    size="small"
                    sx={{
                      backgroundColor: themeColors.secondary,
                      color: themeColors.primary
                    }}
                  />
                ))}
              </Box>
              {entry.notes && (
                <Typography variant="body2" color="textSecondary">
                  {entry.notes}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Custom Symptom Dialog */}
      <Dialog
        open={customSymptomDialog}
        onClose={() => setCustomSymptomDialog(false)}
      >
        <DialogTitle>Add Custom Symptom</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Symptom"
            fullWidth
            variant="outlined"
            value={newCustomSymptom}
            onChange={(e) => setNewCustomSymptom(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <MuiButton 
            onClick={() => setCustomSymptomDialog(false)}
            sx={{ color: 'gray' }}
          >
            Cancel
          </MuiButton>
          <MuiButton 
            onClick={handleAddCustomSymptom} 
            variant="contained"
            sx={{
              backgroundColor: themeColors.primary,
              '&:hover': {
                backgroundColor: themeColors.hover,
              }
            }}
          >
            Add
          </MuiButton>
        </DialogActions>
      </Dialog>

      {/* Custom Mood Dialog */}
      <Dialog
        open={customMoodDialog}
        onClose={() => setCustomMoodDialog(false)}
      >
        <DialogTitle>Add Custom Mood</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Mood"
            fullWidth
            variant="outlined"
            value={newCustomMood}
            onChange={(e) => setNewCustomMood(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <MuiButton 
            onClick={() => setCustomMoodDialog(false)}
            sx={{ color: 'gray' }}
          >
            Cancel
          </MuiButton>
          <MuiButton 
            onClick={handleAddCustomMood} 
            variant="contained"
            sx={{
              backgroundColor: themeColors.primary,
              '&:hover': {
                backgroundColor: themeColors.hover,
              }
            }}
          >
            Add
          </MuiButton>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Entry</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this entry? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <MuiButton 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: 'gray' }}
          >
            Cancel
          </MuiButton>
          <MuiButton 
            onClick={handleDeleteConfirm}
            sx={{
              backgroundColor: themeColors.primary,
              color: 'white',
              '&:hover': {
                backgroundColor: themeColors.hover,
              }
            }}
            variant="contained"
          >
            Delete
          </MuiButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SymptomTracker;