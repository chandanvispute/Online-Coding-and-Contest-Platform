import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import {
  People,
  Quiz,
  Assignment,
  EmojiEvents,
  Add,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DashboardStats } from '../../types';
import { adminAPI } from '../../services/api';
import UserManagement from './UserManagement';
import ProblemManagement from './ProblemManagement';

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
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await adminAPI.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Box sx={{ color, fontSize: 40 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/admin/problems/create')}
        >
          Create Problem
        </Button>
      </Box>

      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="Users" />
        <Tab label="Problems" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        {stats && (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Users"
                  value={stats.totalUsers}
                  icon={<People />}
                  color="#1976d2"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Problems"
                  value={stats.totalProblems}
                  icon={<Quiz />}
                  color="#388e3c"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Submissions"
                  value={stats.totalSubmissions}
                  icon={<Assignment />}
                  color="#f57c00"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Contests"
                  value={stats.totalContests}
                  icon={<EmojiEvents />}
                  color="#7b1fa2"
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Problems by Difficulty
                    </Typography>
                    <Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography>Easy</Typography>
                        <Typography color="success.main">
                          {stats.problemsByDifficulty.Easy}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography>Medium</Typography>
                        <Typography color="warning.main">
                          {stats.problemsByDifficulty.Medium}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography>Hard</Typography>
                        <Typography color="error.main">
                          {stats.problemsByDifficulty.Hard}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Submissions by Status
                    </Typography>
                    <Box>
                      {Object.entries(stats.submissionsByStatus).map(([status, count]) => (
                        <Box key={status} display="flex" justifyContent="space-between" mb={1}>
                          <Typography>{status}</Typography>
                          <Typography
                            color={status === 'Accepted' ? 'success.main' : 'text.secondary'}
                          >
                            {count}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <UserManagement />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <ProblemManagement />
      </TabPanel>
    </Box>
  );
};

export default AdminDashboard;