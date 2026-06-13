import { Link } from 'react-router-dom';

const PublicStats = () => {
  return (
    <main className="page-wrapper">
      <div className="container">
        <div className="card animate-fade-in text-center" style={{ marginTop: 'var(--space-8)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>📊</div>
          <h2>Public Statistics</h2>
          <p className="text-muted" style={{ marginBottom: 'var(--space-8)' }}>
            Viewing aggregate data for short code: <span className="font-bold text-primary">placeholder</span>
          </p>

          <div className="grid grid-3 gap-6">
            <div className="stat-card card">
              <span className="stat-icon">📈</span>
              <div className="stat-value">—</div>
              <div className="stat-label">Total Clicks</div>
            </div>
            <div className="stat-card card">
              <span className="stat-icon">💻</span>
              <div className="stat-value">—</div>
              <div className="stat-label">Top Browser</div>
            </div>
            <div className="stat-card card">
              <span className="stat-icon">📱</span>
              <div className="stat-value">—</div>
              <div className="stat-label">Top Device</div>
            </div>
          </div>

          <div className="divider"></div>
          
          <p className="text-sm text-muted">
            Charts and detailed distribution will be implemented here.
          </p>
          
          <Link to="/" className="btn btn-secondary" style={{ marginTop: 'var(--space-6)' }}>
            Create Your Own Short Link
          </Link>
        </div>
      </div>
    </main>
  );
};

export default PublicStats;
