import { Link } from 'react-router-dom';

const Profile = () => {
  return (
    <main className="page-wrapper">
      <div className="container" style={{ maxWidth: '600px', marginTop: 'var(--space-8)' }}>
        <div className="card animate-fade-in">
          <div className="text-center" style={{ marginBottom: 'var(--space-6)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-2)' }}>👤</div>
            <h2>Your Profile</h2>
            <p className="text-muted">Manage your account details</p>
          </div>

          <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
            <label className="form-label">Username</label>
            <input type="text" className="input" value="user_placeholder" readOnly disabled />
          </div>
          
          <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
            <label className="form-label">Email</label>
            <input type="email" className="input" value="user@example.com" readOnly disabled />
          </div>

          <div className="divider"></div>

          <div className="text-center" style={{ marginTop: 'var(--space-6)' }}>
            <Link to="/dashboard" className="btn btn-secondary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
