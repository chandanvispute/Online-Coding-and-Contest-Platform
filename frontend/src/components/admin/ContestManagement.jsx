import React, { useState, useEffect } from 'react';
import { adminAPI, problemAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function ContestManagement() {
  const { user } = useAuth();
  const [contests, setContests] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingContest, setEditingContest] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    startTime: '',
    endTime: '',
    problemIds: [],
    createdBy: user?.id || 1
  });

  useEffect(() => {
    fetchContests();
    fetchProblems();
  }, []);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllContests();
      setContests(data);
    } catch (error) {
      console.error('Error fetching contests:', error);
      setError('Failed to load contests');
    } finally {
      setLoading(false);
    }
  };

  const fetchProblems = async () => {
    try {
      const data = await problemAPI.getAllProblems();
      setProblems(data);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const contestData = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      };

      if (editingContest) {
        await adminAPI.updateContest(editingContest.id, contestData);
        alert('Contest updated successfully');
      } else {
        await adminAPI.createContest(contestData);
        alert('Contest created successfully');
      }

      resetForm();
      fetchContests();
    } catch (error) {
      console.error('Error saving contest:', error);
      alert('Failed to save contest');
    }
  };

  const handleDelete = async (contestId) => {
    if (!confirm('Are you sure you want to delete this contest? This action cannot be undone.')) {
      return;
    }

    try {
      await adminAPI.deleteContest(contestId);
      setContests(contests.filter(c => c.id !== contestId));
      alert('Contest deleted successfully');
    } catch (error) {
      console.error('Error deleting contest:', error);
      alert('Failed to delete contest');
    }
  };

  const handleEdit = (contest) => {
    setEditingContest(contest);
    setFormData({
      name: contest.name,
      startTime: new Date(contest.startTime).toISOString().slice(0, 16),
      endTime: new Date(contest.endTime).toISOString().slice(0, 16),
      problemIds: contest.problems?.map(p => p.id) || [],
      createdBy: user?.id || 1
    });
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      startTime: '',
      endTime: '',
      problemIds: [],
      createdBy: user?.id || 1
    });
    setEditingContest(null);
    setShowCreateForm(false);
  };

  const handleProblemToggle = (problemId) => {
    setFormData({
      ...formData,
      problemIds: formData.problemIds.includes(problemId)
        ? formData.problemIds.filter(id => id !== problemId)
        : [...formData.problemIds, problemId]
    });
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  const getContestStatus = (contest) => {
    const now = new Date();
    const startTime = new Date(contest.startTime);
    const endTime = new Date(contest.endTime);

    if (now < startTime) {
      return { status: 'UPCOMING', color: 'text-blue-500', bg: 'bg-blue-100' };
    } else if (now > endTime) {
      return { status: 'ENDED', color: 'text-gray-500', bg: 'bg-gray-100' };
    } else {
      return { status: 'ONGOING', color: 'text-green-500', bg: 'bg-green-100' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl">Loading contests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contest Management</h2>
        <div className="space-x-3">
          <button
            onClick={fetchContests}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Create Contest
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-600 text-white p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingContest ? 'Edit Contest' : 'Create New Contest'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Contest Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Time</label>
                  <input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">End Time</label>
                  <input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              {/* Problem Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Select Problems</label>
                <div className="bg-gray-700 border border-gray-600 rounded-lg p-3 max-h-60 overflow-y-auto">
                  {problems.map((problem) => (
                    <div key={problem.id} className="flex items-center space-x-3 py-2">
                      <input
                        type="checkbox"
                        id={`problem-${problem.id}`}
                        checked={formData.problemIds.includes(problem.id)}
                        onChange={() => handleProblemToggle(problem.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded"
                      />
                      <label htmlFor={`problem-${problem.id}`} className="flex-1 text-sm text-white">
                        <span className="font-medium">{problem.title}</span>
                        <span className={`ml-2 px-2 py-1 text-xs rounded ${
                          problem.difficulty === 'Easy' ? 'bg-green-600' :
                          problem.difficulty === 'Medium' ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  Selected: {formData.problemIds.length} problem(s)
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {editingContest ? 'Update Contest' : 'Create Contest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contests Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Contest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Problems
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {contests.map((contest) => {
                const statusInfo = getContestStatus(contest);
                
                return (
                  <tr key={contest.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-white">{contest.name}</div>
                        <div className="text-sm text-gray-400">Created by: {contest.createdBy}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.bg} ${statusInfo.color}`}>
                        {statusInfo.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div>Start: {formatDateTime(contest.startTime)}</div>
                      <div>End: {formatDateTime(contest.endTime)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {contest.problems?.length || 0} problems
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(contest)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(contest.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {contests.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No contests found.</div>
        </div>
      )}
    </div>
  );
}

export default ContestManagement;