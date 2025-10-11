import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import { PlayArrow, History } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { ProblemDetailDTO, Language, SubmissionResponse, Submission } from '../../types';
import { problemsAPI, languagesAPI, submissionsAPI } from '../../services/api';
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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ProblemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [problem, setProblem] = useState<ProblemDetailDTO | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<number>(1);
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResponse | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProblem();
      fetchLanguages();
    }
  }, [id]);

  useEffect(() => {
    if (problem && selectedLanguage) {
      const boilerplate = problem.boilerplates[selectedLanguage] || '';
      setCode(boilerplate);
    }
  }, [problem, selectedLanguage]);

  useEffect(() => {
    if (user && id) {
      fetchSubmissions();
    }
  }, [user, id]);

  const fetchProblem = async () => {
    try {
      const data = await problemsAPI.getById(Number(id));
      setProblem(data);
    } catch (error) {
      console.error('Error fetching problem:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLanguages = async () => {
    try {
      const data = await languagesAPI.getAll();
      setLanguages(data);
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  };

  const fetchSubmissions = async () => {
    if (!user || !id) return;
    try {
      const data = await submissionsAPI.getUserSubmissions(user.id, Number(id));
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleSubmit = async () => {
    if (!user || !problem) return;

    setSubmitting(true);
    setSubmissionResult(null);

    try {
      const result = await submissionsAPI.submit({
        problemId: problem.id,
        languageId: selectedLanguage,
        userId: user.id,
        code,
      });
      setSubmissionResult(result);
      fetchSubmissions(); // Refresh submissions
    } catch (error) {
      console.error('Error submitting code:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'Hard':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'success';
      case 'Wrong Answer':
        return 'error';
      case 'Time Limit Exceeded':
        return 'warning';
      case 'Runtime Error':
        return 'error';
      case 'Compilation Error':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading problem...</Typography>
      </Box>
    );
  }

  if (!problem) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="error">
          Problem not found
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: 'fit-content' }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Typography variant="h4" component="h1">
              {problem.title}
            </Typography>
            <Chip
              label={problem.difficulty}
              color={getDifficultyColor(problem.difficulty) as any}
            />
          </Box>

          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label="Description" />
            <Tab label="Submissions" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              Problem Description
            </Typography>
            <Typography variant="body1" paragraph style={{ whiteSpace: 'pre-wrap' }}>
              {problem.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Constraints
            </Typography>
            <Typography variant="body2" paragraph style={{ whiteSpace: 'pre-wrap' }}>
              {problem.constraints}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Example Test Cases
            </Typography>
            {problem.testCases.map((testCase, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle2">
                  Test Case {index + 1}: {testCase.description}
                </Typography>
                <Paper sx={{ p: 1, backgroundColor: '#f5f5f5', mt: 1 }}>
                  <Typography variant="body2" component="pre">
                    {testCase.input}
                  </Typography>
                </Paper>
              </Box>
            ))}

            <Box mt={2}>
              <Typography variant="body2" color="textSecondary">
                Time Limit: {problem.timeLimit}ms | Memory Limit: {problem.memoryLimit}MB
              </Typography>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Your Submissions
            </Typography>
            {submissions.length === 0 ? (
              <Typography color="textSecondary">No submissions yet</Typography>
            ) : (
              submissions.map((submission) => (
                <Paper key={submission.id} sx={{ p: 2, mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Chip
                        label={submission.status}
                        color={getStatusColor(submission.status) as any}
                        size="small"
                      />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {submission.language.name} • {submission.executionTime}ms
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(submission.submittedAt).toLocaleString()}
                    </Typography>
                  </Box>
                </Paper>
              ))
            )}
          </TabPanel>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Code Editor</Typography>
            <Box display="flex" gap={2} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Language</InputLabel>
                <Select
                  value={selectedLanguage}
                  label="Language"
                  onChange={(e) => setSelectedLanguage(Number(e.target.value))}
                >
                  {languages.map((lang) => (
                    <MenuItem key={lang.id} value={lang.id}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={handleSubmit}
                disabled={!isAuthenticated || submitting}
              >
                {submitting ? 'Running...' : 'Submit'}
              </Button>
            </Box>
          </Box>

          <Box sx={{ border: '1px solid #ddd', borderRadius: 1, mb: 2 }}>
            <Editor
              height="400px"
              language={languages.find(l => l.id === selectedLanguage)?.name.toLowerCase() || 'javascript'}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
              }}
            />
          </Box>

          {!isAuthenticated && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Please login to submit your solution
            </Alert>
          )}

          {submissionResult && (
            <Alert
              severity={submissionResult.status === 'Accepted' ? 'success' : 'error'}
              sx={{ mb: 2 }}
            >
              <Typography variant="subtitle2">
                Status: {submissionResult.status}
              </Typography>
              {submissionResult.status === 'Accepted' ? (
                <Typography variant="body2">
                  Execution Time: {submissionResult.executionTime}ms
                </Typography>
              ) : (
                <Box>
                  <Typography variant="body2">
                    {submissionResult.error}
                  </Typography>
                  {submissionResult.testCaseFailed && (
                    <Typography variant="body2">
                      Failed on: {submissionResult.testCaseFailed}
                    </Typography>
                  )}
                </Box>
              )}
            </Alert>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ProblemDetail;