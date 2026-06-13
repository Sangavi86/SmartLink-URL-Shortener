import { Link } from 'react-router-dom';
import './AuthPages.css';

const Register = () => {
  return (
    <main className="page-wrapper">
      <div className="auth-wrapper">
        <div className="auth-card card animate-fade-in">
          <div className="auth-header text-center">
            <h2>Create Account</h2>
            <p>Start shortening links for free</p>
          </div>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input id="username" type="text" className="input" placeholder="your_username" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input id="email" type="email" className="input" placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input id="password" type="password" className="input" placeholder="Min. 6 characters" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-2)' }}>
              Create Account
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
