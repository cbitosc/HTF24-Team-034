/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Link,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Fade,
} from '@mui/material';
import {
  InfoOutlined,
  TipsAndUpdatesOutlined,
  BookOutlined,
} from '@mui/icons-material';

const mockApi = {
  getInsights: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          generalInfo: "Fertility and hormonal health are closely linked. Hormones such as estrogen, progesterone, and testosterone play a crucial role in regulating the menstrual cycle, ovulation, and overall reproductive health.",
          tips: [
            "Maintain a Balanced Diet",
            "Stay Active",
            "Manage Stress",
            "Get Adequate Sleep",
            "Avoid Smoking and Excessive Alcohol",
          ],
          resources: [
            { title: "Understanding PCOS", url: "https://www.mayoclinic.org/diseases-conditions/pcos/symptoms-causes/syc-20353439" },
            { title: "Menstrual Cycle Basics", url: "https://www.nichd.nih.gov/health/topics/menstruation" },
            { title: "Hormone Therapy", url: "https://www.womenshealth.gov/a-z-topics/hormone-therapy" },
            { title: "Reproductive Health", url: "https://www.cdc.gov/reproductivehealth/index.html" },
          ],
        });
      }, 1000); // Simulate network delay
    });
  },
};

const Insights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  // eslint-disable-next-line no-unused-vars
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    mockApi.getInsights().then((data) => {
      setInsights(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Fade in={!loading} timeout={1000}>
        <Paper sx={{ p: 4, borderRadius: 2, boxShadow: theme.shadows[4] }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            Fertility and Hormonal Health
          </Typography>

          {/* General Information Section */}
          <Box mb={4}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: theme.palette.secondary.main }}>
              <InfoOutlined sx={{ mr: 1 }} />
              General Information
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: theme.palette.text.secondary }}>
              {insights.generalInfo}
            </Typography>
          </Box>

          {/* Tips Section */}
          <Box mb={4}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: theme.palette.secondary.main }}>
              <TipsAndUpdatesOutlined sx={{ mr: 1 }} />
              Tips for Hormonal Health
            </Typography>
            <List>
              {insights.tips.map((tip, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemText primary={tip} sx={{ color: theme.palette.text.secondary }} />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Resources Section */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: theme.palette.secondary.main }}>
              <BookOutlined sx={{ mr: 1 }} />
              Resources
            </Typography>
            <Grid container spacing={2}>
              {insights.resources.map((resource, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Link href={resource.url} target="_blank" rel="noopener noreferrer" underline="hover" sx={{ color: theme.palette.primary.main }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {resource.title}
                    </Typography>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default Insights;