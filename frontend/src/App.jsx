import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProblemSet from './pages/ProblemSet';
import ProblemDetail from './pages/ProblemDetail';
import Contests from './pages/Contests';
import ContestRegistration from './pages/ContestRegistration';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/problems"
            element={
              <ProtectedRoute>
                <Navbar />
                <ProblemSet />
              </ProtectedRoute>
            }
          />

          <Route
            path="/problem/:id"
            element={
              <ProtectedRoute>
                <Navbar />
                <ProblemDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/contests"
            element={
              <ProtectedRoute>
                <Navbar />
                <Contests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/contest/:id"
            element={
              <ProtectedRoute>
                <Navbar />
                <ContestRegistration />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Navbar />
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Navbar />
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
