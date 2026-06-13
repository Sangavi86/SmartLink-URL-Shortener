import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { urlAPI } from '../services/api';
import { useToast } from '../components/Toast';
import { EmptyState, ErrorState } from '../components/UIStates';
import './Dashboard.css';

// ── Skeleton loader for URL table rows ──────────────────────────────────────
const SkeletonRows = () => (
  <>
    {[1, 2, 3].map(i => (
      <tr key={i}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map(j => (
          <td key={j} style={{ padding: 'var(--space-3)' }}>
            <div className="skeleton skeleton-text" style={{ width: j === 2 ? '80%' : '60%' }} />
          </td>
        ))}
      </tr>
    ))}
  </>
);

const Dashboard = () => {
  const { show: toast } = useToast();

  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qrCodeData, setQrCodeData] = useState(null);

  // Bulk Upload State
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);
  const [bulkError, setBulkError] = useState('');

  // Create Form State
  const [formData, setFormData] = useState({
    originalUrl: '',
    customAlias: '',
    expiryDate: ''
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  const fetchUrls = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await urlAPI.getAll();
      setUrls(res.data.data);
    } catch (err) {
      setError('Failed to fetch your URLs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setCreateLoading(true);
      setCreateError('');
      await urlAPI.create(formData);
      setFormData({ originalUrl: '', customAlias: '', expiryDate: '' });
      toast('Short link created successfully!', 'success');
      fetchUrls();
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to create URL.';
      setCreateError(msg);
      toast(msg, 'error');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    try {
      await urlAPI.remove(id);
      toast('Link deleted.', 'info');
      fetchUrls();
    } catch (err) {
      toast('Failed to delete link.', 'error');
    }
  };

  const copyToClipboard = (shortCode) => {
    const fullUrl = `${window.location.protocol}//${window.location.hostname}:5001/${shortCode}`;
    navigator.clipboard.writeText(fullUrl)
      .then(() => toast('Copied to clipboard!', 'success'))
      .catch(() => toast('Failed to copy.', 'error'));
  };

  const viewQrCode = (url) => {
    if (url.qrCode) {
      setQrCodeData({ shortCode: url.shortCode, dataUrl: url.qrCode });
    } else {
      toast('QR Code not available for this URL.', 'info');
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) return;
    try {
      setBulkLoading(true);
      setBulkError('');
      const res = await urlAPI.bulkUpload(bulkFile);
      setBulkResult(res.data.data);
      fetchUrls();
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to upload CSV file.';
      setBulkError(msg);
    } finally {
      setBulkLoading(false);
    }
  };

  const closeBulkModal = () => {
    setShowBulkModal(false);
    setBulkResult(null);
    setBulkError('');
    setBulkFile(null);
  };

  return (
    <main className="page-wrapper page-enter">
      <div className="container">

        {/* Header */}
        <div className="dashboard-header animate-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Dashboard</h1>
            <p>Manage and track all your short links.</p>
          </div>
          <button onClick={() => setShowBulkModal(true)} className="btn btn-secondary">
            📁 Bulk Upload CSV
          </button>
        </div>

        {/* Create Link Form */}
        <div className="card animate-fade-in" style={{ marginBottom: 'var(--space-8)', animationDelay: '0.05s' }}>
          <h3>Create New Short Link</h3>
          {createError && (
            <div className="badge badge-error" style={{ marginTop: 'var(--space-3)', marginBottom: 'var(--space-2)', display: 'block', padding: 'var(--space-2) var(--space-4)' }}>
              {createError}
            </div>
          )}
          <form onSubmit={handleCreate} style={{ display: 'grid', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
            <div>
              <label className="form-label" htmlFor="originalUrl">Original URL *</label>
              <input
                type="url"
                id="originalUrl"
                name="originalUrl"
                className="input"
                placeholder="https://example.com/very/long/path"
                value={formData.originalUrl}
                onChange={handleFormChange}
                required
              />
              <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', marginTop: '2px' }}>Paste any valid URL to shorten.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div>
                <label className="form-label" htmlFor="customAlias">Custom Alias (Optional)</label>
                <input
                  type="text"
                  id="customAlias"
                  name="customAlias"
                  className="input"
                  placeholder="e.g. my-campaign"
                  value={formData.customAlias}
                  onChange={handleFormChange}
                />
                <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', marginTop: '2px' }}>Optional. Leave blank for auto-generation.</p>
              </div>
              <div>
                <label className="form-label" htmlFor="expiryDate">Expiry Date (Optional)</label>
                <input
                  type="datetime-local"
                  id="expiryDate"
                  name="expiryDate"
                  className="input"
                  value={formData.expiryDate}
                  onChange={handleFormChange}
                />
                <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', marginTop: '2px' }}>Optional. Link never expires if empty.</p>
              </div>
            </div>
            <div>
              <button type="submit" className="btn btn-primary" disabled={createLoading}>
                {createLoading ? (
                  <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Shortening...</>
                ) : '⚡ Shorten URL'}
              </button>
            </div>
          </form>
        </div>

        {/* Links List */}
        <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h3 style={{ marginBottom: 'var(--space-6)' }}>Your Links</h3>

          {loading ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    {['Short URL', 'Original URL', 'Clicks', 'Created', 'Expires', 'Status', 'QR', 'Actions'].map(h => (
                      <th key={h} style={{ padding: 'var(--space-3)', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody><SkeletonRows /></tbody>
              </table>
            </div>
          ) : error ? (
            <ErrorState error={error} onRetry={fetchUrls} />
          ) : urls.length === 0 ? (
            <EmptyState 
              title="No links yet" 
              message="Create your first short URL to get started." 
              icon="🔗" 
            />
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    {['Short URL', 'Original URL', 'Clicks', 'Created', 'Expires', 'Status', 'QR', 'Actions'].map(h => (
                      <th key={h} style={{ padding: 'var(--space-3)', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {urls.map(url => (
                    <tr key={url._id} className="url-table-row">
                      <td style={{ padding: 'var(--space-3)' }}>
                        <a
                          href={`https://smartlink-url-shortener.onrender.com/${url.shortCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold"
                          style={{ color: 'var(--color-primary-light)', textDecoration: 'none' }}
                        >
                          {`https://smartlink-url-shortener.onrender.com/${url.shortCode}`}
                        </a>
                        {url.customAlias && <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>alias: {url.customAlias}</div>}
                      </td>
                      <td style={{ padding: 'var(--space-3)', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }} title={url.originalUrl}>
                        {url.originalUrl}
                      </td>
                      <td style={{ padding: 'var(--space-3)', fontWeight: 700, color: 'var(--color-accent)' }}>{url.clickCount}</td>
                      <td style={{ padding: 'var(--space-3)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>{new Date(url.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: 'var(--space-3)', fontSize: 'var(--font-size-sm)' }}>
                        {url.expiryDate
                          ? <span style={{ color: new Date(url.expiryDate) < new Date() ? 'var(--color-error)' : 'var(--color-text-muted)' }}>
                              {new Date(url.expiryDate).toLocaleDateString()}
                            </span>
                          : <span style={{ color: 'var(--color-text-subtle)' }}>Never</span>
                        }
                      </td>
                      <td style={{ padding: 'var(--space-3)' }}>
                        {url.expiryDate && new Date(url.expiryDate) < new Date()
                          ? <span className="badge badge-error" style={{ padding: '2px 8px', fontSize: 'var(--font-size-xs)' }}>Expired</span>
                          : <span className="badge" style={{ padding: '2px 8px', fontSize: 'var(--font-size-xs)', background: 'var(--color-success, #22c55e)', color: '#fff', borderRadius: 'var(--radius-sm)' }}>Active</span>
                        }
                      </td>
                      <td style={{ padding: 'var(--space-3)', textAlign: 'center' }}>
                        {url.qrCode ? '✅' : '➖'}
                      </td>
                      <td style={{ padding: 'var(--space-3)' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                          <Link to={`/analytics/${url.shortCode}`} className="btn btn-ghost btn-sm pill-btn" title="Analytics" aria-label="View analytics">📊 Analytics</Link>
                          <button onClick={() => viewQrCode(url)} className="btn btn-ghost btn-sm pill-btn" title="View QR Code" aria-label="View QR code">📱 View QR</button>
                          <button onClick={() => copyToClipboard(url.shortCode)} className="btn btn-ghost btn-sm pill-btn" title="Copy short URL" aria-label="Copy short URL">📋 Copy</button>
                          <a href={`http://localhost:5001/${url.shortCode}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm pill-btn" title="Open Link" aria-label="Open short URL">🔗 Open</a>
                          <button onClick={() => handleDelete(url._id)} className="btn btn-ghost btn-sm pill-btn" title="Delete" aria-label="Delete link" style={{ color: 'var(--color-error)' }}>🗑 Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* QR Code Modal */}
      {qrCodeData && (
        <div className="modal-overlay" onClick={() => setQrCodeData(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setQrCodeData(null)} aria-label="Close">×</button>
            <h3 style={{ marginBottom: 'var(--space-2)', textAlign: 'center' }}>QR Code</h3>
            <p className="text-muted text-sm text-center" style={{ marginBottom: 'var(--space-5)' }}>
              Scan to open your short link
            </p>
            <img
              src={qrCodeData.dataUrl}
              alt="QR Code"
              style={{ width: 200, height: 200, display: 'block', margin: '0 auto var(--space-6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
            />
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
              <a
                href={qrCodeData.dataUrl}
                download={`qrcode-${qrCodeData.shortCode}.png`}
                className="btn btn-primary"
              >
                ⬇️ Download PNG
              </a>
              <button onClick={() => setQrCodeData(null)} className="btn btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="modal-overlay" onClick={closeBulkModal}>
          <div className="modal-card" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeBulkModal} aria-label="Close">×</button>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>Bulk Upload URLs</h3>
            <p className="text-muted text-sm" style={{ marginBottom: 'var(--space-5)' }}>
              Upload a CSV with column header <strong style={{ color: 'var(--color-primary-light)' }}>originalUrl</strong> or <strong style={{ color: 'var(--color-primary-light)' }}>url</strong>. Optional: <strong>title</strong>.
            </p>

            {!bulkResult ? (
              <>
                {bulkError && (
                  <div className="badge badge-error" style={{ marginBottom: 'var(--space-4)', display: 'block', padding: 'var(--space-2) var(--space-4)' }}>{bulkError}</div>
                )}
                <div className="drop-zone" style={{ marginBottom: 'var(--space-5)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>📂</div>
                  <p className="text-muted text-sm" style={{ marginBottom: 'var(--space-3)' }}>Select a CSV file to upload</p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setBulkFile(e.target.files[0])}
                    style={{ display: 'block', margin: '0 auto', color: 'var(--color-text-muted)' }}
                  />
                  {bulkFile && (
                    <p className="text-sm" style={{ marginTop: 'var(--space-3)', color: 'var(--color-accent)' }}>
                      ✓ {bulkFile.name}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                  <button onClick={closeBulkModal} className="btn btn-ghost" disabled={bulkLoading}>Cancel</button>
                  <button onClick={handleBulkUpload} className="btn btn-primary" disabled={!bulkFile || bulkLoading}>
                    {bulkLoading
                      ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Processing...</>
                      : '🚀 Upload & Process'}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: 'var(--space-4)' }}>
                  {bulkResult.successfulRows > 0 ? '🎉' : '⚠️'}
                </div>
                <h4 style={{ marginBottom: 'var(--space-5)' }}>Upload Complete</h4>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                  <div>
                    <div className="stat-label">Total</div>
                    <div className="stat-value" style={{ fontSize: 'var(--font-size-2xl)' }}>{bulkResult.totalRows}</div>
                  </div>
                  <div>
                    <div className="stat-label">Created</div>
                    <div className="stat-value" style={{ fontSize: 'var(--font-size-2xl)' }}>{bulkResult.successfulRows}</div>
                  </div>
                  <div>
                    <div className="stat-label">Skipped</div>
                    <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-error)' }}>{bulkResult.failedRows}</div>
                  </div>
                </div>
                <button onClick={closeBulkModal} className="btn btn-primary">Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
