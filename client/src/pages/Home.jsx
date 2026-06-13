import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { urlAPI } from '../services/api';
import { useToast } from '../components/Toast';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { show: toast } = useToast();

  const [formData, setFormData] = useState({ originalUrl: '', customAlias: '' });
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState(null);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/register');
      return;
    }
    
    try {
      setLoading(true);
      const res = await urlAPI.create(formData);
      setShortUrl(`http://localhost:5001/${res.data.data.shortCode}`);
      setFormData({ originalUrl: '', customAlias: '' });
      toast('Short link created successfully!', 'success');
    } catch (err) {
      toast(err.response?.data?.error || 'Failed to create URL.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    toast('Copied to clipboard!', 'success');
  };

  return (
    <main className="page-wrapper page-enter">
      {/* 1. Hero Section Redesign */}
      <section className="hero section">
        <div className="container">
          <div className="hero-content text-center animate-fade-in">
            <h1 className="hero-title">
              Shorten, Track and Share <br/><span className="gradient-text">Links Instantly</span>
            </h1>
            <p className="hero-subtitle">
              Create short URLs, monitor clicks, generate QR codes, and manage links from one dashboard.
            </p>
            
            {!user ? (
              <div className="hero-actions flex justify-center gap-4" style={{ marginBottom: 'var(--space-8)' }}>
                <Link to="/dashboard" className="btn btn-primary btn-lg">Go to Dashboard</Link>
                <Link to="/dashboard" className="btn btn-secondary btn-lg">View Analytics</Link>
              </div>
            ) : null}

            {/* 5. Quick Access Area for Authenticated Users */}
            {user && (
              <div className="grid grid-4 gap-4" style={{ maxWidth: '800px', margin: '0 auto var(--space-8)' }}>
                <Link to="/dashboard" className="card text-center" style={{ padding: 'var(--space-4)', textDecoration: 'none' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>➕</div>
                  <strong style={{ color: 'var(--color-text)' }}>Create Link</strong>
                </Link>
                <Link to="/dashboard" className="card text-center" style={{ padding: 'var(--space-4)', textDecoration: 'none' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>🎛️</div>
                  <strong style={{ color: 'var(--color-text)' }}>Dashboard</strong>
                </Link>
                <Link to="/dashboard" className="card text-center" style={{ padding: 'var(--space-4)', textDecoration: 'none' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>📊</div>
                  <strong style={{ color: 'var(--color-text)' }}>Analytics</strong>
                </Link>
                <Link to="/profile" className="card text-center" style={{ padding: 'var(--space-4)', textDecoration: 'none' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>👤</div>
                  <strong style={{ color: 'var(--color-text)' }}>Profile</strong>
                </Link>
              </div>
            )}

            {/* 2. Instant URL Shortener Demo */}
            <div className="card animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left', animationDelay: '0.1s', padding: 'var(--space-6)' }}>
              <h3 style={{ marginBottom: 'var(--space-4)' }}>{user ? 'Shorten a Link' : 'Try it Out'}</h3>
              <form onSubmit={handleShorten} style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px' }}>
                  <label className="form-label sr-only" htmlFor="demo-url">Original URL</label>
                  <input
                    type="url"
                    id="demo-url"
                    className="input"
                    placeholder="https://example.com/very/long/path"
                    value={formData.originalUrl}
                    onChange={e => setFormData({...formData, originalUrl: e.target.value})}
                    required
                  />
                </div>
                <div style={{ flex: '0 1 200px' }}>
                  <label className="form-label sr-only" htmlFor="demo-alias">Custom Alias</label>
                  <input
                    type="text"
                    id="demo-alias"
                    className="input"
                    placeholder="Alias (optional)"
                    value={formData.customAlias}
                    onChange={e => setFormData({...formData, customAlias: e.target.value})}
                  />
                </div>
                <button type="submit" className="btn btn-accent" disabled={loading} style={{ flexShrink: 0 }}>
                  {loading ? 'Shortening...' : 'Shorten ⚡'}
                </button>
              </form>
              
              {!user && (
                <p className="text-muted text-sm" style={{ marginTop: 'var(--space-3)' }}>
                  Sign up for free to create custom aliases and track analytics.
                </p>
              )}

              {shortUrl && (
                <div className="badge badge-primary" style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                  <a href={shortUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', fontWeight: 'bold' }}>{shortUrl}</a>
                  <button onClick={copyToClipboard} className="btn btn-ghost btn-sm" style={{ color: '#fff' }}>Copy</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Empty State / New to SmartLink? */}
      {!user && (
        <section className="section bg-light" style={{ backgroundColor: 'var(--color-bg-card)', padding: 'var(--space-8) 0' }}>
          <div className="container text-center">
            <h2 style={{ marginBottom: 'var(--space-4)' }}>New to SmartLink?</h2>
            <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto var(--space-6)' }}>
              Get started in seconds. SmartLink provides everything you need to manage your links professionally.
            </p>
            <div className="flex justify-center gap-6" style={{ flexWrap: 'wrap', maxWidth: '800px', margin: '0 auto' }}>
               <div className="text-center" style={{ flex: 1, minWidth: '200px' }}>
                 <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>1️⃣</div>
                 <strong>Create a short URL</strong>
               </div>
               <div className="text-center" style={{ flex: 1, minWidth: '200px' }}>
                 <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>2️⃣</div>
                 <strong>Share it anywhere</strong>
               </div>
               <div className="text-center" style={{ flex: 1, minWidth: '200px' }}>
                 <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>3️⃣</div>
                 <strong>Watch analytics grow</strong>
               </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. User Journey Section */}
      <section className="section">
        <div className="container">
          <h2 className="text-center" style={{ marginBottom: 'var(--space-8)' }}>How It Works</h2>
          <div className="grid grid-3 gap-6">
            <div className="card text-center" style={{ padding: 'var(--space-6)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>✨</div>
              <h3>Step 1: Create Short Link</h3>
              <p className="text-muted">Paste your long URL and optionally choose a memorable custom alias.</p>
            </div>
            <div className="card text-center" style={{ padding: 'var(--space-6)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🌍</div>
              <h3>Step 2: Share Anywhere</h3>
              <p className="text-muted">Distribute your short link or the automatically generated QR code.</p>
            </div>
            <div className="card text-center" style={{ padding: 'var(--space-6)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>📈</div>
              <h3>Step 3: Track Analytics</h3>
              <p className="text-muted">Monitor clicks, devices, browsers, and geographic locations in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Feature Cards Improvement (Grouped) */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-card)' }}>
        <div className="container">
          <h2 className="text-center" style={{ marginBottom: 'var(--space-8)' }}>Everything You Need</h2>
          
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-8)' }}>
            
            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <h3 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>🔗</span> Link Management
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--space-3)' }}>
                <li><strong>Short URLs:</strong> Clean, reliable redirects.</li>
                <li><strong>Custom Aliases:</strong> Brand your links your way.</li>
                <li><strong>Expiry Dates:</strong> Automatically expire temporary links.</li>
              </ul>
            </div>

            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <h3 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>📊</span> Analytics
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--space-3)' }}>
                <li><strong>Click Tracking:</strong> Real-time click counters.</li>
                <li><strong>Browser Insights:</strong> Know what devices your audience uses.</li>
                <li><strong>Public Stats:</strong> Share your link performance openly.</li>
              </ul>
            </div>

            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <h3 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>🚀</span> Productivity
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--space-3)' }}>
                <li><strong>QR Codes:</strong> Auto-generated for offline sharing.</li>
                <li><strong>Bulk Upload:</strong> Process hundreds of links via CSV.</li>
              </ul>
            </div>

          </div>
        </div>
      </section>
      
    </main>
  );
};

export default Home;
