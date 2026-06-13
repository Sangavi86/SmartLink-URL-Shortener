import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../services/api';
import './AuthPages.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // If redirected from ProtectedRoute, this is where they were trying to go
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic Validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const res = await authAPI.login(formData);
      
      // Save token and user details to local state
      login(res.data.user, res.data.token);
      
      // Redirect to dashboard (or wherever they were trying to go)
      navigate(from, { replace: true });
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-wrapper">
      <div className="auth-wrapper">
        <div className="auth-card card animate-fade-in">
          <div className="auth-header text-center">
            <h2>Welcome Back</h2>
            <p>Sign in to manage your short links</p>
          </div>

          {error && (
            <div className="badge badge-error" style={{ width: '100%', marginBottom: 'var(--space-4)', padding: 'var(--space-3)', justifyContent: 'center' }}>
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input 
                id="email" 
                type="email" 
                className="input" 
                placeholder="you@example.com" 
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input 
                id="password" 
                type="password" 
                className="input" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: 'var(--space-2)' }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="auth-footer text-center text-sm">
            Don't have an account?{' '}
            <Link to="/register">Create one free →</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
