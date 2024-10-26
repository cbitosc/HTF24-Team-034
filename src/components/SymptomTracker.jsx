/* eslint-disable no-unused-vars */
// src/components/SymptomTracker.jsx
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
  serverTimestamp 
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

const SYMPTOMS = [
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

const MOODS = [
  "Happy",
  "Calm",
  "Irritable",
  "Anxious",
  "Sad",
  "Energetic",
  "Tired",
  "Stressed"
];

const SymptomTracker = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptom, setSelectedSymptom] = useState("");
  const [intensity, setIntensity] = useState([3]);
  const [mood, setMood] = useState("");
  const [notes, setNotes] = useState("");
  const [historicalData, setHistoricalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchSymptomHistory();
  }, []);

  const fetchSymptomHistory = async () => {
    try {
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
        date: format(doc.data().timestamp.toDate(), 'MMM dd')
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
    }
  };

  const handleRemoveSymptom = (symptomName) => {
    setSymptoms(symptoms.filter(s => s.name !== symptomName));
  };

  const handleSave = async () => {
    try {
      const userId = auth.currentUser.uid;
      await addDoc(collection(db, 'symptomLogs'), {
        userId,
        symptoms,
        mood,
        notes,
        timestamp: serverTimestamp()
      });

      // Reset form
      setSymptoms([]);
      setMood("");
      setNotes("");
      
      // Refresh history
      await fetchSymptomHistory();
    } catch (error) {
      console.error('Error saving symptoms:', error);
    }
  };

  const getChartData = () => {
    return historicalData.slice(0, 7).reverse();
  };

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      {/* Symptom Input Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Track Today&apos;s Symptoms</Typography>
        
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Select Symptom</InputLabel>
              <MuiSelect
                value={selectedSymptom}
                onChange={(e) => setSelectedSymptom(e.target.value)}
                label="Select Symptom"
              >
                {SYMPTOMS.map(symptom => (
                  <MenuItem key={symptom} value={symptom}>
                    {symptom}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
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
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <MuiButton
              variant="contained"
              color="primary"
              startIcon={<AddCircleOutline />}
              onClick={handleAddSymptom}
              fullWidth
            >
              Add
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
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>

        {/* Mood Selection */}
        <FormControl fullWidth mb={3}>
          <InputLabel>Select Mood</InputLabel>
          <MuiSelect
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            label="Select Mood"
          >
            {MOODS.map(m => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </MuiSelect>
        </FormControl>

        {/* Notes */}
        <TextField
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about how you're feeling..."
          multiline
          rows={3}
          fullWidth
          variant="outlined"
          mb={3}
        />

        <MuiButton
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={symptoms.length === 0}
          fullWidth
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
                stroke="#ec4899" 
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
              sx={{ borderBottom: '1px solid #e0e0e0', pb: 2, mb: 2 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1">{entry.date}</Typography>
                <Typography variant="body2" color="textSecondary">{entry.mood}</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                {entry.symptoms.map((symptom, idx) => (
                  <Chip
                    key={idx}
                    label={`${symptom.name} (${symptom.intensity}/5)`}
                    size="small"
                    color="secondary"
                  />
                ))}
              </Box>
              {entry.notes && (
                <Typography variant="body2" color="textSecondary">{entry.notes}</Typography>
              )}
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Dialog for Adding Symptoms */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Symptom</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Select Symptom</InputLabel>
            <MuiSelect
              value={selectedSymptom}
              onChange={(e) => setSelectedSymptom(e.target.value)}
              label="Select Symptom"
            >
              {SYMPTOMS.map(symptom => (
                <MenuItem key={symptom} value={symptom}>
                  {symptom}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
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
          />
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </MuiButton>
          <MuiButton onClick={handleAddSymptom} color="primary">
            Add
          </MuiButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SymptomTracker;