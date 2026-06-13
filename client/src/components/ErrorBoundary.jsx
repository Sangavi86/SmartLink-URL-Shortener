import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <main className="page-wrapper page-enter" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
          <div className="card text-center" style={{ padding: 'var(--space-8)', maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>⚠️</div>
            <h1 style={{ marginBottom: 'var(--space-3)' }}>Something went wrong</h1>
            <p className="text-muted" style={{ marginBottom: 'var(--space-6)' }}>
              The application encountered an unexpected error.
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={this.handleReload} 
                className="btn btn-primary"
                aria-label="Reload Page"
              >
                Reload Page
              </button>
              <a href="/" className="btn btn-secondary" aria-label="Go Home">
                Go Home
              </a>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div style={{ marginTop: 'var(--space-6)', textAlign: 'left', backgroundColor: 'var(--color-bg)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
                <pre style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-error)' }}>
                  {this.state.error.toString()}
                </pre>
              </div>
            )}
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
