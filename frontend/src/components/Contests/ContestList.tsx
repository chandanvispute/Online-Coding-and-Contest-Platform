import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import { EmojiEvents, Schedule, People } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Contest } from '../../types';
import { contestsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`contest-tabpanel-${index}`}
      aria-labelledby={`contest-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ContestList: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [allContests, setAllContests] = useState<Contest[]>([]);
  const [activeContests, setActiveContests] = useState<Contest[]>([]);
  const [upcomingContests, setUpcomingContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const [all, active, upcoming] = await Promise.all([
        contestsAPI.getAll(),
        contestsAPI.getActive(),
        contestsAPI.getUpcoming(),
      ]);
      setAllContests(all);
      setActiveContests(active);
      setUpcomingContests(upcoming);
    } catch (error) {
      console.error('Error fetching contests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (contestId: number) => {
    if (!user) return;
    try {
      await contestsAPI.register(contestId, user.id);
      // Refresh contests to update participant count
      fetchContests();
    } catch (error) {
      console.error('Error registering for contest:', error);
    }
  };

  const getContestStatus = (contest: Contest) => {
    const now = new Date();
    const startTime = new Date(contest.startTime);
    const endTime = new Date(contest.endTime);

    if (now < startTime) return 'upcoming';
    if (now >= startTime && now <= endTime) return 'active';
    return 'ended';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'upcoming':
        return 'info';
      case 'ended':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const ContestCard: React.FC<{ contest: Contest }> = ({ contest }) => {
    const status = getContestStatus(contest);
    const isRegistered = contest.participants.some(p => p.id === user?.id);

    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Typography variant="h6" component="h2">
              {contest.name}
            </Typography>
            <Chip
              label={status.toUpperCase()}
              color={getStatusColor(status) as any}
              size="small"
            />
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Schedule fontSize="small" />
            <Typography variant="body2" color="textSecondary">
              {formatDateTime(contest.startTime)} - {formatDateTime(contest.endTime)}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <People fontSize="small" />
            <Typography variant="body2" color="textSecondary">
              {contest.participants.length} participants
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <EmojiEvents fontSize="small" />
            <Typography variant="body2" color="textSecondary">
              {contest.problems.length} problems
            </Typography>
          </Box>

          <Typography variant="body2" color="textSecondary">
            Created by: {contest.createdBy.username}
          </Typography>
        </CardContent>

        <CardActions>
          {status === 'active' || status === 'ended' ? (
            <Button
              size="small"
              variant="contained"
              onClick={() => navigate(`/contests/${contest.id}`)}
            >
              {status === 'active' ? 'Enter Contest' : 'View Results'}
            </Button>
          ) : (
            <Button
              size="small"
              variant={isRegistered ? 'outlined' : 'contained'}
              onClick={() => isRegistered ? navigate(`/contests/${contest.id}`) : handleRegister(contest.id)}
              disabled={!isAuthenticated}
            >
              {isRegistered ? 'View Contest' : 'Register'}
            </Button>
          )}
        </CardActions>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading contests...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Contests
      </Typography>

      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label={`Active (${activeContests.length})`} />
        <Tab label={`Upcoming (${upcomingContests.length})`} />
        <Tab label={`All (${allContests.length})`} />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        {activeContests.length === 0 ? (
          <Typography variant="h6" color="textSecondary" textAlign="center">
            No active contests
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {activeContests.map((contest) => (
              <Grid item xs={12} md={6} lg={4} key={contest.id}>
                <ContestCard contest={contest} />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {upcomingContests.length === 0 ? (
          <Typography variant="h6" color="textSecondary" textAlign="center">
            No upcoming contests
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {upcomingContests.map((contest) => (
              <Grid item xs={12} md={6} lg={4} key={contest.id}>
                <ContestCard contest={contest} />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {allContests.length === 0 ? (
          <Typography variant="h6" color="textSecondary" textAlign="center">
            No contests available
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {allContests.map((contest) => (
              <Grid item xs={12} md={6} lg={4} key={contest.id}>
                <ContestCard contest={contest} />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>
    </Box>
  );
};

export default ContestList;