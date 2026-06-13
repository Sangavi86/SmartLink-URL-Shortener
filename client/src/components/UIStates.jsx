import React from 'react';

/**
 * A standardized generic Loading state
 */
export const LoadingState = ({ message = 'Loading...', spinnerSize = 24 }) => (
  <div className="empty-state">
    <span className="spinner" style={{ width: spinnerSize, height: spinnerSize, borderWidth: 3, marginBottom: 'var(--space-4)' }} />
    <p className="text-muted">{message}</p>
  </div>
);

/**
 * A standardized Empty state
 */
export const EmptyState = ({ title, message, icon, action }) => (
  <div className="empty-state animate-fade-in">
    {icon && <div className="empty-state-icon">{icon}</div>}
    <h4>{title}</h4>
    <p className="text-muted" style={{ marginBottom: action ? 'var(--space-4)' : 0 }}>
      {message}
    </p>
    {action && <div>{action}</div>}
  </div>
);

/**
 * A standardized Error state
 */
export const ErrorState = ({ title = 'Something went wrong', error, onRetry }) => (
  <div className="empty-state animate-fade-in">
    <div className="empty-state-icon" style={{ filter: 'grayscale(0)' }}>⚠️</div>
    <h4>{title}</h4>
    {error && <p className="text-muted" style={{ marginBottom: onRetry ? 'var(--space-4)' : 0 }}>{error}</p>}
    {onRetry && (
      <button 
        onClick={onRetry} 
        className="btn btn-secondary btn-sm"
        aria-label="Retry"
      >
        Retry
      </button>
    )}
  </div>
);
