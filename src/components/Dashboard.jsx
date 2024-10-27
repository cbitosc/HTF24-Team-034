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
  IconButton,
  Box,
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  Notifications,
  Favorite,
  ExitToApp,
  Water,
  Mood,
  Spa,
  WbSunny,
  Stars,
  NightsStay,
} from '@mui/icons-material';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

import CycleCalendar from './CycleCalendar';
import SymptomTracker from './SymptomTracker';
import Insights from './Insights';
import HealthAndMedication from './HealthandMedication';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Existing functions remain the same
  const calculateNextPeriodWindow = (lastPeriodStart, lastPeriodEnd, cycleLength) => {
    const daysBetween = Math.round((new Date(lastPeriodEnd) - new Date(lastPeriodStart)) / (1000 * 60 * 60 * 24));
    const nextPeriodStart = new Date(lastPeriodStart);
    nextPeriodStart.setDate(nextPeriodStart.getDate() + cycleLength);
    const nextPeriodEnd = new Date(nextPeriodStart);
    nextPeriodEnd.setDate(nextPeriodStart.getDate() + daysBetween);
    
    return {
      start: nextPeriodStart,
      end: nextPeriodEnd
    };
  };

  const determinePhase = (lastPeriodStart, lastPeriodEnd, cycleLength) => {
    const today = new Date();
    const lastStart = new Date(lastPeriodStart);
    const lastEnd = new Date(lastPeriodEnd);
    const periodLength = Math.round((lastEnd - lastStart) / (1000 * 60 * 60 * 24));
    const daysSinceLastPeriod = Math.floor((today - lastStart) / (1000 * 60 * 60 * 24));
    const cycleDay = (daysSinceLastPeriod % cycleLength) + 1;

    if (cycleDay <= periodLength) return "Menstrual";
    if (cycleDay <= 13) return "Follicular";
    if (cycleDay <= 15) return "Ovulation";
    return "Luteal";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPhaseIcon = (phase) => {
    const icons = {
      Menstrual: <Spa sx={{ color: '#d32f2f' }} />,
      Follicular: <WbSunny sx={{ color: '#ed6c02' }} />,
      Ovulation: <Stars sx={{ color: '#9c27b0' }} />,
      Luteal: <NightsStay sx={{ color: '#0288d1' }} />
    };
    return icons[phase] || <Mood />;
  };

  const userData = {
    lastPeriod: {
      start: "2024-10-18",
      end: "2024-10-23"
    },
    cycleLength: 28,
    get nextPeriod() {
      const nextWindow = calculateNextPeriodWindow(
        this.lastPeriod.start,
        this.lastPeriod.end,
        this.cycleLength
      );
      return {
        start: formatDate(nextWindow.start),
        end: formatDate(nextWindow.end)
      };
    },
    get currentPhase() {
      return determinePhase(
        this.lastPeriod.start,
        this.lastPeriod.end,
        this.cycleLength
      );
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        navigate('/login');
      }
    });

    // Add chatbot script when component mounts
    const script1 = document.createElement('script');
    script1.innerHTML = `
      window.embeddedChatbotConfig = {
        chatbotId: "X0HwzCwDpqWFF42C0g_tx",
        domain: "www.chatbase.co"
      }
    `;
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = "https://www.chatbase.co/embed.min.js";
    script2.setAttribute('chatbotId', 'X0HwzCwDpqWFF42C0g_tx');
    script2.setAttribute('domain', 'www.chatbase.co');
    script2.defer = true;
    document.body.appendChild(script2);

    return () => {
      unsubscribe();
      // Clean up scripts when component unmounts
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getPhaseColor = (phase) => {
    const colors = {
      Menstrual: '#ffebee',
      Follicular: '#fff3e0',
      Ovulation: '#f3e5f5',
      Luteal: '#e1f5fe'
    };
    return colors[phase] || '#ffffff';
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
        bgcolor: 'background.default',
        position: 'relative' // Added for chatbot positioning
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
          height: 'calc(100vh - 64px)',
          bgcolor: '#faf5ff',
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
            <Grid item xs={12} sm={6} md={3}>
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
                    <Typography variant="h6">{userData.nextPeriod.start}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      to {userData.nextPeriod.end}
                    </Typography>
                  </div>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
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
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                elevation={2}
                sx={{ 
                  p: 3, 
                  height: '100%',
                  backgroundImage: 'linear-gradient(to bottom right, #fff, #e0f2fe)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Water sx={{ mr: 2, color: 'blue' }} />
                  <div>
                    <Typography variant="body2" color="textSecondary">Last Period</Typography>
                    <Typography variant="h6">{formatDate(userData.lastPeriod.start)}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      to {formatDate(userData.lastPeriod.end)}
                    </Typography>
                  </div>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                elevation={2}
                sx={{ 
                  p: 3, 
                  height: '100%',
                  bgcolor: getPhaseColor(userData.currentPhase)
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {getPhaseIcon(userData.currentPhase)}
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2" color="textSecondary">Current Phase</Typography>
                    <Typography variant="h6">{userData.currentPhase}</Typography>
                  </Box>
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
              {activeTab === 0 && <CycleCalendar />}
              {activeTab === 1 && <SymptomTracker />}
              {activeTab === 2 && <Insights />}
              {activeTab === 3 && <HealthAndMedication />}
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;