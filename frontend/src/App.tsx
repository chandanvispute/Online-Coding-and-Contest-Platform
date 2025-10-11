import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProblemList from './components/Problems/ProblemList';
import ProblemDetail from './components/Problems/ProblemDetail';
import ContestList from './components/Contests/ContestList';
import AdminDashboard from './components/Admin/AdminDashboard';
import ProblemManagement from './components/Admin/ProblemManagement';
import UserManagement from './components/Admin/UserManagement';
import ProblemForm from './components/Admin/ProblemForm';
import Home from './components/Home';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/problems" element={<ProblemList />} />
                <Route path="/problems/:id" element={<ProblemDetail />} />
                <Route path="/contests" element={<ContestList />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/problems" element={<ProblemManagement />} />
                <Route path="/admin/problems/new" element={<ProblemForm />} />
                <Route path="/admin/problems/edit/:id" element={<ProblemForm />} />
                <Route path="/admin/users" element={<UserManagement />} />
              </Routes>
            </Container>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
