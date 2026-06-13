import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <main className="page-wrapper">
      <section className="hero section">
        <div className="container">
          <div className="hero-content text-center animate-fade-in">
            <div className="hero-badge">
              <span className="badge badge-primary">✨ Free URL Shortener</span>
            </div>
            <h1 className="hero-title">
              Shorten. Share.
              <br />
              <span className="gradient-text">Analyze Everything.</span>
            </h1>
            <p className="hero-subtitle">
              Create powerful short links with real-time click analytics, custom aliases,
              QR codes, and expiration dates — all in one place.
            </p>
            <div className="hero-actions flex justify-center gap-4">
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Free →
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Sign In
              </Link>
            </div>
          </div>

          {/* Feature Preview */}
          <div className="hero-input-preview card animate-fade-in">
            <div className="preview-bar">
              <span className="preview-dot" />
              <span className="preview-dot" />
              <span className="preview-dot" />
            </div>
            <div className="preview-content flex gap-4">
              <input
                className="input"
                placeholder="https://your-very-long-url-goes-here.com/path/to/page"
                readOnly
              />
              <button className="btn btn-accent" style={{ flexShrink: 0 }}>
                Shorten ⚡
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features section">
        <div className="container">
          <h2 className="text-center" style={{ marginBottom: 'var(--space-3)' }}>
            Everything You Need
          </h2>
          <p className="text-center text-muted" style={{ marginBottom: 'var(--space-12)' }}>
            Built for developers, marketers, and anyone who shares links.
          </p>
          <div className="grid grid-3 gap-6">
            {[
              { icon: '🔗', title: 'Custom Aliases', desc: 'Choose memorable short codes for your links.' },
              { icon: '📊', title: 'Real-Time Analytics', desc: 'Track clicks, devices, locations, and referrers.' },
              { icon: '⏰', title: 'Link Expiration', desc: 'Set expiry dates to control link lifecycles.' },
              { icon: '📱', title: 'QR Code Generation', desc: 'Auto-generate QR codes for every short link.' },
              { icon: '📂', title: 'Bulk Upload', desc: 'Shorten hundreds of links via CSV upload.' },
              { icon: '🌍', title: 'Public Stats', desc: 'Share public dashboards for any link.' },
            ].map((feature) => (
              <div key={feature.title} className="card feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h4 className="feature-title">{feature.title}</h4>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
