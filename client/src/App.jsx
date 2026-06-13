import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import PublicStats from './pages/PublicStats';
import NotFound from './pages/NotFound';
import { useAuth } from './hooks/useAuth';
import { ToastProvider } from './components/Toast';

import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const { user, logout } = useAuth();

  return (
    <ToastProvider>
      <Router>
        <ErrorBoundary>
          <Navbar user={user} onLogout={logout} />
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/stats/:shortCode" element={<PublicStats />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/analytics/:shortCode" element={<Analytics />} />
          </Route>
          {/* Catch All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        </ErrorBoundary>
      </Router>
    </ToastProvider>
  );
}

export default App;
