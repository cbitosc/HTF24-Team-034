import React, { useState } from 'react';
import { 
  Paper,
  Grid,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  CalendarToday,
  Favorite
} from '@mui/icons-material';

const CycleCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [cycleData, setCycleData] = useState({
    lastPeriod: null,
    cycleLength: 28,
    periodLength: 5,
  });
  const [openDialog, setOpenDialog] = useState(false);

  // Calculate the first day of the current month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startingDayIndex = firstDayOfMonth.getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  // Calculate days until next period and fertility window
  const calculateNextPeriodAndFertility = (date) => {
    if (!cycleData.lastPeriod) return null;

    const lastPeriod = new Date(cycleData.lastPeriod);
    const today = new Date(date);
    const daysSinceLastPeriod = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24));
    const daysUntilNextPeriod = cycleData.cycleLength - (daysSinceLastPeriod % cycleData.cycleLength);
    
    // Calculate fertility window (typically days 11-17 of the cycle)
    const currentCycleDay = daysSinceLastPeriod % cycleData.cycleLength;
    const fertilityChance = calculateFertilityChance(currentCycleDay);

    return {
      daysUntilNextPeriod,
      fertilityChance
    };
  };

  // Calculate fertility chance based on cycle day
  const calculateFertilityChance = (cycleDay) => {
    if (cycleDay >= 11 && cycleDay <= 17) {
      if (cycleDay >= 13 && cycleDay <= 15) {
        return 'High (25-30%)';
      }
      return 'Medium (15-25%)';
    } else if ((cycleDay >= 8 && cycleDay <= 10) || (cycleDay >= 18 && cycleDay <= 20)) {
      return 'Low (5-10%)';
    }
    return 'Very Low (<5%)';
  };

  // Get cell style based on fertility chance
  const getCellStyle = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const prediction = calculateNextPeriodAndFertility(date);

    const baseStyle = {
      height: '80px',
      p: 1,
      border: '1px solid #e0e0e0',
      cursor: 'pointer',
      position: 'relative',
      bgcolor: 'background.paper',
      '&:hover': {
        bgcolor: 'action.hover'
      }
    };

    if (!prediction) return baseStyle;

    const cycleInfo = calculateNextPeriodAndFertility(date);
    if (!cycleInfo) return baseStyle;

    if (cycleInfo.fertilityChance.includes('High')) {
      return { ...baseStyle, bgcolor: '#ffebee' };
    } else if (cycleInfo.fertilityChance.includes('Medium')) {
      return { ...baseStyle, bgcolor: '#fff3e0' };
    } else if (cycleInfo.fertilityChance.includes('Low')) {
      return { ...baseStyle, bgcolor: '#fff8e1' };
    }
    return baseStyle;
  };

  // Handle date selection
  const handleDateSelect = (day) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selectedDate);
    setOpenDialog(true);
  };

  // Handle period logging
  const handleLogPeriod = () => {
    setCycleData({
      ...cycleData,
      lastPeriod: selectedDate
    });
    setOpenDialog(false);
  };

  // Navigate between months
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <CardContent>
          {/* Calendar Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <IconButton onClick={() => navigateMonth(-1)}>
              <ChevronLeft />
            </IconButton>
            <Typography variant="h5">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </Typography>
            <IconButton onClick={() => navigateMonth(1)}>
              <ChevronRight />
            </IconButton>
          </Box>

          {/* Prediction Info */}
          {cycleData.lastPeriod && (
            <Box sx={{ mb: 3 }}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday color="primary" />
                    <Typography variant="subtitle1">Next Period in:</Typography>
                  </Box>
                  <Typography variant="h6" color="primary">
                    {calculateNextPeriodAndFertility(new Date())?.daysUntilNextPeriod} days
                  </Typography>
                </Box>
              </Paper>
            </Box>
          )}

          {/* Legend */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Chip 
              icon={<Favorite sx={{ color: '#f44336' }} />}
              label="High Fertility (25-30%)" 
              sx={{ bgcolor: '#ffebee' }}
            />
            <Chip 
              icon={<Favorite sx={{ color: '#ff9800' }} />}
              label="Medium Fertility (15-25%)" 
              sx={{ bgcolor: '#fff3e0' }}
            />
            <Chip 
              icon={<Favorite sx={{ color: '#ffd54f' }} />}
              label="Low Fertility (5-10%)" 
              sx={{ bgcolor: '#fff8e1' }}
            />
          </Box>

          {/* Calendar Grid */}
          <Grid container>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <Grid key={day} item xs={12/7}>
                <Box sx={{ p: 1, textAlign: 'center', fontWeight: 'bold' }}>
                  {day}
                </Box>
              </Grid>
            ))}
            
            {Array.from({ length: startingDayIndex }).map((_, index) => (
              <Grid key={`empty-${index}`} item xs={12/7}>
                <Box sx={{ height: '80px' }} />
              </Grid>
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const prediction = calculateNextPeriodAndFertility(date);
              
              return (
                <Grid key={day} item xs={12/7}>
                  <Box 
                    onClick={() => handleDateSelect(day)}
                    sx={getCellStyle(day)}
                  >
                    <Typography>{day}</Typography>
                    {prediction && (
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {prediction.fertilityChance}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          {/* Date Selection Dialog */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>
              {selectedDate?.toLocaleDateString()}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLogPeriod}
                  startIcon={<CalendarToday />}
                >
                  Log Period Start
                </Button>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CycleCalendar;