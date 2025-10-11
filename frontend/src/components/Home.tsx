import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Container,
} from '@mui/material';
import {
  Code,
  EmojiEvents,
  TrendingUp,
  People,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Code sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Practice Problems',
      description: 'Solve coding problems across different difficulty levels and topics.',
      action: () => navigate('/problems'),
      buttonText: 'Browse Problems',
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 40, color: '#ff9800' }} />,
      title: 'Contests',
      description: 'Participate in coding contests and compete with other developers.',
      action: () => navigate('/contests'),
      buttonText: 'View Contests',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: '#4caf50' }} />,
      title: 'Track Progress',
      description: 'Monitor your coding progress and see your improvement over time.',
      action: () => navigate('/profile'),
      buttonText: 'View Profile',
    },
    {
      icon: <People sx={{ fontSize: 40, color: '#9c27b0' }} />,
      title: 'Community',
      description: 'Join a community of developers and learn from each other.',
      action: () => navigate('/leaderboard'),
      buttonText: 'Leaderboard',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to CodePlatform
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Master your coding skills with our comprehensive platform
        </Typography>
        
        {!isAuthenticated && (
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              sx={{ mr: 2 }}
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h2" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  variant="contained"
                  onClick={feature.action}
                  size="small"
                >
                  {feature.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Why Choose CodePlatform?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Comprehensive Problem Set
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Access hundreds of coding problems ranging from beginner to advanced levels.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Multiple Languages
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Code in your preferred language - Java, Python, C++, and more.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Real-time Feedback
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Get instant feedback on your solutions with detailed test results.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;