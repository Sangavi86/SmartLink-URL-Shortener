import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { urlAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUrls: 0,
    totalClicks: 0,
    activeUrls: 0,
    expiredUrls: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await urlAPI.getAll();
        const urls = res.data.data;
        
        let totalUrls = urls.length;
        let totalClicks = urls.reduce((sum, url) => sum + url.clickCount, 0);
        let activeUrls = 0;
        let expiredUrls = 0;
        
        const now = new Date();
        urls.forEach(url => {
          if (url.expiryDate && new Date(url.expiryDate) <= now) {
            expiredUrls++;
          } else {
            activeUrls++;
          }
        });

        setStats({ totalUrls, totalClicks, activeUrls, expiredUrls });
      } catch (err) {
        setError('Failed to load profile statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (!user) return null;

  return (
    <main className="page-wrapper page-enter">
      <div className="container" style={{ maxWidth: '800px', marginTop: 'var(--space-8)' }}>
        <div className="dashboard-header animate-fade-in text-center">
          <div style={{ fontSize: '3.5rem', marginBottom: 'var(--space-2)', display: 'inline-block', animation: 'bounce 2s ease infinite' }}>👤</div>
          <h1>Your Profile</h1>
          <p className="text-muted">Manage your account and view your impact</p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
          {/* Account Details */}
          <div className="card animate-fade-in" style={{ animationDelay: '0.05s' }}>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Account Details</h3>
            <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
              <label className="form-label" htmlFor="profileUsername">Username</label>
              <input type="text" id="profileUsername" className="input" value={user.username} readOnly disabled aria-label="Username" />
            </div>
            
            <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
              <label className="form-label" htmlFor="profileEmail">Email</label>
              <input type="email" id="profileEmail" className="input" value={user.email} readOnly disabled aria-label="Email" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profileDate">Member Since</label>
              <input type="text" id="profileDate" className="input" value={new Date(user.createdAt).toLocaleDateString()} readOnly disabled aria-label="Member Since" />
            </div>
          </div>

          {/* Statistics */}
          <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Link Statistics</h3>
            
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                {[1,2,3,4].map(i => (
                  <div key={i} className="card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
                    <div className="skeleton" style={{ width: 32, height: 32, borderRadius: '50%', margin: '0 auto var(--space-3)' }} />
                    <div className="skeleton skeleton-text" style={{ width: '50%', margin: '0 auto var(--space-2)' }} />
                    <div className="skeleton skeleton-text" style={{ width: '40%', margin: '0 auto', height: '0.75rem' }} />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="badge badge-error">{error}</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="stat-card card">
                  <span className="stat-icon">🔗</span>
                  <div className="stat-value" style={{ fontSize: 'var(--font-size-2xl)' }}>{stats.totalUrls}</div>
                  <div className="stat-label">Total Links</div>
                </div>
                <div className="stat-card card">
                  <span className="stat-icon">📈</span>
                  <div className="stat-value" style={{ fontSize: 'var(--font-size-2xl)' }}>{stats.totalClicks}</div>
                  <div className="stat-label">Total Clicks</div>
                </div>
                <div className="stat-card card">
                  <span className="stat-icon">✅</span>
                  <div className="stat-value" style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-success)' }}>{stats.activeUrls}</div>
                  <div className="stat-label">Active Links</div>
                </div>
                <div className="stat-card card">
                  <span className="stat-icon">⏰</span>
                  <div className="stat-value" style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-error)' }}>{stats.expiredUrls}</div>
                  <div className="stat-label">Expired Links</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center" style={{ marginTop: 'var(--space-8)' }}>
          <Link to="/dashboard" className="btn btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Profile;
