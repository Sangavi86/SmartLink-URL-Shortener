import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">⚡ Smart<span className="gradient-text">Link</span></span>
          <p className="footer-tagline">Shorten. Share. Analyze.</p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h6 className="footer-heading">Product</h6>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/register">Get Started</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h6 className="footer-heading">Account</h6>
            <ul>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Sign Up</Link></li>
              <li><Link to="/profile">Profile</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© {currentYear} SmartLink. Built for hackathons. ⚡</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
