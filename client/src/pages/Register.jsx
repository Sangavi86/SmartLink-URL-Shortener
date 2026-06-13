import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../services/api';
import './AuthPages.css';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const res = await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      // Save token and user details to local state
      login(res.data.user, res.data.token);
      
      // Redirect to dashboard
      navigate('/dashboard', { replace: true });
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-wrapper">
      <div className="auth-wrapper">
        <div className="auth-card card animate-fade-in">
          <div className="auth-header text-center">
            <h2>Create Account</h2>
            <p>Start shortening links for free</p>
          </div>

          {error && (
            <div className="badge badge-error" style={{ width: '100%', marginBottom: 'var(--space-4)', padding: 'var(--space-3)', justifyContent: 'center' }}>
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input 
                id="username" 
                type="text" 
                className="input" 
                placeholder="your_username" 
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
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
                placeholder="Min. 6 characters" 
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <input 
                id="confirmPassword" 
                type="password" 
                className="input" 
                placeholder="Repeat password" 
                value={formData.confirmPassword}
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer text-center text-sm">
            Already have an account?{' '}
            <Link to="/login">Sign in →</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Register;
