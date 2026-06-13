import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-6)', paddingBottom: 'var(--space-6)' }}>
      <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)' }}>
        <div className="footer-brand" style={{ marginBottom: 0 }}>
          <span className="footer-logo">⚡ Smart<span className="gradient-text">Link</span></span>
          <p className="footer-tagline" style={{ fontSize: 'var(--font-size-xs)', margin: 0 }}>© {currentYear} SmartLink.</p>
        </div>

        <nav style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--font-size-sm)' }}>
          <Link to="/dashboard" style={{ color: 'var(--color-text-muted)' }}>Dashboard</Link>
          <Link to="/dashboard" style={{ color: 'var(--color-text-muted)' }}>Analytics</Link>
          <Link to="/profile" style={{ color: 'var(--color-text-muted)' }}>Profile</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
