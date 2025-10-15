import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contestDetails } from '../data/data';

function ContestRegistration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);

  const contest = contestDetails[id] || contestDetails[1];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRegister = () => {
    setIsRegistered(true);
    setTimeout(() => {
      navigate('/contests');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/contests')}
          className="flex items-center text-slate-400 hover:text-white transition mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Contests
        </button>

        {isRegistered && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-6 py-4 rounded-lg mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Successfully registered! Redirecting...</span>
          </div>
        )}

        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8">
            <h1 className="text-4xl font-bold text-white mb-3">{contest.title}</h1>
            <p className="text-blue-100">{contest.description}</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-slate-400 text-sm font-medium">Start Time</span>
                </div>
                <p className="text-white text-sm">{formatDate(contest.startTime)}</p>
              </div>

              <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-slate-400 text-sm font-medium">Duration</span>
                </div>
                <p className="text-white text-sm">{contest.duration}</p>
              </div>

              <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-slate-400 text-sm font-medium">Prize Pool</span>
                </div>
                <p className="text-white text-sm">{contest.prize}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Contest Problems</h2>
                <div className="space-y-3">
                  {contest.problems.map((problem, index) => (
                    <div
                      key={problem.id}
                      className="bg-slate-900 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-medium">
                            Problem {index + 1}: {problem.title}
                          </h3>
                          <p className="text-sm text-slate-400 mt-1">Points: {problem.points}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            problem.difficulty === 'Easy'
                              ? 'bg-green-500/20 text-green-400'
                              : problem.difficulty === 'Medium'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Contest Rules</h2>
                <ul className="space-y-3">
                  {contest.rules.map((rule, index) => (
                    <li key={index} className="flex items-start text-slate-300">
                      <svg
                        className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm">{rule}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-xl font-bold text-white mt-6 mb-4">Requirements</h3>
                <ul className="space-y-3">
                  {contest.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start text-slate-300">
                      <svg
                        className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 mb-6">
              <div className="flex items-start">
                <svg
                  className="w-6 h-6 text-blue-400 mr-3 mt-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="text-white font-semibold mb-2">Registration Information</h3>
                  <p className="text-slate-300 text-sm mb-2">
                    <span className="font-medium text-white">{contest.registeredCount.toLocaleString()}</span> out
                    of <span className="font-medium text-white">{contest.totalParticipants.toLocaleString()}</span>{' '}
                    participants registered
                  </p>
                  <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(contest.registeredCount / contest.totalParticipants) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleRegister}
              disabled={isRegistered}
              className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition ${
                isRegistered
                  ? 'bg-green-600 text-white cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-[1.02]'
              }`}
            >
              {isRegistered ? 'Registered Successfully!' : 'Register for Contest'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContestRegistration;
