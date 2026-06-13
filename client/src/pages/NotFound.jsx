import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <main className="page-wrapper flex items-center justify-center">
      <div className="container text-center animate-fade-in">
        <h1 style={{ fontSize: 'var(--font-size-5xl)', color: 'var(--color-primary)' }}>404</h1>
        <h2 style={{ marginBottom: 'var(--space-4)' }}>Page Not Found</h2>
        <p className="text-muted" style={{ marginBottom: 'var(--space-8)', maxWidth: '400px', margin: '0 auto var(--space-8)' }}>
          The link you clicked may be broken or the page may have been removed.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          Go Back Home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
