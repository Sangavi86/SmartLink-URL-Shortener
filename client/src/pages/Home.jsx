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
    <main className="page-wrapper page-enter" style={{ paddingBottom: 'var(--space-8)' }}>
      {/* 1. Hero Section */}
      <section className="hero section" style={{ paddingBottom: 'var(--space-4)', paddingTop: 'var(--space-12)' }}>
        <div className="container">
          <div className="hero-content text-center animate-fade-in">
            <h1 className="hero-title" style={{ marginBottom: 'var(--space-4)' }}>
              Smart URL Shortener & Tracker
            </h1>
            <p className="hero-subtitle" style={{ maxWidth: '700px', margin: '0 auto var(--space-6)' }}>
              Create short URLs, monitor clicks, generate QR codes, and manage links from one powerful dashboard.
            </p>
            
            <div className="hero-actions flex justify-center gap-4" style={{ marginBottom: 'var(--space-8)' }}>
              <Link to="/dashboard" className="btn btn-primary btn-lg">⚡ Create Short Link</Link>
              <Link to="/dashboard" className="btn btn-secondary btn-lg">📊 View Analytics</Link>
            </div>

            {/* 2. URL Shortener Card */}
            <div className="card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left', padding: 'var(--space-6)' }}>
              <form onSubmit={handleShorten} style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px' }}>
                  <label className="form-label sr-only" htmlFor="demo-url">Original URL</label>
                  <input
                    type="url"
                    id="demo-url"
                    className="input"
                    placeholder="🔗 Original URL (e.g. https://example.com)"
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
                    placeholder="#️⃣ Custom Alias"
                    value={formData.customAlias}
                    onChange={e => setFormData({...formData, customAlias: e.target.value})}
                  />
                </div>
                <button type="submit" className="btn btn-accent" disabled={loading} style={{ flexShrink: 0 }}>
                  {loading ? 'Shortening...' : '⚡ Shorten Link'}
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

      {/* 3. Powerful Features Section */}
      <section className="section" style={{ paddingTop: 'var(--space-4)' }}>
        <div className="container">
          <div className="grid grid-4 gap-6">
            
            <div className="card text-center feature-card" style={{ padding: 'var(--space-6)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>🔗</div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-2)' }}>Smart Links</h3>
              <p className="text-muted text-sm">Create clean branded short links.</p>
            </div>

            <div className="card text-center feature-card" style={{ padding: 'var(--space-6)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>📊</div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-2)' }}>Analytics</h3>
              <p className="text-muted text-sm">Track clicks, browsers, devices, and locations.</p>
            </div>

            <div className="card text-center feature-card" style={{ padding: 'var(--space-6)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>📱</div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-2)' }}>QR Codes</h3>
              <p className="text-muted text-sm">Generate downloadable QR codes instantly.</p>
            </div>

            <div className="card text-center feature-card" style={{ padding: 'var(--space-6)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>📂</div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-2)' }}>Bulk Upload</h3>
              <p className="text-muted text-sm">Create hundreds of short links via CSV.</p>
            </div>

          </div>
        </div>
      </section>
      
    </main>
  );
};

export default Home;
