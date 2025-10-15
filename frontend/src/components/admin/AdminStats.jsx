import React from 'react';

function AdminStats({ stats, loading, onRefresh }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl">Loading statistics...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">Failed to load statistics</div>
        <button
          onClick={onRefresh}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'bg-blue-600' },
    { title: 'Total Problems', value: stats.totalProblems, icon: '🧩', color: 'bg-green-600' },
    { title: 'Total Submissions', value: stats.totalSubmissions, icon: '📝', color: 'bg-purple-600' },
    { title: 'Total Contests', value: stats.totalContests, icon: '🏆', color: 'bg-orange-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{card.title}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg text-2xl`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Problem Difficulty Distribution */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Problems by Difficulty</h3>
          <div className="space-y-3">
            {stats.problemsByDifficulty && Object.entries(stats.problemsByDifficulty).map(([difficulty, count]) => {
              const colors = {
                Easy: 'bg-green-500',
                Medium: 'bg-yellow-500',
                Hard: 'bg-red-500'
              };
              const total = Object.values(stats.problemsByDifficulty).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? (count / total * 100).toFixed(1) : 0;
              
              return (
                <div key={difficulty} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${colors[difficulty]}`}></div>
                    <span>{difficulty}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">{count}</span>
                    <span className="text-sm text-gray-500">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submission Status Distribution */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Submissions by Status</h3>
          <div className="space-y-3">
            {stats.submissionsByStatus && Object.entries(stats.submissionsByStatus).map(([status, count]) => {
              const colors = {
                'Accepted': 'bg-green-500',
                'Wrong Answer': 'bg-red-500',
                'Time Limit Exceeded': 'bg-yellow-500',
                'Runtime Error': 'bg-orange-500',
                'Compilation Error': 'bg-purple-500'
              };
              const total = Object.values(stats.submissionsByStatus).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? (count / total * 100).toFixed(1) : 0;
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${colors[status] || 'bg-gray-500'}`}></div>
                    <span className="text-sm">{status}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">{count}</span>
                    <span className="text-sm text-gray-500">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={onRefresh}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Refresh Statistics
        </button>
      </div>
    </div>
  );
}

export default AdminStats;