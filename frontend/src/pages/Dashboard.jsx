import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { problemAPI, submissionAPI } from '../services/api';

function Dashboard() {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [problemsData, statsData, submissionsData] = await Promise.all([
        problemAPI.getAllProblems(),
        submissionAPI.getUserStats(user.id),
        submissionAPI.getUserRecentSubmissions(user.id)
      ]);
      
      setProblems(problemsData);
      setUserStats(statsData);
      setRecentSubmissions(submissionsData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from problems and user data
  const totalProblems = problems.length;
  const easyProblems = problems.filter(p => p.difficulty === 'Easy').length;
  const mediumProblems = problems.filter(p => p.difficulty === 'Medium').length;
  const hardProblems = problems.filter(p => p.difficulty === 'Hard').length;
  
  const stats = [
    {
      label: 'Easy',
      solved: userStats?.easySolved || 0,
      total: easyProblems,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500',
    },
    {
      label: 'Medium',
      solved: userStats?.mediumSolved || 0,
      total: mediumProblems,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500',
    },
    {
      label: 'Hard',
      solved: userStats?.hardSolved || 0,
      total: hardProblems,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500',
    },
  ];

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'text-green-400 bg-green-500/20';
      case 'Wrong Answer':
        return 'text-red-400 bg-red-500/20';
      case 'Runtime Error':
      case 'Compilation Error':
        return 'text-orange-400 bg-orange-500/20';
      default:
        return 'text-slate-400 bg-slate-500/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Welcome back, {user?.username || 'User'}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-400 text-sm font-medium">Total Solved</h3>
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-white">{userStats?.totalSolved || 0}</p>
            <p className="text-sm text-slate-500 mt-1">out of {totalProblems} problems</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-400 text-sm font-medium">Contest Rank</h3>
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-white">#--</p>
            <p className="text-sm text-slate-500 mt-1">Coming soon</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-400 text-sm font-medium">Acceptance Rate</h3>
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-white">{userStats?.acceptanceRate || 0}%</p>
            <p className="text-sm text-slate-500 mt-1">Recent submissions</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-400 text-sm font-medium">Streak</h3>
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-white">{userStats?.streak || 0} days</p>
            <p className="text-sm text-slate-500 mt-1">Keep it up!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">{stat.label}</h3>
                <span className={`text-2xl font-bold ${stat.color}`}>
                  {stat.solved}/{stat.total}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 mb-2 overflow-hidden">
                <div
                  className={`h-full ${stat.bgColor} ${stat.borderColor} border-r-4 transition-all duration-500`}
                  style={{ width: `${stat.total > 0 ? (stat.solved / stat.total) * 100 : 0}%` }}
                ></div>
              </div>
              <p className="text-sm text-slate-400">{stat.total > 0 ? Math.round((stat.solved / stat.total) * 100) : 0}% completed</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          {recentSubmissions.length > 0 ? (
            <div className="space-y-4">
              {recentSubmissions.map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full ${submission.status === 'Accepted' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{submission.problem.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(submission.status)}`}>
                          {submission.status}
                        </span>
                        <span className="text-slate-400 text-sm">{submission.language.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-400 text-sm">{formatTimeAgo(submission.submittedAt)}</div>
                    {submission.executionTime && (
                      <div className="text-slate-500 text-xs mt-1">{submission.executionTime}ms</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-slate-400 text-lg">No recent activity</p>
              <p className="text-slate-500 text-sm mt-2">Start solving problems to see your activity here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
