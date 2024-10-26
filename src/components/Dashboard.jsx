/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Box,
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  Notifications,
  Favorite,
  BarChart,
  MenuBook,
  ExitToApp,
} from '@mui/icons-material';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

import CycleCalendar from './Cyclecalendar';
import SymptomTracker from './SymptomTracker';
import Insights from './Insights';
import HealthAndMedication from './HealthandMedication';


const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        navigate('/login');
      }
    });

    return unsubscribe;
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Mock user data
  const userData = {
    nextPeriod: "November 15, 2024",
    cycleLength: 28,
    lastPeriod: "October 18, 2024",
    symptoms: ["Cramps", "Headache", "Fatigue"]
  };

  if (!user) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: 'background.default'
      }}
    >
      {/* Navigation Bar */}
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <Favorite sx={{ mr: 2, color: 'pink' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CycleCare
          </Typography>
          <Typography variant="body1" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
            Welcome, {user.displayName || user.email}
          </Typography>
          <IconButton color="inherit">
            <Notifications />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          height: 'calc(100vh - 64px)', // Subtract AppBar height
          bgcolor: '#faf5ff', // Light purple background
        }}
      >
        <Container 
          maxWidth="lg" 
          sx={{ 
            py: 4,
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Quick Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Paper 
                elevation={2}
                sx={{ 
                  p: 3, 
                  height: '100%',
                  backgroundImage: 'linear-gradient(to bottom right, #fff, #fdf2f8)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarToday sx={{ mr: 2, color: 'pink' }} />
                  <div>
                    <Typography variant="body2" color="textSecondary">Next Period</Typography>
                    <Typography variant="h6">{userData.nextPeriod}</Typography>
                  </div>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Paper 
                elevation={2}
                sx={{ 
                  p: 3, 
                  height: '100%',
                  backgroundImage: 'linear-gradient(to bottom right, #fff, #f3e8ff)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTime sx={{ mr: 2, color: 'purple' }} />
                  <div>
                    <Typography variant="body2" color="textSecondary">Cycle Length</Typography>
                    <Typography variant="h6">{userData.cycleLength} days</Typography>
                  </div>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Paper 
                elevation={2}
                sx={{ 
                  p: 3, 
                  height: '100%',
                  backgroundImage: 'linear-gradient(to bottom right, #fff, #e0f2fe)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BarChart sx={{ mr: 2, color: 'blue' }} />
                  <div>
                    <Typography variant="body2" color="textSecondary">Last Period</Typography>
                    <Typography variant="h6">{userData.lastPeriod}</Typography>
                  </div>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Tab Navigation */}
          <Paper 
            elevation={2}
            sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                bgcolor: 'background.paper'
              }}
            >
              <Tab label="Calendar" />
              <Tab label="Symptoms" />
              <Tab label="Insights" />
              <Tab label="Health and Medication" />
            </Tabs>

            {/* Tab Content */}
                        <Box sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 3,
              bgcolor: 'background.paper'
            }}>
              {activeTab === 0 && (
                <CycleCalendar />
              )}
              {activeTab === 1 && (
                <div>
                  {/* <Typography variant="h6" gutterBottom>Recent Symptoms</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {userData.symptoms.map((symptom, index) => (
                      <Chip 
                        key={index} 
                        label={symptom} 
                        sx={{
                          bgcolor: 'pink.50',
                          color: 'pink.700',
                          '&:hover': {
                            bgcolor: 'pink.100'
                          }
                        }}
                      />
                    ))}
                  </Box> */}
                  <SymptomTracker />
                </div>
              )}

              {activeTab === 2 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  {/* <Typography color="textSecondary">Insights Coming Soon</Typography> */}
                  <Insights />
                </Box>
              )}

              {activeTab === 3 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  {/* <Typography color="textSecondary">Health and Medication Content Coming Soon</Typography> */}
                  <HealthAndMedication />
                </Box>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;