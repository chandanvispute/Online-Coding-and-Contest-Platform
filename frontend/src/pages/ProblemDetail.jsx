import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { problemAPI, languageAPI, submissionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TestResults from '../components/TestResults';
import SubmissionResult from '../components/SubmissionResult';

function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [problem, setProblem] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchProblemAndLanguages();
  }, [id]);

  useEffect(() => {
    if (selectedLanguage && problem) {
      loadBoilerplateCode();
    }
  }, [selectedLanguage, problem]);

  useEffect(() => {
    if (user && problem) {
      fetchUserSubmissions();
    }
  }, [user, problem]);

  const fetchProblemAndLanguages = async () => {
    try {
      setLoading(true);
      const [problemData, languagesData] = await Promise.all([
        problemAPI.getProblemById(id),
        languageAPI.getAllLanguages()
      ]);

      setProblem(problemData);
      setLanguages(languagesData);

      // Set default language to first available language
      if (languagesData.length > 0) {
        setSelectedLanguage(languagesData[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to load problem. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSubmissions = async () => {
    try {
      const userSubmissions = await submissionAPI.getUserSubmissions(user.id, problem.id);
      setSubmissions(userSubmissions);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    }
  };

  const loadBoilerplateCode = async () => {
    try {
      const boilerplate = await problemAPI.getBoilerplateCode(problem.id, selectedLanguage);
      setCode(boilerplate);
    } catch (error) {
      console.error('Failed to load boilerplate:', error);
      // Set a default template if boilerplate fails
      const selectedLang = languages.find(lang => lang.id === selectedLanguage);
      if (selectedLang) {
        setCode(getDefaultTemplate(selectedLang.name));
      }
    }
  };

  const getDefaultTemplate = (languageName) => {
    const templates = {
      'Java': 'public class Solution {\n    public void solve() {\n        // Write your solution here\n    }\n}',
      'Python': '# Write your solution here\ndef solve():\n    pass',
      'C++': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}',
      'JavaScript': '// Write your solution here\nfunction solve() {\n    \n}',
      'C': '#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}'
    };
    return templates[languageName] || '// Write your solution here';
  };

  const handleLanguageChange = (e) => {
    const newLangId = parseInt(e.target.value);
    setSelectedLanguage(newLangId);
  };

  const handleRunCode = async () => {
    if (!user || !selectedLanguage || !code.trim()) return;

    setIsRunning(true);
    try {
      const response = await submissionAPI.runSampleTestCases(problem.id, selectedLanguage, code);
      setTestResults(response);
    } catch (error) {
      console.error('Error running code:', error);
      alert('Error running code: ' + error.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !selectedLanguage || !code.trim()) return;

    setIsSubmitting(true);
    try {
      const submissionData = {
        problemId: problem.id,
        languageId: selectedLanguage,
        code: code,
        userId: user.id
      };

      const response = await submissionAPI.submitCode(submissionData);
      setSubmissionResult(response);
      
      // Refresh submissions after successful submission
      if (response.submissionId) {
        fetchUserSubmissions();
      }
    } catch (error) {
      console.error('Error submitting code:', error);
      alert('Error submitting code: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-400 bg-green-500/20';
      case 'Medium':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'Hard':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-slate-400 bg-slate-500/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading problem...</div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{error || 'Problem not found'}</h2>
          <button
            onClick={() => navigate('/problems')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/problems')}
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Problems
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-2xl font-bold text-white">
                  {problem.id}. {problem.title}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {problem.topics && problem.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg text-sm"
                  >
                    {topic.name}
                  </span>
                ))}
              </div>

              <div className="text-slate-400 mb-2">
                <span className="font-medium">Time Limit:</span> {problem.timeLimit}ms
              </div>
              <div className="text-slate-400 mb-6">
                <span className="font-medium">Memory Limit:</span> {problem.memoryLimit}MB
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
              <div
                className="text-slate-300 leading-relaxed mb-6"
                dangerouslySetInnerHTML={{ __html: problem.description }}
              />

              {problem.sampleTestCases && problem.sampleTestCases.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Sample Test Cases:</h3>
                  {problem.sampleTestCases.map((testCase, index) => (
                    <div key={index} className="bg-slate-900 rounded-lg p-4 mb-4">
                      <div className="text-slate-300 text-sm">
                        <div className="mb-2">
                          <span className="font-medium text-blue-400">Input:</span>
                          <pre className="mt-1 text-slate-300">{testCase.input}</pre>
                        </div>
                        <div>
                          <span className="font-medium text-green-400">Expected Output:</span>
                          <pre className="mt-1 text-slate-300">{testCase.expectedOutput}</pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col" style={{ maxHeight: 'calc(60vh - 100px)' }}>
            <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-900">
              <div className="flex items-center gap-4">
                <label className="text-slate-400 text-sm font-medium">Language:</label>
                <select
                  value={selectedLanguage || ''}
                  onChange={handleLanguageChange}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  {languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning || !code.trim()}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRunning ? 'Running...' : 'Run Code'}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !code.trim()}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`Write your ${languages.find(l => l.id === selectedLanguage)?.name} code here...`}
                className="w-full h-full p-4 bg-slate-900 text-slate-100 font-mono text-sm focus:outline-none resize-none"
                style={{ minHeight: '400px' }}
                spellCheck="false"
              />
            </div>

            <div className="p-4 border-t border-slate-700 bg-slate-900">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  Selected: <span className="text-white font-medium">{languages.find(l => l.id === selectedLanguage)?.name}</span>
                </span>
                <button
                  onClick={() => loadBoilerplateCode()}
                  className="text-blue-400 hover:text-blue-300 transition"
                >
                  Reset to Template
                </button>
              </div>
            </div>
            </div>

            {/* Submissions History */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4" style={{ maxHeight: 'calc(40vh - 100px)' }}>
              <h3 className="text-lg font-semibold text-white mb-4">Your Submissions</h3>
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(40vh - 160px)' }}>
                {submissions.length > 0 ? (
                  <div className="space-y-2">
                    {submissions.map((submission) => (
                      <div key={submission.id} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-700 hover:border-slate-600 transition">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${submission.status === 'Accepted' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                submission.status === 'Accepted' 
                                  ? 'text-green-400 bg-green-500/20' 
                                  : 'text-red-400 bg-red-500/20'
                              }`}>
                                {submission.status}
                              </span>
                              <span className="text-slate-400 text-xs">{submission.language.name}</span>
                            </div>
                            {submission.executionTime && (
                              <div className="text-slate-500 text-xs mt-1">{submission.executionTime}ms</div>
                            )}
                          </div>
                        </div>
                        <div className="text-slate-400 text-xs">
                          {new Date(submission.submittedAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-slate-400 text-sm">No submissions yet</p>
                    <p className="text-slate-500 text-xs mt-1">Submit your solution to see history</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <TestResults results={testResults} onClose={() => setTestResults(null)} />
      <SubmissionResult result={submissionResult} onClose={() => setSubmissionResult(null)} />
    </div>
  );
}

export default ProblemDetail;
