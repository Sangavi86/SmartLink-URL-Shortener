import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <main className="page-wrapper">
      <div className="container">
        <div className="dashboard-header animate-fade-in">
          <div>
            <h1>Dashboard</h1>
            <p>Manage and track all your short links.</p>
          </div>
          <Link to="/register" className="btn btn-primary">
            + Create Link
          </Link>
        </div>

        {/* Placeholder Stats Cards */}
        <div className="stats-grid animate-fade-in">
          {[
            { label: 'Total Links', value: '—', icon: '🔗' },
            { label: 'Total Clicks', value: '—', icon: '📈' },
            { label: 'Active Links', value: '—', icon: '✅' },
            { label: 'Expired Links', value: '—', icon: '⏰' },
          ].map((stat) => (
            <div key={stat.label} className="stat-card card">
              <span className="stat-icon">{stat.icon}</span>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Placeholder Link Table */}
        <div className="card animate-fade-in" style={{ marginTop: 'var(--space-8)' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-6)' }}>
            <h3>Your Links</h3>
            <span className="badge badge-primary">Coming Soon</span>
          </div>
          <div className="placeholder-empty text-center">
            <div className="placeholder-icon">🔗</div>
            <h4>No links yet</h4>
            <p>Your shortened links will appear here. Create your first one!</p>
            <Link to="/register" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
              Create Your First Link
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
