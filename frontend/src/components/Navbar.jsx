import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/problems" className="flex items-center">
              <span className="text-2xl font-bold text-white">CodeArena</span>
            </Link>

            <div className="hidden md:flex space-x-1">
              <Link
                to="/problems"
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  isActive('/problems')
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                Problems
              </Link>
              <Link
                to="/contests"
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  isActive('/contests') || location.pathname.startsWith('/contest')
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                Contests
              </Link>
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  isActive('/dashboard')
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                Dashboard
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    isActive('/admin')
                      ? 'bg-purple-700 text-white'
                      : 'text-purple-400 hover:text-white hover:bg-purple-700'
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-slate-400 hover:text-white transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            <div className="relative group">
              <button className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-sm font-medium">{user?.username || 'Profile'}</span>
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  to="/dashboard"
                  className="block px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition"
                >
                  My Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-4 py-3 text-purple-300 hover:bg-purple-700 hover:text-white transition"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="block px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition"
                >
                  Settings
                </Link>
                <hr className="border-slate-700" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-400 hover:bg-slate-700 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
