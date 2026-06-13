import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">⚡</span>
          <span className="brand-name">
            Smart<span className="gradient-text">Link</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <ul className="navbar-links">
          <li>
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>
                  Profile
                </Link>
              </li>
            </>
          ) : null}
        </ul>

        {/* Auth Actions */}
        <div className="navbar-actions">
          {user ? (
            <>
              <span className="nav-user">👤 {user.username}</span>
              <button onClick={onLogout} className="btn btn-ghost btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
