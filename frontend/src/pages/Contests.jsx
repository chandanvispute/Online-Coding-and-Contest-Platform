import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { contestAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Contests() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('available');
  const [registrationStatus, setRegistrationStatus] = useState({});

  useEffect(() => {
    fetchContests();
  }, [activeTab, user]);

  const fetchContests = async () => {
    try {
      setLoading(true);
      let data;

      switch (activeTab) {
        case 'upcoming':
          data = await contestAPI.getUpcomingContests();
          break;
        case 'ongoing':
          data = await contestAPI.getOngoingContests();
          break;
        case 'participated':
          if (user) {
            data = await contestAPI.getUserParticipatedContests(user.id);
          } else {
            data = [];
          }
          break;
        default:
          data = await contestAPI.getAvailableContests();
      }

      setContests(data);

      // Check registration status for each contest if user is logged in
      if (user && data.length > 0) {
        const statusPromises = data.map(async (contest) => {
          try {
            const response = await contestAPI.isUserRegistered(contest.id, user.id);
            return { contestId: contest.id, registered: response.registered };
          } catch (error) {
            console.error(`Error checking registration for contest ${contest.id}:`, error);
            return { contestId: contest.id, registered: false };
          }
        });

        const statuses = await Promise.all(statusPromises);
        const statusMap = {};
        statuses.forEach(status => {
          statusMap[status.contestId] = status.registered;
        });
        setRegistrationStatus(statusMap);
      }
    } catch (error) {
      console.error('Error fetching contests:', error);
      setError('Failed to load contests');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (contestId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await contestAPI.registerForContest(contestId, user.id);
      if (response.success) {
        alert('Successfully registered for contest!');
        // Update registration status immediately
        setRegistrationStatus(prev => ({
          ...prev,
          [contestId]: true
        }));
        fetchContests(); // Refresh the list
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error('Error registering for contest:', error);
      alert('Failed to register for contest');
    }
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

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading contests...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Contests</h1>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'available'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            Available
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'upcoming'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'ongoing'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            Ongoing
          </button>
          {user && (
            <button
              onClick={() => setActiveTab('participated')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'participated'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              Participated
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Contests Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contests.map((contest) => {
            const statusInfo = getContestStatus(contest);
            const isRegistered = registrationStatus[contest.id] || false;

            return (
              <div
                key={contest.id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{contest.name}</h3>
                  <div className="flex flex-col items-end space-y-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}
                    >
                      {statusInfo.status}
                    </span>
                    {isRegistered && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                        Registered
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="text-sm text-gray-400">
                    <span className="font-medium">Start:</span> {formatDateTime(contest.startTime)}
                  </div>
                  <div className="text-sm text-gray-400">
                    <span className="font-medium">End:</span> {formatDateTime(contest.endTime)}
                  </div>
                </div>

                <div className="flex space-x-3">
                  {statusInfo.status !== 'ENDED' && activeTab !== 'participated' && (
                    <button
                      onClick={() => handleRegister(contest.id)}
                      disabled={isRegistered}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${isRegistered
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                    >
                      {isRegistered ? 'Registered' : 'Register'}
                    </button>
                  )}

                  <button
                    onClick={() => navigate(`/contests/${contest.id}`)}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors bg-gray-700 hover:bg-gray-600 text-white ${statusInfo.status !== 'ENDED' && activeTab !== 'participated' ? 'flex-1' : 'w-full'
                      }`}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {contests.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
              {activeTab === 'participated'
                ? "You haven't participated in any contests yet."
                : `No ${activeTab} contests found.`
              }
            </div>
            {activeTab === 'participated' && (
              <p className="text-gray-500 mt-2">
                Register for contests to see them here after participation.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Contests;