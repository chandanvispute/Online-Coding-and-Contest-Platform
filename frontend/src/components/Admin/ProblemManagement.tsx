import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ProblemListDTO } from '../../types';
import { problemsAPI, adminAPI } from '../../services/api';

const ProblemManagement: React.FC = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState<ProblemListDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    problem: ProblemListDTO | null;
  }>({ open: false, problem: null });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const data = await problemsAPI.getAll();
      setProblems(data);
    } catch (error) {
      console.error('Error fetching problems:', error);
      setError('Failed to fetch problems');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProblem = async () => {
    if (!deleteDialog.problem) return;

    try {
      await adminAPI.deleteProblem(deleteDialog.problem.id);
      setSuccess('Problem deleted successfully');
      setDeleteDialog({ open: false, problem: null });
      fetchProblems();
    } catch (error) {
      console.error('Error deleting problem:', error);
      setError('Failed to delete problem');
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading problems...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Problem Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/admin/problems/create')}
        >
          Create Problem
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Difficulty</TableCell>
              <TableCell>Acceptance Rate</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {problems.map((problem) => (
              <TableRow key={problem.id} hover>
                <TableCell>{problem.id}</TableCell>
                <TableCell>
                  <Typography
                    variant="body1"
                    sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                    onClick={() => navigate(`/problems/${problem.id}`)}
                  >
                    {problem.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={problem.difficulty}
                    color={getDifficultyColor(problem.difficulty) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{problem.acceptanceRate.toFixed(1)}%</TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      startIcon={<Edit />}
                      onClick={() => navigate(`/admin/problems/${problem.id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => setDeleteDialog({ open: true, problem })}
                    >
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {problems.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="textSecondary">
            No problems found
          </Typography>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, problem: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete problem "{deleteDialog.problem?.title}"?
            This action cannot be undone and will also delete all related submissions.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, problem: null })}>
            Cancel
          </Button>
          <Button onClick={handleDeleteProblem} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProblemManagement;