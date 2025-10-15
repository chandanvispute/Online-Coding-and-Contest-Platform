import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import UserManagement from '../components/admin/UserManagement';
import ProblemManagement from '../components/admin/ProblemManagement';
import ContestManagement from '../components/admin/ContestManagement';
import AdminStats from '../components/admin/AdminStats';

function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      return;
    }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'stats', name: 'Dashboard', icon: '📊' },
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'problems', name: 'Problems', icon: '🧩' },
    { id: 'contests', name: 'Contests', icon: '🏆' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8 border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'text-blue-400 border-blue-400'
                  : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'stats' && (
            <AdminStats stats={stats} loading={loading} onRefresh={fetchStats} />
          )}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'problems' && <ProblemManagement />}
          {activeTab === 'contests' && <ContestManagement />}
        </div>
      </div>
    </div>
  );
}

export default Admin;