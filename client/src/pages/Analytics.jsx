import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { analyticsAPI } from '../services/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { LoadingState, ErrorState } from '../components/UIStates';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Analytics = () => {
  const { shortCode } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await analyticsAPI.getPrivate(shortCode);
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [shortCode]);

  if (loading) {
    return (
      <main className="page-wrapper page-enter">
        <div className="container">
          <LoadingState message="Loading analytics..." />
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="page-wrapper page-enter">
        <div className="container">
          <ErrorState 
            title="Analytics Unavailable" 
            error={error || 'No analytics found for this link.'} 
          />
          <div className="text-center" style={{ marginTop: 'var(--space-4)' }}>
            <Link to="/dashboard" className="btn btn-secondary">← Back to Dashboard</Link>
          </div>
        </div>
      </main>
    );
  }

  // Derived Stats
  const topBrowser = data.browsers.length ? data.browsers[0].name : 'N/A';
  const topDevice = data.devices.length ? data.devices[0].name : 'N/A';
  const lastVisited = data.clicksOverTime.length 
    ? data.clicksOverTime[data.clicksOverTime.length - 1].date 
    : 'Never';

  return (
    <main className="page-wrapper page-enter">
      <div className="container">
        
        {/* Header */}
        <div className="dashboard-header animate-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>Analytics: <span className="text-primary">{data.shortCode}</span></h1>
            <p className="text-muted" style={{ wordBreak: 'break-all' }}>Target: {data.originalUrl}</p>
          </div>
          <Link to="/dashboard" className="btn btn-secondary btn-sm">
            ← Back
          </Link>
        </div>

        {/* Top KPI Cards */}
        <div className="stats-grid animate-fade-in" style={{ marginBottom: 'var(--space-8)', animationDelay: '0.05s' }}>
          <div className="stat-card card">
            <span className="stat-icon">📈</span>
            <div className="stat-value">{data.totalClicks}</div>
            <div className="stat-label">Total Clicks</div>
          </div>
          <div className="stat-card card">
            <span className="stat-icon">⏱️</span>
            <div className="stat-value" style={{ fontSize: 'var(--font-size-lg)' }}>{lastVisited}</div>
            <div className="stat-label">Last Visited</div>
          </div>
          <div className="stat-card card">
            <span className="stat-icon">💻</span>
            <div className="stat-value" style={{ fontSize: 'var(--font-size-xl)' }}>{topBrowser}</div>
            <div className="stat-label">Top Browser</div>
          </div>
          <div className="stat-card card">
            <span className="stat-icon">📱</span>
            <div className="stat-value" style={{ fontSize: 'var(--font-size-xl)' }}>{topDevice}</div>
            <div className="stat-label">Top Device</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-2 gap-6 animate-fade-in" style={{ marginBottom: 'var(--space-8)', animationDelay: '0.1s' }}>
          
          {/* Clicks Over Time (Line Chart) */}
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Clicks Over Time</h3>
            {data.clicksOverTime.length > 0 ? (
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={data.clicksOverTime} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="date" stroke="var(--color-text-muted)" />
                    <YAxis stroke="var(--color-text-muted)" allowDecimals={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-md)' }}
                    />
                    <Line type="monotone" dataKey="clicks" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted text-center">No timeline data available yet.</p>
            )}
          </div>

          {/* Browser Distribution (Pie Chart) */}
          <div className="card">
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Browsers</h3>
            {data.browsers.length > 0 ? (
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={data.browsers}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.browsers.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-md)' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted text-center">No browser data available.</p>
            )}
          </div>

          {/* Device Distribution (Pie Chart) */}
          <div className="card">
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Devices</h3>
            {data.devices.length > 0 ? (
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={data.devices}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.devices.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-md)' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted text-center">No device data available.</p>
            )}
          </div>

        </div>

        {/* Referrer Table (Recent Visits analogue via aggregated referrers) */}
        <div className="card animate-fade-in" style={{ marginBottom: 'var(--space-8)' }}>
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Top Referrers</h3>
          {data.referrers.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: 'var(--space-3)' }}>Referrer</th>
                    <th style={{ padding: 'var(--space-3)' }}>Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {data.referrers.map((ref, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: 'var(--space-3)' }}>{ref.name || 'Direct'}</td>
                      <td style={{ padding: 'var(--space-3)' }}>{ref.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted text-center">No referrer data available.</p>
          )}
        </div>

      </div>
    </main>
  );
};

export default Analytics;
