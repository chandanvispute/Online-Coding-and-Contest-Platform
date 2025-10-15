import React, { useState, useEffect } from 'react';
import { adminAPI, problemAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function ProblemManagement() {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    constraints: '',
    difficulty: 'Easy',
    timeLimit: 2000,
    memoryLimit: 256,
    testCases: [''],
    expectedOutputs: [''],
    createdBy: user?.id || 1
  });

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const data = await problemAPI.getAllProblems();
      setProblems(data);
    } catch (error) {
      console.error('Error fetching problems:', error);
      setError('Failed to load problems');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const problemData = {
        ...formData,
        testCases: formData.testCases.filter(tc => tc.trim() !== ''),
        expectedOutputs: formData.expectedOutputs.filter(eo => eo.trim() !== ''),
      };

      if (editingProblem) {
        await adminAPI.updateProblem(editingProblem.id, problemData);
        alert('Problem updated successfully');
      } else {
        await adminAPI.createProblem(problemData);
        alert('Problem created successfully');
      }

      resetForm();
      fetchProblems();
    } catch (error) {
      console.error('Error saving problem:', error);
      alert('Failed to save problem');
    }
  };

  const handleDelete = async (problemId) => {
    if (!confirm('Are you sure you want to delete this problem? This action cannot be undone.')) {
      return;
    }

    try {
      await adminAPI.deleteProblem(problemId);
      setProblems(problems.filter(p => p.id !== problemId));
      alert('Problem deleted successfully');
    } catch (error) {
      console.error('Error deleting problem:', error);
      alert('Failed to delete problem');
    }
  };

  const handleEdit = (problem) => {
    setEditingProblem(problem);
    setFormData({
      title: problem.title,
      description: problem.description,
      constraints: problem.constraints || '',
      difficulty: problem.difficulty,
      timeLimit: problem.timeLimit,
      memoryLimit: problem.memoryLimit,
      testCases: [''], // Simplified for demo
      expectedOutputs: [''], // Simplified for demo
      createdBy: user?.id || 1
    });
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      constraints: '',
      difficulty: 'Easy',
      timeLimit: 2000,
      memoryLimit: 256,
      testCases: [''],
      expectedOutputs: [''],
      createdBy: user?.id || 1
    });
    setEditingProblem(null);
    setShowCreateForm(false);
  };

  const addTestCase = () => {
    setFormData({
      ...formData,
      testCases: [...formData.testCases, ''],
      expectedOutputs: [...formData.expectedOutputs, '']
    });
  };

  const removeTestCase = (index) => {
    setFormData({
      ...formData,
      testCases: formData.testCases.filter((_, i) => i !== index),
      expectedOutputs: formData.expectedOutputs.filter((_, i) => i !== index)
    });
  };

  const updateTestCase = (index, field, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl">Loading problems...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Problem Management</h2>
        <div className="space-x-3">
          <button
            onClick={fetchProblems}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Create Problem
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
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingProblem ? 'Edit Problem' : 'Create New Problem'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white h-32"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Constraints</label>
                <textarea
                  value={formData.constraints}
                  onChange={(e) => setFormData({...formData, constraints: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white h-24"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Time Limit (ms)</label>
                  <input
                    type="number"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData({...formData, timeLimit: parseInt(e.target.value)})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Memory Limit (MB)</label>
                  <input
                    type="number"
                    value={formData.memoryLimit}
                    onChange={(e) => setFormData({...formData, memoryLimit: parseInt(e.target.value)})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              {/* Test Cases */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Test Cases</label>
                  <button
                    type="button"
                    onClick={addTestCase}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Add Test Case
                  </button>
                </div>
                
                {formData.testCases.map((testCase, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 p-3 bg-gray-700 rounded">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Input</label>
                      <textarea
                        value={testCase}
                        onChange={(e) => updateTestCase(index, 'testCases', e.target.value)}
                        className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 text-white text-sm h-20"
                        placeholder="Test case input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Expected Output</label>
                      <div className="flex space-x-2">
                        <textarea
                          value={formData.expectedOutputs[index] || ''}
                          onChange={(e) => updateTestCase(index, 'expectedOutputs', e.target.value)}
                          className="flex-1 bg-gray-600 border border-gray-500 rounded px-2 py-1 text-white text-sm h-20"
                          placeholder="Expected output"
                        />
                        {formData.testCases.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTestCase(index)}
                            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
                  {editingProblem ? 'Update Problem' : 'Create Problem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Problems Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Problem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Limits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {problems.map((problem) => (
                <tr key={problem.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">{problem.title}</div>
                      <div className="text-sm text-gray-400">ID: {problem.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div>{problem.timeLimit}ms</div>
                    <div>{problem.memoryLimit}MB</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(problem)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(problem.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {problems.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No problems found.</div>
        </div>
      )}
    </div>
  );
}

export default ProblemManagement;