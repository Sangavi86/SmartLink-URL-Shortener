import { Link } from 'react-router-dom';
import './AuthPages.css';

const Login = () => {
  return (
    <main className="page-wrapper">
      <div className="auth-wrapper">
        <div className="auth-card card animate-fade-in">
          <div className="auth-header text-center">
            <h2>Welcome Back</h2>
            <p>Sign in to manage your short links</p>
          </div>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input id="email" type="email" className="input" placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input id="password" type="password" className="input" placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-2)' }}>
              Sign In
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
